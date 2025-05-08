// lib/authOptions.ts
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/firebase/firebaseAdmin";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import type { SessionStrategy, Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { AdapterUser } from 'next-auth/adapters';
import { Users } from "@/app/types/users";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        await initAdmin();
        const db = getFirestore();
        const { username, password } = credentials!;

        const querySnapshot = await db
          .collection('Users')
          .where('username', '==', username)
          .get();

        if (querySnapshot.empty) throw new Error('No user found');

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const match = await bcrypt.compare(password, userData.password);
        if (!match) throw new Error('Wrong password');

        return {
          id: userDoc.id,
          username: userData.username,
          firstname: userData.firstname,
          lastname: userData.lastname,
          department: userData.department,
          role: userData.role,
        };
      }
    })
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    logout: '/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User | AdapterUser | Users }) {
      if (user && 'role' in user) {
        token.role = user.role;
        token.username = user.username;
        token.firstname = user.firstname;
        token.lastname = user.lastname;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
        session.user.username = token.username as string | undefined;
        session.user.firstname = token.firstname as string | undefined;
        session.user.lastname = token.lastname as string | undefined;
        session.user.department = token.department as string | undefined;
      }
      return session;
    }
  }
};

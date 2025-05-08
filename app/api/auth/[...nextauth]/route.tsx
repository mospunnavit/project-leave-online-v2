import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { SessionStrategy, Session, User} from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import { Users } from '@/app/types/users';
import type { AdapterUser } from 'next-auth/adapters'
import { getFirestore } from "firebase-admin/firestore";
import { initAdmin } from "@/firebase/firebaseAdmin";
import bcrypt from 'bcryptjs';
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

        // ใช้ .collection().where().get() จาก Admin SDK โดยตรง
        const querySnapshot = await db
          .collection('Users')
          .where('username', '==', username)
          .get();

        if (querySnapshot.empty) {
          throw new Error('No user found with this username');
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const passwordMatch = await bcrypt.compare(password, userData.password);
        if (!passwordMatch) {
          throw new Error('Incorrect password');
        }

        return {
          id: userDoc.id,
          username: userData.username,
          firstname: userData.firstname,
          lastname: userData.lastname,
          department: userData.department,
          role: userData.role, // ต้องมีใน Firestore ด้วย
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
        token.role = user.role as string;
        token.username = user.username as string;
        token.firstname = user.firstname as string;
        token.lastname = user.lastname as string;
        token.department = user.department as string;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.username = token.username as string;
        session.user.firstname = token.firstname as string;
        session.user.lastname = token.lastname as string;
        session.user.department = token.department as string;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

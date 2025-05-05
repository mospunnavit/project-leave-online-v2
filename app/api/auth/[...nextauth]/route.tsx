import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { SessionStrategy, Session, User} from 'next-auth';
import { db } from '@/firebase/clientApp';
import { collection, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';
import type { JWT } from 'next-auth/jwt';
import { Users } from '@/app/types/users';
import type { AdapterUser } from 'next-auth/adapters'


export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const { email, password } = credentials!;
        const userRef = collection(db, 'Users');
        const q = query(userRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          throw new Error('No user found with this email');
        }

        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (!passwordMatch) {
          throw new Error('Invalid password');
        }

        return {
          id: userDoc.id,
          email: userData.email,
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
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

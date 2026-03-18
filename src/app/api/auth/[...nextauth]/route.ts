import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import {
  getUserByEmail,
  upsertGoogleUser,
  verifyCredentials,
} from "@/services/userService";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const parsed = CredentialsSchema.safeParse(credentials);
      if (!parsed.success) return null;

      const result = await verifyCredentials(parsed.data);
      if (!result.ok) return null;

      return {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        image: result.user.image,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email || !account.providerAccountId) return false;

        await upsertGoogleUser({
          email: user.email,
          googleId: account.providerAccountId,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.uid = user.id;
      }

      if (!token.uid && token.email) {
        const dbUser = await getUserByEmail(token.email);
        if (dbUser) token.uid = dbUser._id.toString();
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) {
        session.user.id = token.uid;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

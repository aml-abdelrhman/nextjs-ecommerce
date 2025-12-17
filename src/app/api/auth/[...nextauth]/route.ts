import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Admin from "@/models/Admin";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "user" | "admin";
      token?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    role: "user" | "admin";
    name: string;
    email: string;
    picture?: string | null;
  }
}

export const authOptions: AuthOptions = {
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Email and password required");

        await dbConnect();
        let user = await User.findOne({ email: credentials.email });
        let role: "user" | "admin" = "user";

        if (!user) {
          const admin = await Admin.findOne({ email: credentials.email });
          if (!admin) throw new Error("No user found");
          const isValid = await bcrypt.compare(credentials.password, admin.password);
          if (!isValid) throw new Error("Incorrect password");
          user = admin;
          role = "admin";
        } else {
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) throw new Error("Incorrect password");
        }

        return { id: user._id.toString(), name: user.name, email: user.email, role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as "user" | "admin";
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.token = token.id as string;
      return session;
    },
  },
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
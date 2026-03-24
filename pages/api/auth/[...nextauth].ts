import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.senha) return null;

        const usuario = await prisma.usuario.findUnique({
          where: { email: credentials.email },
        });

        if (!usuario || !usuario.senha) return null;

        const senhaValida = await bcrypt.compare(credentials.senha, usuario.senha);
        if (!senhaValida) return null;

        return {
          id: usuario.id,
          name: usuario.nome,
          email: usuario.email,
          papel: usuario.papel,
        };
      },
    }),
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 dias de persistência
    updateAge: 24 * 60 * 60,   // Atualiza o token a cada 24 horas
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // Mantém o JWT por 30 dias
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60, // Força a expiração do cookie para 30 dias
      },
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      const adminEmails = ["ciellolisboa023@gmail.com", "silvacilios082@gmail.com"];
      
      if (!user.email || !adminEmails.includes(user.email)) {
        return false;
      }

      if (account?.provider === "google") {
        const usuarioExistente = await prisma.usuario.findUnique({
          where: { email: user.email },
        });

        if (!usuarioExistente) {
          await prisma.usuario.create({
            data: {
              nome: user.name || "Admin Google",
              email: user.email,
              papel: "admin",
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Se for login via Google, precisamos buscar o papel no banco se o usuário acabou de logar
        if (account?.provider === "google") {
           const dbUser = await prisma.usuario.findUnique({
             where: { email: user.email! }
           });
           token.id = dbUser?.id || user.id;
           token.papel = dbUser?.papel || "usuario";
        } else {
          token.id = user.id;
          token.papel = (user as any).papel;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.papel = token.papel as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
};

export default NextAuth(authOptions);

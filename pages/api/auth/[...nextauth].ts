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
    maxAge: 3650 * 24 * 60 * 60, // 10 anos (praticamente permanente)
    updateAge: 24 * 60 * 60,    // Atualiza o token a cada 24 horas
  },
  jwt: {
    maxAge: 3650 * 24 * 60 * 60, // 10 anos
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === "production",
        maxAge: 3650 * 24 * 60 * 60, // 10 anos
      },
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        const userEmail = user.email?.toLowerCase().trim();
        if (!userEmail) return false;

        const allowedEmailsEnv = process.env.ADMIN_EMAILS || "";
        const envEmails = allowedEmailsEnv.split(",").map(e => e.trim().toLowerCase()).filter(Boolean);
        
        // Lista definitiva de e-mails mestres (Sempre terão acesso)
        const masterEmails = ["ciellolisboa023@gmail.com", "silvacilios082@gmail.com"];
        
        const allAllowed = [...new Set([...envEmails, ...masterEmails])];
        
        console.log("Processando login para:", userEmail);
        
        if (!allAllowed.includes(userEmail)) {
          console.error("ACESSO NEGADO: E-mail não autorizado:", userEmail);
          return false;
        }

        if (account?.provider === "google") {
          const usuarioExistente = await prisma.usuario.findUnique({
            where: { email: userEmail },
          });

          if (!usuarioExistente) {
            await prisma.usuario.create({
              data: {
                nome: user.name || "Admin Google",
                email: userEmail,
                papel: "admin",
              },
            });
          } else if (usuarioExistente.papel !== "admin") {
            // Garante que se o e-mail está na lista, ele seja admin no banco
            await prisma.usuario.update({
              where: { email: userEmail },
              data: { papel: "admin" }
            });
          }
        }
        return true;
      } catch (error) {
        console.error("ERRO CRÍTICO NO SIGNIN:", error);
        // Em caso de erro de banco, se o e-mail for autorizado, permite o login
        return true; 
      }
    },
    async jwt({ token, user, account }) {
      if (user) {
        // Se for login via Google, precisamos buscar o papel no banco se o usuário acabou de logar
        if (account?.provider === "google" && user.email) {
           const dbUser = await prisma.usuario.findUnique({
             where: { email: user.email.toLowerCase() }
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

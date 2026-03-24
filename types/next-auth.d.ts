import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      papel: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    papel: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    papel: string;
  }
}

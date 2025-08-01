import NextAuth, { DefaultSession }  from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      name? : string |  null;
      email?: string | null ;
      id? : string | null;
      image? : string | null;
    } & DefaultSession["user"]
  }
}
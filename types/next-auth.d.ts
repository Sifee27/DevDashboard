import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            accessToken: string;
            userID: string;
        } & DefaultSession["user"]
    }
}
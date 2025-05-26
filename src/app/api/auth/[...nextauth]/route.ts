import NextAuth from "next-auth/next";
import GithubProvider from "next-auth/providers/github";

// Ensure environment variables are set during runtime
const githubId = process.env.GITHUB_ID || '';
const githubSecret = process.env.GITHUB_SECRET || '';
const jwtSecret = process.env.JWT_SECRET || '';

// Create the NextAuth handler with configuration
const handler = NextAuth({
    providers: [
        GithubProvider({
            clientId: githubId,
            clientSecret: githubSecret
        })
    ],
    // Add additional configuration if needed
    pages: {
        signIn: '/login'
    },
    secret: jwtSecret
});

export { handler as GET, handler as POST }
import GoogleProvider from "next-auth/providers/google";
import connectDb from "./connectDb";
import User from "@/models/user";
import { userInterface } from "@/models/user";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async signIn({ user, account }: any) {
            if (account?.provider == 'google') {
                // do registration here // 
                try {
                    connectDb();
                    const existing_user = await User.findOne({ email: user.email });
                    if (existing_user) {
                        user.id = String(existing_user._id);
                    }
                    else {
                        const userObj:userInterface = {
                            name: user.name , 
                            email : user.email,
                        }
                        const new_user = await User.create(userObj);
                        user.id = String(new_user._id);
                    }

                } catch (err) {
                    console.log((err as Error)?.message);
                    user.id = 'not_found!';
                }
            }
            return true
        },
        async session({ session, token }: any) {
            if (token.sub) {
                session.user.id = token.sub;
            }
            return session
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.id = user.id;
            }
            return token
        }
    },
    session: {
        strategy: "jwt" as const, 
        maxAge: 2 * 24 * 60 * 60
    },
    secret: process.env.AUTH_SECRET
}
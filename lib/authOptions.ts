import GoogleProvider from "next-auth/providers/google";
import connectDb from "./connectDb";
import User from "@/models/user";
import { userInterface } from "@/models/user";
import {Session, User as nextAuthUser, Account} from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async signIn({ user, account }: {user : nextAuthUser , account: Account | null} ) {
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
                            name: user.name! , 
                            email : user.email!,
                        }
                        const new_user = await User.create(userObj);
                        user.id = String(new_user._id);
                    }

                } catch(err){
                    user.id = 'not_found!';
                    console.log((err as Error)?.message);
                }
            }
            return true
        },
        async session({ session, token }: {session:Session,token:JWT}) {
            if (token.sub) {
                session.user.id = token.sub;
            }
            return session
        },
        async jwt({ token, user }:{user?: nextAuthUser,token:JWT}) {
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
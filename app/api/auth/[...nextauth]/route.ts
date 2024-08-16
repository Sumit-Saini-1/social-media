import NextAuth, { AuthOptions, NextAuthOptions, SessionStrategy } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import User, { IUser } from '@/models/User';
import dbConnect from '@/lib/mongodb';

declare module 'next-auth' {
    interface User {
        id: string;
        email: string;
        username: string;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                emailOrUsername: { label: 'Email or Username', type: 'text', placeholder: 'Email or Username' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                // Find the user by email
                await dbConnect();
                const user = await User.findOne({
                    $or: [{ email: credentials?.emailOrUsername }, { username: credentials?.emailOrUsername }],
                });

                if (!user) {
                    throw new Error('No user found with the email');
                }
                if (!credentials) {
                    throw new Error('No credentials provided');
                }
                // Check if the password is correct
                if (user.password) {

                    // const isValid =await compare(credentials.password, user.password);
                    const isValid = credentials.password === user.password;

                    if (!isValid) {
                        throw new Error('Invalid password');
                    }
                } else {
                    throw new Error('User password is undefined');
                }

                // If successful, return the user object
                return { id: user._id, email: user.email, name: user.name, username: user.username, profilePic: user.profilePic };
            },
        }),
    ],
    session: {
        strategy: 'jwt' as SessionStrategy,
        maxAge: 60 * 60,
        updateAge: 10 * 60,
    },
    callbacks: {
        async jwt({ token, user }) {

            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: JWT }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.username = token.username as string;
            }
            // console.log(68, session);
            return session;
        },
    },
    pages: {
        signIn: '/login', // Customize the login page
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

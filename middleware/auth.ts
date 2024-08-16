import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/','/notification'];

export async function authMiddleware(req: NextRequest): Promise<NextResponse> {
    const token = req.cookies.get('next-auth.session-token')?.value;

    // const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    // console.log('Session:', session);

    if (protectedRoutes.includes(req.nextUrl.pathname)) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

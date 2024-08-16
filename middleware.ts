import { NextRequest, NextResponse } from 'next/server';
import { loggingMiddleware } from './middleware/logger';
import { authMiddleware } from './middleware/auth';

export async function middleware(req: NextRequest): Promise<NextResponse> {
    // Run the logging middleware first
    const logResponse = loggingMiddleware(req);
    if (logResponse.headers.has('Location')) return logResponse;

    // Then run the authentication middleware
    const authResponse = await authMiddleware(req);
    if (authResponse.headers.has('Location')) {
        return authResponse;
    }
    return NextResponse.next();
}

// Apply middleware to the specified routes
export const config = {
    matcher: ['/','/notification'],
};
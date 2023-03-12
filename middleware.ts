import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/dashboard/trips', request.url));
  }
}

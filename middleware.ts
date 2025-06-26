import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname; 
  const now = Math.floor(Date.now() / 1000);
  const apiPath = '/api/v2';
  // ถ้าไม่มี token ให้ redirect ไป /login พร้อม query expired=1
  if (!token) {
    if (path !== '/login') { // ป้องกัน redirect loop
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('expired', '1');
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // เช็คเวลาหมดอายุ token (exp เป็นวินาที)
  if (token.exp && (token.exp as number) < now) {
    if (path !== '/login') {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('expired', '1');
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // ถ้า login แล้วพยายามเข้า /login ให้ redirect ไปหน้า dashboard (ตาม role หรือ default)
  if (path === '/login') {
    return NextResponse.redirect(new URL('/pages/dashboard/user', req.url)); // แก้เป็น path จริง
  }

  // เช็ค role สำหรับ admin path
  if ((path.startsWith('/pages/dashboard/admin') || path.startsWith(apiPath + '/admin')) && token.role !== 'admin') {
    console.log(apiPath + '/admin');
    console.log(token.role);
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  // เช็ค role สำหรับ user path — อนุญาตหลาย role ที่กำหนด
  if (path.startsWith('/pages/dashboard/user') && !(token.role === 'user' || token.role === 'head' || token.role === 'manager' || token.role === 'hr' || token.role === 'admin')) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next|favicon.ico).*)', // ✅ ยกเว้น /api/auth/*
    '/api/v2/:path*',                      // ✅ ตรวจเฉพาะ /api/v2/*
  ],
};
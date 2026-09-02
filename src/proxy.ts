import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { publicEnv } from '@/config/env';

/**
 * Keeps the admin session fresh, and keeps everyone else out of `/admin`.
 *
 * This is a coarse gate, not the security boundary: it checks only that a
 * Supabase session cookie resolves to a user, because this layer should not be
 * querying tables. Whether that user is actually an admin is decided by
 * `requireAdmin` on every page and action, and by row-level security beneath
 * both. A visitor with a valid non-admin account gets past here and no further.
 *
 * Named `proxy` rather than `middleware`: Next 16 deprecated that convention.
 */
export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request });

  const url = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  const key = publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // With no database there is no admin panel to protect; send anyone who finds
  // the URL to the setup notice rather than a crash.
  if (!url || !key) {
    return request.nextUrl.pathname.startsWith('/admin')
      ? NextResponse.rewrite(new URL('/admin/setup', request.url))
      : response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        for (const { name, value, options } of list) response.cookies.set(name, value, options);
      },
    },
  });

  const { data } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLogin = pathname === '/admin/login';
  const isSetup = pathname === '/admin/setup';

  if (!data.user && !isLogin && !isSetup) {
    const login = new URL('/admin/login', request.url);
    login.searchParams.set('next', pathname);
    return NextResponse.redirect(login);
  }

  if (data.user && isLogin) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return response;
}

export const config = {
  // Only the panel. The public site never pays for this.
  matcher: ['/admin/:path*'],
};

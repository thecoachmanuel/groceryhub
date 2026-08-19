import { NextRequest, NextResponse } from 'next/server';

/**
 * GroceryHub Route Protection Middleware
 *
 * Reads `auth_token` and `user_role` cookies set at login/registration.
 * - Redirects unauthenticated users attempting to access protected routes to the appropriate login page.
 * - Redirects already authenticated users away from login/register pages to their dashboard.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const authToken = req.cookies.get('auth_token')?.value;
  const userRole = req.cookies.get('user_role')?.value;

  // ─── Admin Protected Routes ─────────────────────────────────────────────────
  const adminRoutes = [
    '/admin/dashboard',
    '/admin/orders',
    '/admin/products',
    '/admin/users',
    '/admin/sellers',
    '/admin/delivery-boys',
    '/admin/reports',
    '/admin/settings',
    '/admin/notifications',
    '/admin/coupons',
    '/admin/banners',
    '/admin/categories',
    '/admin/brands',
    '/admin/areas',
    '/admin/cities',
    '/admin/timeslots',
    '/admin/pos',
    '/admin/return-requests',
    '/admin/feedback',
    '/admin/taxes',
    '/admin/store-setting',
    '/admin/payment-methods',
    '/admin/system-users',
    '/admin/send-mail',
  ];

  // ─── Seller Protected Routes ────────────────────────────────────────────────
  const sellerRoutes = [
    '/seller/dashboard',
    '/seller/orders',
    '/seller/products',
    '/seller/earnings',
    '/seller/reports',
    '/seller/wallet',
    '/seller/withdrawal',
    '/seller/return-requests',
    '/seller/pos',
    '/seller/stock',
    '/seller/profile',
  ];

  // ─── Rider Protected Routes ─────────────────────────────────────────────────
  const riderRoutes = [
    '/delivery/dashboard',
    '/delivery/orders',
    '/delivery/earnings',
    '/delivery/profile',
  ];

  const isPaystackCallback = req.nextUrl.searchParams.has('reference') || req.nextUrl.searchParams.has('trxref');

  // ─── Customer Protected Routes ──────────────────────────────────────────────
  const customerRoutes = [
    '/profile',
    '/wallet',
  ];

  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r));
  const isSellerRoute = sellerRoutes.some((r) => pathname.startsWith(r));
  const isRiderRoute = riderRoutes.some((r) => pathname.startsWith(r));
  const isCustomerRoute = customerRoutes.some((r) => pathname.startsWith(r));

  // ─── Redirect Already Authenticated Users Away From Login Pages ─────────────
  if (authToken && userRole) {
    if (pathname === '/admin/login' && userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }
    if (pathname === '/seller/login' && userRole === 'seller') {
      return NextResponse.redirect(new URL('/seller/dashboard', req.url));
    }
    if (pathname === '/delivery/login' && userRole === 'delivery') {
      return NextResponse.redirect(new URL('/delivery/dashboard', req.url));
    }
    if ((pathname === '/login' || pathname === '/register') && userRole === 'user') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // ─── Login/Register Pages — allow through if not redirected above ─────────
  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/admin/login' ||
    pathname === '/seller/login' ||
    pathname === '/seller/register' ||
    pathname === '/delivery/login' ||
    pathname === '/delivery/register' ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname === '/forgot-password'
  ) {
    return NextResponse.next();
  }

  // ─── Enforce Admin Routes ────────────────────────────────────────────────────
  if (isAdminRoute) {
    if (!authToken || userRole !== 'admin') {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // ─── Enforce Seller Routes ───────────────────────────────────────────────────
  if (isSellerRoute) {
    if (!authToken || userRole !== 'seller') {
      const url = req.nextUrl.clone();
      url.pathname = '/seller/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // ─── Enforce Rider Routes ────────────────────────────────────────────────────
  if (isRiderRoute) {
    if (!authToken || userRole !== 'delivery') {
      const url = req.nextUrl.clone();
      url.pathname = '/delivery/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // ─── Enforce Customer Routes ─────────────────────────────────────────────────
  if (isCustomerRoute) {
    if (!authToken || userRole !== 'user') {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|uploads).*)',
  ],
};

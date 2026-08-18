import { NextRequest, NextResponse } from 'next/server';

/**
 * GroceryHub Route Protection Middleware
 *
 * Reads `auth_token` and `user_role` cookies set at login.
 * Redirects unauthenticated users to the appropriate login page,
 * preserving the destination path as `?redirect=` for post-login redirect.
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

  // ─── Customer Protected Routes ──────────────────────────────────────────────
  const customerRoutes = [
    '/profile',
    '/order-history',
    '/checkout',
    '/wallet',
    '/cart',
  ];

  const isAdminRoute = adminRoutes.some((r) => pathname.startsWith(r));
  const isSellerRoute = sellerRoutes.some((r) => pathname.startsWith(r));
  const isRiderRoute = riderRoutes.some((r) => pathname.startsWith(r));
  const isCustomerRoute =
    customerRoutes.some((r) => pathname.startsWith(r)) ||
    pathname.startsWith('/track/');

  // ─── Already on login pages — allow through ─────────────────────────────────
  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/seller/login' ||
    pathname === '/seller/register' ||
    pathname === '/delivery/login' ||
    pathname === '/delivery/register' ||
    pathname === '/admin/login' ||
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
    /*
     * Match all request paths except:
     * - API routes
     * - Next.js internals (_next/static, _next/image, favicon.ico)
     * - Public images and other static assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|icons|uploads).*)',
  ],
};

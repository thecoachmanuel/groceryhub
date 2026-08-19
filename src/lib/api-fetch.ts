/**
 * api-fetch.ts — Universal authenticated fetch wrapper
 *
 * Automatically:
 * 1. Injects Authorization: Bearer <token> from localStorage
 * 2. On 401: silently retries after refreshing session from /api/auth/me
 * 3. On repeated 401: clears session and shows expired message
 *
 * Usage: replace `fetch('/api/...')` with `apiFetch('/api/...')`
 */

export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Get the appropriate token based on user role
  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return (
      localStorage.getItem('groceryhub_token') ||
      localStorage.getItem('groceryhub_seller_token') ||
      localStorage.getItem('groceryhub_rider_token') ||
      localStorage.getItem('groceryhub_admin_token') ||
      null
    );
  };

  const buildHeaders = (extra: HeadersInit = {}): HeadersInit => {
    const token = getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(extra as Record<string, string>),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // First attempt
  const response = await fetch(url, {
    ...options,
    headers: buildHeaders(options.headers),
  });

  // If not 401, return as-is
  if (response.status !== 401) {
    return response;
  }

  // ── 401 received: try session refresh ────────────────────────────────────
  const token = getToken();
  if (!token) {
    // No token at all — redirect to login
    clearSessionAndRedirect();
    return response;
  }

  try {
    const refreshRes = await fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (refreshRes.ok) {
      const json = await refreshRes.json();
      if (json.success && json.data?.user) {
        const u = json.data.user;
        // Update localStorage with fresh profile data
        if (u.role === 'user') {
          const existing = JSON.parse(localStorage.getItem('groceryhub_user') || '{}');
          localStorage.setItem('groceryhub_user', JSON.stringify({ ...existing, ...u, role: 'user' }));
        } else if (u.role === 'seller') {
          const existing = JSON.parse(localStorage.getItem('groceryhub_seller') || '{}');
          localStorage.setItem('groceryhub_seller', JSON.stringify({ ...existing, ...u, role: 'seller' }));
        } else if (u.role === 'delivery') {
          const existing = JSON.parse(localStorage.getItem('groceryhub_rider') || '{}');
          localStorage.setItem('groceryhub_rider', JSON.stringify({ ...existing, ...u, role: 'delivery' }));
        }

        // Retry the original request once with the same token (server confirmed it's valid)
        const retryResponse = await fetch(url, {
          ...options,
          headers: buildHeaders(options.headers),
        });
        return retryResponse;
      }
    }

    // Refresh also failed — session is truly expired
    clearSessionAndRedirect();
    return response;
  } catch {
    // Network error during refresh — return original 401
    return response;
  }
}

function clearSessionAndRedirect() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('groceryhub_user');
  localStorage.removeItem('groceryhub_token');
  localStorage.removeItem('groceryhub_seller');
  localStorage.removeItem('groceryhub_seller_token');
  localStorage.removeItem('groceryhub_rider');
  localStorage.removeItem('groceryhub_rider_token');
  // Small delay so in-flight state updates settle before redirect
  setTimeout(() => {
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/seller')) {
      window.location.href = '/seller/login?expired=1';
    } else if (currentPath.startsWith('/delivery')) {
      window.location.href = '/delivery/login?expired=1';
    } else if (currentPath.startsWith('/admin')) {
      window.location.href = '/admin/login?expired=1';
    } else {
      window.location.href = '/login?expired=1';
    }
  }, 100);
}

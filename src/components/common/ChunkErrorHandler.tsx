'use client';

import { useEffect } from 'react';

/**
 * ChunkErrorHandler
 * Automatically recovers from Next.js ChunkLoadError that occurs when Vercel
 * deploys a new build. Old JS bundle hashes become stale, causing navigation
 * failures. This handler detects the error and reloads once with fresh chunks.
 */
export default function ChunkErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const msg = event?.message || '';
      const isChunkError =
        msg.includes('ChunkLoadError') ||
        msg.includes('Loading chunk') ||
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('Importing a module script failed');

      if (isChunkError) {
        // Prevent infinite reload loop — only reload once per session
        const alreadyRefreshed = sessionStorage.getItem('chunk_reload_attempted');
        if (!alreadyRefreshed) {
          sessionStorage.setItem('chunk_reload_attempted', '1');
          console.warn('GroceryHub: ChunkLoadError detected after new deployment. Auto-reloading with fresh bundles...');
          window.location.reload();
        }
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const msg = String(event?.reason?.message || event?.reason || '');
      const isChunkError =
        msg.includes('ChunkLoadError') ||
        msg.includes('Loading chunk') ||
        msg.includes('Failed to fetch dynamically imported module');

      if (isChunkError) {
        const alreadyRefreshed = sessionStorage.getItem('chunk_reload_attempted');
        if (!alreadyRefreshed) {
          sessionStorage.setItem('chunk_reload_attempted', '1');
          console.warn('GroceryHub: Async ChunkLoadError detected. Auto-reloading...');
          window.location.reload();
        }
      }
    };

    // Clear the reload flag after successful navigation (prevents permanent lockout)
    const clearReloadFlag = () => {
      sessionStorage.removeItem('chunk_reload_attempted');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('load', clearReloadFlag);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('load', clearReloadFlag);
    };
  }, []);

  return null; // purely behavioral, no UI
}

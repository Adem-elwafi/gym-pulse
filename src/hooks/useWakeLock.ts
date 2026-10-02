import { useEffect, useRef, useCallback } from 'react';

export function useWakeLock(enabled: boolean = true) {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  const requestLock = useCallback(async () => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) {
      return;
    }
    try {
      if (!sentinelRef.current || sentinelRef.current.released) {
        sentinelRef.current = await navigator.wakeLock.request('screen');
        sentinelRef.current.addEventListener('release', () => {
          sentinelRef.current = null;
        });
      }
    } catch {
      // Screen Wake Lock could fail due to low battery, system policy, etc.
    }
  }, []);

  const releaseLock = useCallback(async () => {
    if (sentinelRef.current) {
      try {
        await sentinelRef.current.release();
      } catch {
        // Silently ignore release failure
      } finally {
        sentinelRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      releaseLock();
      return;
    }

    requestLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enabled) {
        requestLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      releaseLock();
    };
  }, [enabled, requestLock, releaseLock]);

  return { requestLock, releaseLock };
}

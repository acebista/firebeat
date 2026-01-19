// App Version - Increment this to force all users to refresh
// Format: YYYYMMDD-HHmm
export const APP_VERSION = '20260119-0727';

// Check if the app needs a forced refresh
export const checkAppVersion = (): boolean => {
    const storedVersion = localStorage.getItem('app_version');

    if (storedVersion !== APP_VERSION) {
        console.log(`[AppVersion] Version mismatch: stored=${storedVersion}, current=${APP_VERSION}`);
        return true; // Needs refresh
    }

    return false;
};

// Mark the current version as loaded
export const markVersionLoaded = (): void => {
    localStorage.setItem('app_version', APP_VERSION);
    console.log(`[AppVersion] Version ${APP_VERSION} marked as loaded`);
};

// Force a hard refresh, clearing all caches
export const forceHardRefresh = (): void => {
    console.log('[AppVersion] Forcing hard refresh...');

    // Clear all caches
    if ('caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => {
                caches.delete(name);
                console.log(`[AppVersion] Cleared cache: ${name}`);
            });
        });
    }

    // Clear service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            registrations.forEach(registration => {
                registration.unregister();
                console.log('[AppVersion] Unregistered service worker');
            });
        });
    }

    // Clear localStorage draft orders (old stale data)
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('draft_order_')) {
            localStorage.removeItem(key);
            console.log(`[AppVersion] Cleared stale draft: ${key}`);
        }
    });

    // Update version marker BEFORE reload
    localStorage.setItem('app_version', APP_VERSION);

    // Force reload from server (bypass cache)
    setTimeout(() => {
        window.location.reload();
    }, 100);
};

// Check and apply version update
export const initVersionCheck = (): void => {
    if (checkAppVersion()) {
        console.log('[AppVersion] New version detected, forcing refresh...');
        forceHardRefresh();
    } else {
        markVersionLoaded();
    }
};

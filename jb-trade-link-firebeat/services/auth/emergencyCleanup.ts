/**
 * EMERGENCY: Force clear all browser storage
 * Available as window.emergencyStorageClear() for manual recovery
 */
export function emergencyStorageClear(): void {
    try {
        localStorage.clear();
        sessionStorage.clear();

        // Clear cookies
        document.cookie.split(";").forEach((c) => {
            document.cookie = c
                .replace(/^ +/, "")
                .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });

        if (process.env.NODE_ENV === 'development') {
            console.log('Emergency clear complete - refresh page');
        }

        // Auto-reload after brief delay
        setTimeout(() => window.location.reload(), 500);
    } catch (e) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Emergency clear failed:', e);
        }
    }
}

// Make available globally for emergency use
if (typeof window !== 'undefined') {
    (window as any).emergencyStorageClear = emergencyStorageClear;
}

# Inactivity Timeout Implementation Guide

## Overview

The application now includes an automatic logout mechanism that logs out users after **3 hours of inactivity**. This improves security by preventing unauthorized access on unattended sessions.

## How It Works

### Activity Detection

The system tracks the following user interactions:
- `mousedown` - Mouse clicks or button presses
- `keydown` - Keyboard input
- `scroll` - Page scrolling
- `touchstart` - Touch screen interaction
- `click` - Any element clicks

### Timer Reset

Whenever ANY of these events occur, the inactivity timer is reset to 3 hours. This means:

```
User types a message
    ↓
keydown event triggered
    ↓
Timer resets to 3 hours
    ↓
User continues with 3 more hours before timeout
```

### Automatic Logout

If NO activity occurs for 3 hours:

```
Timer reaches 3 hours
    ↓
logout() is called automatically
    ↓
Session cleared from Supabase
    ↓
Local auth data cleared (clearStaleUserData)
    ↓
User redirected to login page
```

## Implementation Details

### Location
`services/auth/AuthProvider.tsx` - Inactivity effect (lines ~155-185)

### Code
```typescript
useEffect(() => {
    const INACTIVITY_TIMEOUT = 3 * 60 * 60 * 1000; // 3 hours = 10,800,000ms
    let inactivityTimer: NodeJS.Timeout;

    const resetInactivityTimer = () => {
        clearTimeout(inactivityTimer);
        
        // Only set timer if user is authenticated
        if (state.status === AuthStatus.AUTHENTICATED) {
            inactivityTimer = setTimeout(() => {
                console.warn('User inactive for 3 hours, logging out...');
                logout();
            }, INACTIVITY_TIMEOUT);
        }
    };

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
        window.addEventListener(event, resetInactivityTimer);
    });

    // Initialize timer
    resetInactivityTimer();

    return () => {
        clearTimeout(inactivityTimer);
        events.forEach(event => {
            window.removeEventListener(event, resetInactivityTimer);
        });
    };
}, [state.status]); // Re-setup when auth status changes
```

### Why Re-setup on Auth Status Change?

The effect dependency `[state.status]` ensures:
- Timer only runs when `state.status === AuthStatus.AUTHENTICATED`
- Timer is properly cleaned up on logout
- Timer resets when user logs back in

## User Experience

### Happy Path
```
User logs in
    ↓
User works for 2 hours (events keep resetting timer)
    ↓
User takes a 30-minute break (no activity)
    ↓
User comes back and clicks (activity detected, timer resets)
    ↓
User continues working (session preserved)
```

### Timeout Path
```
User logs in
    ↓
User works for 2 hours
    ↓
User steps away (3 hours of no activity)
    ↓
Automatic logout triggered
    ↓
Console log: "User inactive for 3 hours, logging out..."
    ↓
User redirected to login
    ↓
Toast shown: "Your session has expired"
```

## Security Benefits

1. **Unattended Sessions**: Prevents access to unattended computers
2. **Compliance**: Meets security requirements (3-hour inactivity)
3. **Force Re-authentication**: Users must log in again to continue
4. **Logging**: Console logs when timeout occurs (for audit trails)

## Configuration

To change the timeout duration, modify `AuthProvider.tsx`:

```typescript
// Current: 3 hours
const INACTIVITY_TIMEOUT = 3 * 60 * 60 * 1000;

// To change to 2 hours:
const INACTIVITY_TIMEOUT = 2 * 60 * 60 * 1000;

// To change to 1 hour:
const INACTIVITY_TIMEOUT = 1 * 60 * 60 * 1000;

// To change to 30 minutes:
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;
```

## Testing

### Test Automatic Logout After 3 Hours

1. Log in to the application
2. Keep the window open without interacting
3. After 3 hours of no activity, you should be logged out

### Test Activity Detection

1. Log in to the application
2. Wait 2 hours
3. Perform an action (click, type, scroll)
4. Session should remain active
5. Timer resets to 3 hours

### Test Activity Events

Open browser console and monitor:
```javascript
// Add this to see inactivity events
window.addEventListener('mousedown', () => console.log('Activity: mousedown'));
window.addEventListener('keydown', () => console.log('Activity: keydown'));
window.addEventListener('scroll', () => console.log('Activity: scroll'));
window.addEventListener('touchstart', () => console.log('Activity: touchstart'));
window.addEventListener('click', () => console.log('Activity: click'));
```

## Edge Cases

### Case 1: User Quickly Logs Out
- Logout happens immediately, inactivity timer doesn't trigger
- ✅ Works correctly

### Case 2: User Logs Back In
- New inactivity timer starts
- Previous timer is cleaned up
- ✅ Works correctly

### Case 3: Window Focus Lost
- Events still trigger (timer resets)
- No special handling needed
- ✅ Works correctly (activity in other apps doesn't matter)

### Case 4: User on Different Tab
- Events don't trigger in inactive tab
- Timer runs out
- User gets logged out when switching back
- ✅ Correct behavior (security)

## Browser Compatibility

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support
- ✅ Mobile browsers: Full support (touchstart event)

## Performance Impact

- **Memory**: < 1KB (single timer + event listeners)
- **CPU**: Negligible (only event listeners, no polling)
- **Network**: None (local only)

## Debugging

### View inactivity timer status:
```javascript
// In browser console
localStorage.getItem('auth-user-storage') // See if user data is cleared on logout
```

### Check if timeout is working:
```javascript
// In browser console, set to 10 seconds for testing
// Modify INACTIVITY_TIMEOUT = 10 * 1000 in AuthProvider.tsx
// Then rebuild and test
```

## Future Enhancements

1. **Warning Before Logout**: Show dialog 5 minutes before logout
2. **Extend Session**: Allow users to extend session with one click
3. **Activity Log**: Track what was done before logout
4. **Configurable Timeout**: Let admins set timeout per user role
5. **Different Timeouts**: Different for different modules (e.g., sensitive operations have shorter timeout)

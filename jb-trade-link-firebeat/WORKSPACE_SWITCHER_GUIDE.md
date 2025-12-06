# 🎯 Quick Guide: Workspace Switcher

## What You'll See

When logged in as **admin**, you'll see a workspace switcher in the header:

```
┌─────────────────────────────────────────────────────────────┐
│ [☰] DEV MODE: [⚙️ Admin] [💼 Sales] [🚚 Delivery]  🔔 👤  │
└─────────────────────────────────────────────────────────────┘
```

## How to Use

### Switch to Sales Workspace
1. Click the **💼 Sales** button
2. You'll be taken to Sales Dashboard
3. Sidebar shows sales navigation
4. Button turns green to show it's active

### Switch to Delivery Workspace
1. Click the **🚚 Delivery** button
2. You'll be taken to Delivery Dashboard
3. Sidebar shows delivery navigation
4. Button turns blue to show it's active

### Switch Back to Admin
1. Click the **⚙️ Admin** button
2. You'll be taken to Admin Dashboard
3. Sidebar shows admin navigation
4. Button turns indigo to show it's active

## Visual States

### Active Workspace (Example: Admin)
```
┌──────────────────────────────────────────┐
│ ⚙️ Admin  │  💼 Sales  │  🚚 Delivery   │
│ ▔▔▔▔▔▔▔▔                                │
│ (indigo background, border, shadow)      │
└──────────────────────────────────────────┘
```

### Active Workspace (Example: Sales)
```
┌──────────────────────────────────────────┐
│  ⚙️ Admin  │ 💼 Sales │  🚚 Delivery    │
│             ▔▔▔▔▔▔▔▔                     │
│             (green background)            │
└──────────────────────────────────────────┘
```

## Mobile View

On mobile, you'll see just the icons:

```
┌─────────────────────────────┐
│ [☰]        [⚙️💼🚚] 🔔 👤  │
└─────────────────────────────┘
```

## Session Timeout

### Before
- Logged out after 20 minutes ❌
- Had to login frequently 😤

### Now
- Stay logged in for 1 hour ✅
- Auto-refreshes while active 🔄
- Session persists across browser restarts 💾

## Tips

1. **Use it for testing** - Quickly test different user experiences
2. **No need to logout** - Switch workspaces instantly
3. **Works anywhere** - Available on all pages
4. **Admin only** - Other users won't see it

## Troubleshooting

**Don't see the switcher?**
- Make sure you're logged in as admin
- Refresh the page
- Check browser console for errors

**Switcher not working?**
- Check if you have the latest code
- Run `npm run dev` to restart
- Clear browser cache

**Still logged out too soon?**
- Check Supabase auth settings
- Verify session persistence is enabled
- Check browser console for auth errors

---

**That's it! Happy workspace switching! 🚀**

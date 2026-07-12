# VertexLearn AI — Frontend Authentication Architecture

## Overview

This document describes the complete frontend authentication system for **VertexLearn AI**. The system is **frontend-only** — all backend API calls are represented by mock `fetch` placeholders that can be swapped for real endpoints without changing the calling code.

---

## Authentication Flow

```
Landing Page (index.html)
        │
        ▼
Login Page (login.html)
        │
        ├── Remember Me ──► persist email in localStorage
        │
        ▼
Role Selection (role-selection.html)
        │
        ├── Student   ──► student/dashboard.html
        ├── Instructor ──► instructor/dashboard.html
        └── Admin     ──► admin/dashboard.html
               │
               ▼
     (Token Expiry detected)
               │
               ├── Refresh success  ──► continue
               └── Refresh fails    ──► session-expired.html ──► login.html

Role mismatch on any page
        │
        ▼
unauthorized.html
```

---

## File Structure

```
frontend/
├── role-selection.html          # Workspace role selector
├── unauthorized.html            # 403 Access Denied page
├── session-expired.html         # Session timeout page
│
├── student/
│   └── dashboard.html           # Student placeholder
├── instructor/
│   └── dashboard.html           # Instructor placeholder
├── admin/
│   └── dashboard.html           # Admin placeholder
│
└── assets/
    ├── js/
    │   ├── auth/
    │   │   ├── session.js         # Token CRUD + isAuthenticated + logout
    │   │   ├── auth.js            # API call placeholders (login/logout/refresh)
    │   │   ├── storage.js         # localStorage/sessionStorage helpers
    │   │   ├── role.js            # Role persistence helpers
    │   │   ├── guard.js           # Route + role guard functions
    │   │   ├── token.js           # Token expiry check + silent refresh
    │   │   ├── toast.js           # Toast notification wrapper
    │   │   ├── modal.js           # Logout confirmation modal
    │   │   └── profile-dropdown.js  # Populates user info in headers
    │   │
    │   └── pages/
    │       ├── role-selection.js
    │       ├── unauthorized.js
    │       ├── session-expired.js
    │       └── placeholder-dashboard.js
    │
    └── css/
        └── pages/
            ├── role-selection.css
            ├── unauthorized.css
            ├── session-expired.css
            └── placeholder-dashboard.css
```

---

## Local Storage Keys

| Key                   | Value                       | Notes                         |
|-----------------------|-----------------------------|-------------------------------|
| `vertexlearn_token`   | Mock access token string    | Never store real JWT here     |
| `vertexlearn_refresh` | Mock refresh token string   | Used by token.js refresh flow |
| `vertexlearn_user`    | JSON: `{id, full_name, email, role, avatar_url}` | No password |
| `vertexlearn_role`    | `"student"` / `"instructor"` / `"admin"` | Set after role selection |
| `vertexlearn_theme`   | `"dark"` / `"light"`        | Applied before CSS renders    |
| `remember_email`      | Email string                | Only if Remember Me checked   |

---

## Auth Module API

### `auth/session.js`
```js
SessionManager.saveAccessToken(token, useSession?)
SessionManager.saveRefreshToken(token, useSession?)
SessionManager.getAccessToken()
SessionManager.getRefreshToken()
SessionManager.removeTokens()
SessionManager.isAuthenticated()   // → boolean
SessionManager.logout()            // clears all + redirects /login.html
SessionManager.clearSession()      // clears all storage keys
```

### `auth/guard.js`
```js
Guard.checkAuthentication()        // async; redirects → /login.html if no token
Guard.checkRoleGuard(allowedRoles) // redirects → /unauthorized.html on mismatch
```

### `auth/token.js`
```js
TokenManager.isTokenExpired()      // boolean — uses timestamp in mock token
TokenManager.ensureValidToken()    // async; triggers refresh or → session-expired.html
```

### `auth/auth.js`  *(API Placeholders)*
```js
AuthAPI.login(email, password, useSession?)   // POST /api/auth/login
AuthAPI.logout()                              // POST /api/auth/logout
AuthAPI.refreshToken()                        // POST /api/auth/refresh
AuthAPI.getCurrentUser()                      // reads localStorage
```

---

## Using Guards on a Dashboard Page

```html
<script type="module">
import { Guard } from '../assets/js/auth/guard.js';

document.addEventListener('DOMContentLoaded', async () => {
    const authed = await Guard.checkAuthentication();
    if (!authed) return;

    // Allow only students
    const allowed = Guard.checkRoleGuard('student');
    if (!allowed) return;

    // Safe to render the page now
});
</script>
```

---

## Using Profile Dropdown

Add to any dashboard layout HTML that includes a header with `.user-display-name`, `.user-display-role`, and `.user-display-avatar` class targets. Then import:

```html
<script type="module" src="./assets/js/auth/profile-dropdown.js"></script>
```

Add a logout trigger button:
```html
<button class="logout-trigger-btn">Logout</button>
```

---

## Replacing Mocks with Real API

All API calls are in `assets/js/auth/auth.js`. Replace each `setTimeout` mock with a real `fetch` call:

```js
// Before (mock)
async login(email, password) {
    return new Promise(resolve => setTimeout(() => resolve(mockUser), 1000));
}

// After (real)
async login(email, password) {
    const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
}
```

---

## Security Notes

- **Never store passwords** in localStorage or sessionStorage.
- **Tokens** are mock strings only — in production, use `HttpOnly` cookies for refresh tokens.
- The `checkAuthentication()` guard is a **frontend-only** check; always enforce permissions server-side.
- OTP codes are **never** persisted to storage (only the masked email is).

---

*Built with HTML5 · Bootstrap 5 · Vanilla ES6 · No frameworks*

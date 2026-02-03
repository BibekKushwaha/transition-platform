# @repo/store

Redux Toolkit + RTK Query state management for the Transition monorepo.

## Features

- **Redux Toolkit** for predictable state management
- **RTK Query** for server state, caching, and data fetching
- **TypeScript** fully typed hooks and slices
- **Auth** complete authentication flow (register, login, logout)
- **Cookie-based auth** secure HTTP-only cookies for token storage
- **SSR-ready** works with Next.js App Router

## Installation

Already configured in the monorepo. To add to a new app:

```json
{
  "dependencies": {
    "@repo/store": "*"
  }
}
```

## Usage

### 1. Wrap your app with StoreProvider

```tsx
// app/layout.tsx
import { StoreProvider } from '@repo/store';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
```

### 2. Use typed hooks in components

```tsx
'use client';

import { useAppSelector, useAppDispatch, selectCurrentUser } from '@repo/store';

export default function UserProfile() {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  if (!user) return <div>Not logged in</div>;

  return <div>Welcome, {user.name}!</div>;
}
```

### 3. Use RTK Query hooks for API calls

```tsx
'use client';

import { useLoginMutation, setCredentials, useAppDispatch } from '@repo/store';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({ email, password }).unwrap();
      // Store user in Redux (auth token is in HTTP-only cookie)
      dispatch(setCredentials({ user: result.user }));
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <button onClick={() => handleLogin('user@example.com', 'password')} disabled={isLoading}>
      {isLoading ? 'Logging in...' : 'Login'}
    </button>
  );
}
```

## Available Hooks

### Redux Hooks
- `useAppDispatch()` - Typed dispatch
- `useAppSelector()` - Typed selector
- `useAppStore()` - Access store directly

### Auth Mutations
- `useRegisterMutation()` - Register new user
- `useLoginMutation()` - Login user
- `useLogoutMutation()` - Logout user

### Auth Selectors
- `selectCurrentUser` - Get current user
- `selectIsAuthenticated` - Check auth status

## Authentication Flow

This package uses **HTTP-only cookies** for secure token storage:

1. **Login/Register**: Server sets HTTP-only cookie with auth token
2. **Requests**: RTK Query automatically includes cookies (`credentials: 'include'`)
3. **Client state**: Only user info stored in Redux (no tokens in localStorage)
4. **Logout**: Server clears the cookie

### Server Requirements

Your auth service must:
- Set HTTP-only cookies on login/register
- Accept `credentials: 'include'` in CORS
- Clear cookies on logout

Example Express setup:
```js
import cookieParser from 'cookie-parser';
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());

// Login route
app.post('/api/auth/login', (req, res) => {
  // ... verify credentials
  res.cookie('token', jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
  });
  res.json({ user, success: true });
});
```

## Environment Variables

Set in your Next.js app:

```env
NEXT_PUBLIC_AUTH_SERVICE_URL=http://localhost:4000
```

## Structure

```
packages/store/
├── src/
│   ├── store.ts           # Store configuration
│   ├── hooks.ts           # Typed hooks
│   ├── StoreProvider.tsx  # Provider component
│   ├── slices/
│   │   └── authSlice.ts   # Auth state slice
│   └── services/
│       └── authApi.ts     # RTK Query API
└── package.json
```

## Adding New Slices

1. Create slice file in `src/slices/`:

```ts
import { createSlice } from '@reduxjs/toolkit';

const mySlice = createSlice({
  name: 'myFeature',
  initialState: {},
  reducers: {},
});

export default mySlice.reducer;
```

2. Add to store:

```ts
// store.ts
import myFeatureReducer from './slices/mySlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      myFeature: myFeatureReducer, // Add here
      [authApi.reducerPath]: authApi.reducer,
    },
    // ...
  });
};
```

## Adding New API Endpoints

Extend `authApi` or create new API:

```ts
// services/authApi.ts
export const authApi = createApi({
  // ...
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => '/profile',
    }),
    // Add more endpoints
  }),
});

export const { useGetProfileQuery } = authApi;
```

// Store exports
export { makeStore } from './store';
export type { AppStore, RootState, AppDispatch } from './store';
export { StoreProvider } from './StoreProvider';

// Hooks
export { useAppDispatch, useAppSelector, useAppStore } from './hooks';

// Auth slice
export type { AuthState } from './slices/authSlice';
export {
  setCredentials,
  logout,
  hydrateAuth,
  selectCurrentUser,
  selectIsAuthenticated,
} from './slices/authSlice';
export type { User } from './slices/authSlice';

// Auth API
export {
  authApi,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
} from './services/authApi';
export type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from './services/authApi';

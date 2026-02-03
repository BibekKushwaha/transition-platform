'use client';

import { useAppSelector, selectCurrentUser, selectIsAuthenticated, logout, useAppDispatch } from '@repo/store';

export default function UserNav() {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-700">
        Welcome, {user.name}
      </span>
      <button
        onClick={handleLogout}
        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}

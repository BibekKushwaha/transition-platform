'use client';

import { useRef, useEffect } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from './store';
import { useGetProfileQuery } from './services/authApi';
import { useAppDispatch } from './hooks';
import { hydrateAuth } from './slices/authSlice';

function AuthHydrator() {
  const dispatch = useAppDispatch();
  const { data, isSuccess } = useGetProfileQuery();

  useEffect(() => {
    if (isSuccess && data?.user) {
      dispatch(hydrateAuth({ user: data.user }));
    }
  }, [isSuccess, data, dispatch]);

  return null;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current!}>
      <>
        {children}
        <AuthHydrator />
      </>
    </Provider>
  );
}

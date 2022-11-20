import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { selectUserData } from './authSlice';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

interface useAuthParams {
  redirectTo?: string;
}

export const useAuth = (params?: useAuthParams) => {
  const router = useRouter();
  const userData = useAppSelector(selectUserData());

  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    if (userData) {
      const returnUrl =
        (router.query.returnUrl as string) || params?.redirectTo || '/';
      router.push(returnUrl);
    }
  }, [router, userData, params?.redirectTo]);
};

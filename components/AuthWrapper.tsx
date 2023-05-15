import { useEffect, FC, PropsWithChildren } from 'react';
import { signOut, useSession } from 'next-auth/react';

const AuthWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { status, data: session } = useSession({ required: true });
  useEffect(() => {
    if (session?.error) {
      signOut({ callbackUrl: '/' });
    }
  });

  if (status === 'loading' || session?.error) {
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;

import { useAuth } from '@clerk/clerk-react';
import * as React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AuthGuard: React.FC = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoaded && !userId) {
      navigate('/sign-in');
    }
  }, [isLoaded, userId]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default AuthGuard;

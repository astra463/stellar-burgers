import { useSelector } from '../../../src/services/store';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const location = useLocation();

  if (onlyUnAuth) {
    if (isAuthenticated) {
      return <Navigate replace to='/' state={{ from: location }} />;
    } else {
      return children;
    }
  }

  if (!isAuthenticated) {
    const from = location.state?.from || { pathname: '/' };
    return !isAuthenticated ? children : <Navigate replace to={from} />;
  }

  return children;
};

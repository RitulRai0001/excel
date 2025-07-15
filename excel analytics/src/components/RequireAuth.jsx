import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const { token, user } = useSelector((state) => state.auth);
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default RequireAuth;

import { Outlet, Navigate } from 'react-router-dom';

const PrivateRoutes = () => {
  const token = localStorage.getItem('authToken');
  return token ? <Outlet /> : <Navigate to='/' />;
};

export default PrivateRoutes;
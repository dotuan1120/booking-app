import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import Auth from 'src/views/Auth';
// import Dashboard from 'src/views/Dashboard';
import Landing from '../layout/Landing';

const routes = (isLoggedIn: boolean):RouteObject[] => [
  {
    path: '/',
    element: !isLoggedIn ? <Landing /> : <Navigate to="/dashboard" />,
    children: [
      { path: 'login', element: <Auth authRoute='login'/> },
      { path: 'register', element: <Auth authRoute='register'/> },
    ],
  },
];

export default routes;
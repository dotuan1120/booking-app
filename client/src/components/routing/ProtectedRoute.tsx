import { Navigate, Outlet } from "react-router-dom";
import NavbarMenu from "../layout/NavBarMenu";
import { useAppSelector } from "src/app/hooks";
import { selectIsLoggedIn } from "src/store/authSlice";
const ProtectedRoute = () => {
  // Redux
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  if (!isLoggedIn) return <Navigate to="/login" />;

  return (
    <>
      <NavbarMenu />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;

import { FC } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegistrationForm from "../components/auth/RegistrationForm";
import { Navigate } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { useAppSelector } from "src/app/hooks";
import { selectAuthLoading, selectIsLoggedIn } from "src/store/authSlice";

interface IAuthProps {
  authRoute: string;
}
const Auth: FC<IAuthProps> = ({ authRoute }) => {
  const authLoading = useAppSelector(selectAuthLoading);
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  let body;

  if (authLoading)
    body = (
      <div className="d-flex justify-content-center mt-2">
        <Spinner animation="border" variant="info" />
      </div>
    );
  else if (isLoggedIn) return <Navigate to="/dashboard" />;
  else
    body = (
      <>
        {authRoute === "login" && <LoginForm />}
        {authRoute === "register" && <RegistrationForm />}
      </>
    );
  return (
    <div className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1>Booking App</h1>
          {body}
        </div>
      </div>
    </div>
  );
};

export default Auth;

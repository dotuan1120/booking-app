import React, { useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import AlertMessage, { AlertMessageType } from "../layout/AlertMessage";
import { useAppDispatch } from "src/app/hooks";
import { loadUser, login } from "src/store/authSlice";
import RequestResponseType from "src/utils/ResponseType";
const LoginForm = () => {
  // Redux
  const dispatch = useAppDispatch();

  // States
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const [alert, setAlert] = useState<AlertMessageType | null>(null);

  // Variables
  const { username, password } = loginForm;

  // Functions
  const onChangeLoginForm = (event: React.ChangeEvent<HTMLInputElement>) =>
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });

  const submitLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      dispatch(login(loginForm)).then((response) => {
        let responseData = response.payload as RequestResponseType<String>;
        if (!responseData.success) {
          setAlert({ type: "danger", message: responseData.message });
          setTimeout(() => setAlert(null), 1500);
        } else {
          loadUserCallback();
        }
      });
    } catch (error) {}
  };

  const loadUserCallback = useCallback(() => {
    return dispatch(loadUser());
  }, [dispatch]);

  return (
    <>
      <Form className="my-4" onSubmit={submitLogin}>
        <AlertMessage info={alert} />
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            required
            value={username}
            onChange={onChangeLoginForm}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            required
            value={password}
            onChange={onChangeLoginForm}
            className="mt-3"
          />
        </Form.Group>
        <Button variant="success" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
      <p>
        Don't have an account?
        <Link to="/register">
          <Button variant="info" size="sm" style={{ marginLeft: "1rem" }}>
            Register
          </Button>
        </Link>
      </p>
    </>
  );
};

export default LoginForm;

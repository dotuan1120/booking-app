import React, { useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import AlertMessage, { AlertMessageType } from "../layout/AlertMessage";
import { useAppDispatch } from "src/app/hooks";
import { loadUser, register } from "src/store/authSlice";
import RequestResponseType from "src/utils/ResponseType";

const RegistrationForm = () => {
  // Redux
  const dispatch = useAppDispatch();

  // States
  const [registrationForm, setRegistrationForm] = useState({
    username: "",
    password: "",
    confirmedPassword: "",
    role: "USER",
  });
  const [alert, setAlert] = useState<AlertMessageType | null>(null);

  // Variables
  const { username, password, confirmedPassword, role } = registrationForm;

  // Functions
  const onChangeRegistrationForm = (
    event: React.ChangeEvent<HTMLInputElement>
  ) =>
    setRegistrationForm({
      ...registrationForm,
      [event.target.name]: event.target.value,
    });
  
  const submitRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmedPassword) {
      setAlert({ type: "danger", message: "Incorrect confirmed password" });
      setTimeout(() => setAlert(null), 1500);
      return;
    }
    try {
      dispatch(register(registrationForm)).then((response) => {
        let responseData = response.payload as RequestResponseType<String>;
        if (!responseData.success) {
          setAlert({ type: "danger", message: responseData.message });
          setTimeout(() => setAlert(null), 1500);
        } else {
          loadUserCallback();
        }
      });
    } catch (error) {
    }
  };

  const loadUserCallback = useCallback(() => {
    return dispatch(loadUser());
  }, [dispatch]);
  
  return (
    <>
      <Form className="my-4" onSubmit={submitRegister}>
        <AlertMessage info={alert} />
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Username"
            name="username"
            required
            value={username}
            onChange={onChangeRegistrationForm}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            required
            value={password}
            onChange={onChangeRegistrationForm}
            className="mt-3"
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            name="confirmedPassword"
            required
            value={confirmedPassword}
            onChange={onChangeRegistrationForm}
            className="mt-3"
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            as="select"
            value={role}
            name="role"
            onChange={onChangeRegistrationForm}
            className="mt-3"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </Form.Control>
        </Form.Group>
        <Button variant="success" type="submit" className="mt-3">
          Register
        </Button>
      </Form>
      <p>
        Already have an account?
        <Link to="/login">
          <Button variant="info" size="sm" className="ml-2">
            Login
          </Button>
        </Link>
      </p>
    </>
  );
};

export default RegistrationForm;

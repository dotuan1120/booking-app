import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import logoutIcon from "../../assets/logout.svg";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { logout, selectUsername } from "src/store/authSlice";

const NavbarMenu = () => {
	// Redux
  const dispatch = useAppDispatch();
	const username = useAppSelector(selectUsername);

	// Functions
  const logoutUser = () => dispatch(logout());

  return (
    <Navbar expand="lg" bg="primary" variant="dark" className="shadow">
      <Navbar.Brand className="font-weight-bolder text-white">
        Booking App
      </Navbar.Brand>

      <Navbar.Toggle aria-controls="basic-navbar-nav" />

      <Navbar.Collapse id="basic-navbar-nav" className="navbar__container">
        <Nav className="mr-auto">
          <Nav.Link
            className="font-weight-bolder text-white"
            to="/dashboard"
            as={Link}
          >
            Dashboard
          </Nav.Link>
        </Nav>

        <Nav>
          <Nav.Link className="font-weight-bolder text-white" disabled>
            Welcome {username}
          </Nav.Link>
          <Button
            variant="danger"
            className="font-weight-bolder text-white"
            onClick={logoutUser}
          >
            <img
              src={logoutIcon}
              alt="logoutIcon"
              width="32"
              height="32"
              className="mr-2"
            />
            Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarMenu;

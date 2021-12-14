import { useCallback, useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Col from "react-bootstrap/Col";
import BookingCard from "../components/bookings/BookingCard";
import CreateBookingModal from "../components/bookings/CreateBookingModal";
import EditBookingModal from "../components/bookings/EditBookingModal";
import addIcon from "../assets/plus-circle-fill.svg";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { selectRole, selectUsername } from "src/store/authSlice";
import {
  deleteBooking,
  getBookings,
  IExistingBooking,
  removeSelectedBooking,
  selectBooking,
  selectBookings,
  selectBookingsLoading,
} from "src/store/bookingSlice";
import ApproveBookingModal from "src/components/bookings/ApproveBookingModal";
import RejectBookingModal from "src/components/bookings/RejectBookingModal";
import ConfirmModal from "src/components/bookings/ConfirmModal";

const Dashboard = () => {
  // Redux
  const dispatch = useAppDispatch();
  const username = useAppSelector(selectUsername);
  const userRole = useAppSelector(selectRole);
  const booking = useAppSelector(selectBooking);
  const bookings = useAppSelector(selectBookings);
  const bookingsLoading = useAppSelector(selectBookingsLoading);

  // States
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: null,
  });
  const [showCreateBookingModal, setShowCreateBookingModal] = useState(false);
  const [showEditBookingModal, setShowEditBookingModal] = useState(false);
  const [showApproveBookingModal, setShowApproveBookingModal] = useState(false);
  const [showRejectBookingModal, setShowRejectBookingModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Functions
  const getBookingsCallback = useCallback(() => {
    return dispatch(getBookings());
  }, [dispatch]);
  
  // empty selected booking store every refresh
  const removeSelectedBookingCallback = useCallback(() => {
    return dispatch(removeSelectedBooking());
  }, [dispatch]);

  useEffect(() => {
    getBookingsCallback();
    removeSelectedBookingCallback();
  }, []);

  return (
    <>
      {bookingsLoading && (
        <div className="spinner-container">
          <Spinner animation="border" variant="info" />
        </div>
      )}
      {bookings && bookings.length === 0 && (
        <>
          <Card className="text-center mx-5 my-5">
            <Card.Header as="h1">Hi {username}</Card.Header>
            <Card.Body>
              <Card.Title>Welcome to Booking App</Card.Title>
              <Button
                variant="primary"
                onClick={() => setShowCreateBookingModal(true)}
              >
                Create a new booking
              </Button>
            </Card.Body>
          </Card>
        </>
      )}
      {bookings && bookings.length > 0 && (
        <>
          <Row className="row-cols-1 row-cols-md-3 g-4 mx-auto mt-3">
            {bookings
              ? bookings.map((booking: IExistingBooking) => (
                  <Col key={booking._id} className="my-2">
                    <BookingCard
                      booking={booking}
                      userRole={userRole}
                      setShowEditBookingModal={setShowEditBookingModal}
                      setShowApproveBookingModal={setShowApproveBookingModal}
                      setShowRejectBookingModal={setShowRejectBookingModal}
                      setShowConfirmModal={setShowConfirmModal}
                    />
                  </Col>
                ))
              : null}
          </Row>

          {/* Open Add Booking Modal */}
          {userRole === "USER" && (
            <OverlayTrigger
              placement="left"
              overlay={<Tooltip>Create a new booking</Tooltip>}
            >
              <Button
                className="btn-floating"
                onClick={() => setShowCreateBookingModal(true)}
              >
                <img src={addIcon} alt="add-post" width="60" height="60" />
              </Button>
            </OverlayTrigger>
          )}
        </>
      )}
      <CreateBookingModal
        show={showCreateBookingModal}
        setShow={setShowCreateBookingModal}
        setToast={setToast}
      />
      {booking && (
        <EditBookingModal
          booking={booking}
          show={showEditBookingModal}
          setShow={setShowEditBookingModal}
          setToast={setToast}
        />
      )}
      {booking && (
        <ApproveBookingModal
          booking={booking}
          show={showApproveBookingModal}
          setShow={setShowApproveBookingModal}
          setToast={setToast}
        />
      )}
      {booking && (
        <RejectBookingModal
          booking={booking}
          show={showRejectBookingModal}
          setShow={setShowRejectBookingModal}
          setToast={setToast}
        />
      )}
      <Toast
        show={toast.show}
        style={{ position: "fixed", top: "20%", right: "10px" }}
        className={`bg-${toast.type} text-white`}
        onClose={() =>
          setToast({
            show: false,
            message: "",
            type: null,
          })
        }
        delay={3000}
        autohide
      >
        <Toast.Body>
          <strong>{toast.message}</strong>
        </Toast.Body>
      </Toast>
      <ConfirmModal
        show={showConfirmModal}
        setShow={setShowConfirmModal}
        action={() => dispatch(deleteBooking(booking!._id))}
      />
    </>
  );
};

export default Dashboard;

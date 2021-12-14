import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ActionButtons from "./ActionButtons";
import { FC } from "react";
import { IExistingBooking } from "src/store/bookingSlice";

export interface IBookingCardProps {
  booking: IExistingBooking;
  userRole: String;
  setShowEditBookingModal: Function;
  setShowApproveBookingModal: Function;
  setShowRejectBookingModal: Function;
  setShowConfirmModal: Function;
}
const BookingCard: FC<IBookingCardProps> = ({
  booking: {
    _id,
    status,
    type,
    location,
    user,
    selectedProposedDate,
    rejectedReason,
  },
  userRole,
  setShowEditBookingModal,
  setShowApproveBookingModal,
  setShowRejectBookingModal,
  setShowConfirmModal,
}) => {
  return (
    <Card
      className="shadow"
      border={
        status === "Approved"
          ? "success"
          : status === "Rejected"
          ? "danger"
          : "warning"
      }
    >
      <Card.Body>
        <Card.Title>
          <Row>
            <Col xs={7}>
              <p>{type}</p>
              <p className="mt-3">{location}</p>
            </Col>
            <Col className="text-right" xs={5}>
              {userRole === "ADMIN" && <p>{user.username}</p>}
              <p
                style={{
                  color: `${
                    status === "Approved"
                      ? "rgb(24, 188, 156)"
                      : status === "Rejected"
                      ? "rgb(231, 76, 60)"
                      : "rgb(243, 156, 18)"
                  }`,
                }}
              >
                {status}
              </p>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              {status === "Approved" && (
                <>
                  <p>Selected proposed Date</p>
                  <p className="font-weight-light">
                    {new Date(selectedProposedDate).toLocaleDateString()}{" "}
                    {new Date(selectedProposedDate).toLocaleTimeString()}
                  </p>
                </>
              )}
              {status === "Rejected" && (
                <>
                  <p>Rejected reason</p>
                  <p className="font-weight-light">{rejectedReason}</p>
                </>
              )}
            </Col>
          </Row>
        </Card.Title>
        <Card.Text>
          <ActionButtons
            _id={_id}
            setShowEditBookingModal={setShowEditBookingModal}
            setShowApproveBookingModal={setShowApproveBookingModal}
            setShowRejectBookingModal={setShowRejectBookingModal}
            setShowConfirmModal={setShowConfirmModal}
            bookingStatus={status}
          />
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default BookingCard;

import Button from "react-bootstrap/Button";
import { FC } from "react";
import { useAppDispatch, useAppSelector } from "src/app/hooks";
import { findBooking } from "src/store/bookingSlice";
import { selectRole } from "src/store/authSlice";

interface IActionButtons {
  _id: string;
  setShowEditBookingModal: Function;
  setShowApproveBookingModal: Function;
  setShowRejectBookingModal: Function;
  setShowConfirmModal: Function;
  bookingStatus: string;
}

const ActionButtons: FC<IActionButtons> = ({
  _id,
  setShowEditBookingModal,
  setShowApproveBookingModal,
  setShowRejectBookingModal,
  setShowConfirmModal,
  bookingStatus,
}) => {
  // Redux
  const dispatch = useAppDispatch();
  const userRole = useAppSelector(selectRole);

  // Functions
  const editBooking = (bookingId: string) => {
    dispatch(findBooking(bookingId));
    setShowEditBookingModal(true);
  };

  const approveBooking = (bookingId: string) => {
    dispatch(findBooking(bookingId));
    setShowApproveBookingModal(true);
  };

  const rejectBooking = (bookingId: string) => {
    dispatch(findBooking(bookingId));
    setShowRejectBookingModal(true);
  };

  const cancelBooking = (bookingId: string) => {
    dispatch(findBooking(bookingId));
    setShowConfirmModal(true);
  };

  return (
    <>
      {userRole === "USER" && bookingStatus === "Pending Review" && (
        <>
          <Button onClick={() => editBooking(_id)} variant="success">
            Edit
          </Button>
          <Button onClick={() => cancelBooking(_id)} variant="danger">
            Cancel
          </Button>
        </>
      )}
      {userRole === "ADMIN" && bookingStatus === "Pending Review" && (
        <>
          <Button onClick={() => approveBooking(_id)} variant="success">
            Approve
          </Button>
          <Button onClick={() => rejectBooking(_id)} variant="danger">
            Reject
          </Button>
        </>
      )}
    </>
  );
};

export default ActionButtons;

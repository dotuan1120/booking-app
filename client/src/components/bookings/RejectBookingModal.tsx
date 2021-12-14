import React, { FC, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useAppDispatch } from "src/app/hooks";
import { removeSelectedBooking, updateBooking } from "src/store/bookingSlice";
import { IEditBookingModalProps } from "./ApproveBookingModal";

const RejectBookingModal: FC<IEditBookingModalProps> = ({
  show,
  setShow,
  setToast,
  booking,
}) => {
  // Redux
  const dispatch = useAppDispatch();

  // States
  const [updatedBooking, setUpdatedBooking] = useState(booking);
  const { type, location, user, rejectedReason } = updatedBooking;

  // Functions
  const onChangeUpdatedBookingForm = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUpdatedBooking({
      ...updatedBooking,
      [event.target.name]: event.target.value,
    });
  };

  const onEditBooking = async (name: string, value: string) => {
    const finalUpdatedBooking = { ...updatedBooking, [name]: value };
    setTimeout(() => console.log(updatedBooking), 2000);
    // const response = await dispatch(updateBooking(finalUpdatedBooking));
    dispatch(updateBooking(finalUpdatedBooking)).then((response: any) => {
      setToast({
        show: true,
        message: response?.payload?.message,
        type: response.payload.success ? "success" : "danger",
      });
      if (response.payload.success) closeDialog();
    });
  };

  const closeDialog = () => {
    dispatch(removeSelectedBooking());
    setShow(false);
  };

  return (
    <Modal show={show} onHide={closeDialog}>
      <Modal.Header closeButton>
        <Modal.Title>Rejection Confirmation</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <div>
            <b>Type:</b> {type}
          </div>
          <div>
            <b>Location:</b> {location}
          </div>
          <div>
            <b>Belong to:</b> {user.username}
          </div>
          <Form.Group>
            <b>Reason for Rejection</b>
            <Form.Control
              as="textarea"
              value={rejectedReason}
              name="rejectedReason"
              onChange={onChangeUpdatedBookingForm}
            ></Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            name="status"
            value="Rejected"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              onEditBooking(event.currentTarget.name, event.currentTarget.value)
            }
            disabled={!rejectedReason ? true : false}
          >
            Reject
          </Button>
          <Button variant="danger" onClick={closeDialog}>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default RejectBookingModal;

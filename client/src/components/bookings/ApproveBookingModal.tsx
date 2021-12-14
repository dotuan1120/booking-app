import React, { FC, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useAppDispatch } from "src/app/hooks";
import {
  IExistingBooking,
  removeSelectedBooking,
  updateBooking,
} from "src/store/bookingSlice";
import { IBookingModalProps } from "./CreateBookingModal";

export interface IEditBookingModalProps extends IBookingModalProps {
  booking: IExistingBooking;
}
const ApproveBookingModal: FC<IEditBookingModalProps> = ({
  show,
  setShow,
  setToast,
  booking,
}) => {
  // Redux
  const dispatch = useAppDispatch();

  // States
  const [updatedBooking, setUpdatedBooking] = useState(booking);
  const [selectedRadios, setSelectedRadios] = useState([false, false, false]);

  // Variables
  const {
    type,
    location,
    user,
    proposedDate1,
    proposedDate2,
    proposedDate3,
    selectedProposedDate,
  } = updatedBooking;
  const proposedDate1AsString = new Date(proposedDate1)
    .toLocaleDateString()
    .concat(" ")
    .concat(new Date(proposedDate1).toLocaleTimeString());
  const proposedDate2AsString = new Date(proposedDate2)
    .toLocaleDateString()
    .concat(" ")
    .concat(new Date(proposedDate2).toLocaleTimeString());
  const proposedDate3AsString = new Date(proposedDate3)
    .toLocaleDateString()
    .concat(" ")
    .concat(new Date(proposedDate3).toLocaleTimeString());

  // Functions
  const onChangeSelectedProposedDate = (value: string) => {
    setUpdatedBooking({ ...updatedBooking, selectedProposedDate: value });
  };

  const closeDialog = () => {
    dispatch(removeSelectedBooking());
    setShow(false);
  };

  const onSelectProposedDate = (proposedDate: any, radioIndex: number) => {
    onChangeSelectedProposedDate(proposedDate);
    const newSelectedRadios = selectedRadios.map((radio, index) =>
      index === radioIndex ? (radio = true) : (radio = false)
    );
    setSelectedRadios(newSelectedRadios);
  };

  const onEditBooking = async (name: string, value: string) => {
    const finalUpdatedBooking = { ...updatedBooking, [name]: value };
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

  useEffect(() => {
    if (selectedProposedDate) {
      if (selectedProposedDate === proposedDate1) {
        setSelectedRadios([true, false, false]);
      }
      if (selectedProposedDate === proposedDate2) {
        setSelectedRadios([false, true, false]);
      }
      if (selectedProposedDate === proposedDate3) {
        setSelectedRadios([false, false, true]);
      }
    }
  }, []);
  
  return (
    <Modal show={show} onHide={closeDialog}>
      <Modal.Header closeButton>
        <Modal.Title>Approve Confirmation</Modal.Title>
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
          <div>
            <b>Proposed dates:</b>
          </div>
          <Form.Group className="proposed-date">
            <Form.Check
              type="radio"
              name="groupProposedDate"
              checked={selectedRadios[0]}
              onChange={() => onSelectProposedDate(proposedDate1, 0)}
            />
            {proposedDate1AsString}
            <Button
              variant="success"
              onClick={() => {
                onSelectProposedDate(proposedDate1, 0);
              }}
            >
              Select
            </Button>
          </Form.Group>
          <Form.Group className="proposed-date">
            <Form.Check
              type="radio"
              name="groupProposedDate"
              checked={selectedRadios[1]}
              onChange={() => onSelectProposedDate(proposedDate2, 1)}
            />
            {proposedDate2AsString}
            <Button
              variant="success"
              onClick={() => {
                onSelectProposedDate(proposedDate2, 1);
              }}
            >
              Select
            </Button>
          </Form.Group>
          <Form.Group className="proposed-date">
            <Form.Check
              type="radio"
              name="groupProposedDate"
              checked={selectedRadios[2]}
              onChange={() => onSelectProposedDate(proposedDate3, 2)}
            />
            {proposedDate3AsString}
            <Button
              variant="success"
              onClick={() => {
                onSelectProposedDate(proposedDate3, 2);
              }}
            >
              Select
            </Button>
          </Form.Group>
          {selectedProposedDate && (
            <div className="mt-3">
              <b>Selected date:</b>{" "}
              {new Date(selectedProposedDate).toLocaleDateString()}{" "}
              {new Date(selectedProposedDate).toLocaleTimeString()}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            name="status"
            value="Approved"
            onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
              onEditBooking(event.currentTarget.name, event.currentTarget.value)
            }
            disabled={!selectedProposedDate ? true : false}
          >
            Approve
          </Button>
          <Button variant="danger" onClick={closeDialog}>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ApproveBookingModal;

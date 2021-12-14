import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import { FC, useState } from "react";
import { useAppDispatch } from "src/app/hooks";
import {
  IExistingBooking,
  removeSelectedBooking,
  updateBooking,
} from "src/store/bookingSlice";
import { Col, Row } from "react-bootstrap";
import { IEditBookingModalProps } from "./ApproveBookingModal";

const CreateBookingModal: FC<IEditBookingModalProps> = ({
  show,
  setShow,
  setToast,
  booking,
}) => {
  // Redux
  const dispatch = useAppDispatch();

  // States
  const [editedBooking, setNewBooking] = useState<IExistingBooking>(booking);
  const { type, location, proposedDate1, proposedDate2, proposedDate3 } =
    editedBooking;
  const [selectedDate1, setSelectedDate1] = useState<any>(
    new Date(proposedDate1)
  );
  const [selectedDate2, setSelectedDate2] = useState<any>(
    new Date(proposedDate2)
  );
  const [selectedDate3, setSelectedDate3] = useState<any>(
    new Date(proposedDate3)
  );

  // Functions
  const onChangeNewBookingForm = (event: React.ChangeEvent<HTMLInputElement>) =>
    setNewBooking({
      ...editedBooking,
      [event.target.name]: event.target.value,
    });

  const onChangeDateNewBookingForm = (name: string, value: string) => {
    setNewBooking({ ...editedBooking, [name]: value });
  };

  const closeDialog = () => {
    dispatch(removeSelectedBooking());
    setShow(false);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(updateBooking(editedBooking)).then((response: any) => {
      setToast({
        show: true,
        message: response?.payload?.message,
        type: response.payload.success ? "success" : "danger",
      });
      if (response.payload.success) {
        closeDialog();
      }
    });
  };

  return (
    <Modal show={show} onHide={closeDialog}>
      <Modal.Header closeButton>
        <Modal.Title>Booking Details</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Booking type</Form.Label>
            <Form.Control
              as="select"
              value={type}
              name="type"
              onChange={onChangeNewBookingForm}
              required
            >
              <option value="Health Talk">Health Talk</option>
              <option value="Wellness Events">Wellness Events</option>
              <option value="Fitness Activities">Fitness Activities</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="Location"
              name="location"
              value={location}
              onChange={onChangeNewBookingForm}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Choose 3 proposed dates</Form.Label>
            <Row className="mb-3">
              <Col xs={5}>Date 1</Col>
              <Col xs={7}>
                <DatePicker
                  selected={selectedDate1}
                  timeInputLabel="Time:"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  showTimeInput
                  onChange={(date: Date) => {
                    setSelectedDate1(date);
                    onChangeDateNewBookingForm(
                      "proposedDate1",
                      date.toISOString()
                    );
                  }}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={5}>Date 2</Col>
              <Col xs={7}>
                <DatePicker
                  selected={selectedDate2}
                  timeInputLabel="Time:"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  showTimeInput
                  onChange={(date: Date) => {
                    setSelectedDate2(date);
                    onChangeDateNewBookingForm(
                      "proposedDate2",
                      date.toISOString()
                    );
                  }}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs={5}>Date 2</Col>
              <Col xs={7}>
                <DatePicker
                  selected={selectedDate3}
                  timeInputLabel="Time:"
                  dateFormat="MM/dd/yyyy h:mm aa"
                  showTimeInput
                  onChange={(date: Date) => {
                    setSelectedDate3(date);
                    onChangeDateNewBookingForm(
                      "proposedDate3",
                      date.toISOString()
                    );
                  }}
                />
              </Col>
            </Row>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" type="submit">
            Confirm
          </Button>
          <Button variant="danger" onClick={closeDialog}>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateBookingModal;

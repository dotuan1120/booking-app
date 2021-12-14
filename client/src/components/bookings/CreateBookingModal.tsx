import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import { FC, useState } from "react";
import { useAppDispatch } from "src/app/hooks";
import { createBooking, INewBooking } from "src/store/bookingSlice";
import { Col, Row } from "react-bootstrap";

export interface IBookingModalProps {
  show: boolean;
  setShow: Function;
  setToast: Function;
}
const CreateBookingModal: FC<IBookingModalProps> = ({
  show,
  setShow,
  setToast,
}) => {
  // Redux
  const dispatch = useAppDispatch();
  
  // States
  const [newBooking, setNewBooking] = useState<INewBooking>({
    type: "Health Talk",
    location: "",
    proposedDate1: new Date().toString(),
    proposedDate2: new Date().toString(),
    proposedDate3: new Date().toString(),
    status: "Pending Review",
  });

  const { type, location } = newBooking;
  const [selectedDate1, setSelectedDate1] = useState<any>(new Date());
  const [selectedDate2, setSelectedDate2] = useState<any>(new Date());
  const [selectedDate3, setSelectedDate3] = useState<any>(new Date());

  // Functions
  const onChangeNewBookingForm = (event: React.ChangeEvent<HTMLInputElement>) =>
    setNewBooking({ ...newBooking, [event.target.name]: event.target.value });

  const onChangeDateNewBookingForm = (name: string, value: string) => {
    setNewBooking({ ...newBooking, [name]: value });
  };

  const closeDialog = () => {
    setNewBooking({
      type: "Health Talk",
      location: "",
      proposedDate1: new Date().toString(),
      proposedDate2: new Date().toString(),
      proposedDate3: new Date().toString(),
      status: "Pending Review",
    });
    setSelectedDate1(new Date());
    setSelectedDate2(new Date());
    setSelectedDate3(new Date());
    setShow(false);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // const response = await dispatch(createBooking(newBooking))
    dispatch(createBooking(newBooking)).then((response: any) => {
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
        <Modal.Title>New Booking Details</Modal.Title>
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
            Create
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

import { FC } from "react";
import { Button, Modal } from "react-bootstrap";

interface IConfirmModalProps {
  show: boolean;
  setShow: Function;
  action: Function;
}
const ConfirmModal: FC<IConfirmModalProps> = ({ show, setShow, action }) => {
  // Functions
  const performAction = () => {
    action();
    setShow(false);
  };

  return (
    <Modal show={show}>
      <Modal.Header>
        <Modal.Title>Do you want to continue the action?</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Button variant="success" onClick={performAction}>
          Confirm
        </Button>
        <Button variant="danger" onClick={() => setShow(false)}>
          Cancel
        </Button>
      </Modal.Body>
    </Modal>
  );
};

export default ConfirmModal;

import { FC } from "react";
import { Alert } from "react-bootstrap";

export type AlertMessageType = {
  type: string;
  message: string;
};

export interface IAlertMessageProps {
  info: AlertMessageType | null;
}
const AlertMessage: FC<IAlertMessageProps | null> = ({ info }) => {
  return info === null ? null : (
    <Alert variant={info.type}>{info.message}</Alert>
  );
};

export default AlertMessage;

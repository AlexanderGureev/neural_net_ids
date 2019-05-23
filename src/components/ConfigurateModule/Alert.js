import React from "react";
import { Alert as StyledAlert } from "../styles";

const Alert = ({ error, loaded, training }) => {
  const message = loaded
    ? `Dataset loaded successfully.`
    : "Dataset loading error";

  if (training) return null;
  return loaded || error ? (
    <StyledAlert
      message={message}
      type={error ? "error" : "success"}
      banner
      closable
    />
  ) : null;
};

export default Alert;

import React from "react";
import { useActions, useStore } from "easy-peasy";
import { SystemIcon, SystemStatus, Status } from "./styles";
import statusIconOn from "./img/security-on.svg";
import statusIconOff from "./img/security-off.svg";
import { openNotification } from "./ConfigurateModule/lib/notification";

const StatusGuard = () => {
  const changeStatusAction = useActions(action => action.changeStatus);
  const status = useStore(state => state.statusGuard);

  const changeStatus = () => {
    openNotification(
      status ? "Security systems enabled" : "Security systems disabled"
    );
    changeStatusAction();
  };

  return (
    <SystemStatus>
      <SystemIcon
        src={status ? statusIconOn : statusIconOff}
        onClick={changeStatus}
      />
      <Status>{status ? "on" : "off"}</Status>
    </SystemStatus>
  );
};

export default StatusGuard;

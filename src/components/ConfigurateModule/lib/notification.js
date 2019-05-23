import { notification } from "antd";

export const openNotification = (text, type = "success") => {
  notification[type]({
    message: "Neural net module",
    description: text,
    placement: "topLeft"
  });
};

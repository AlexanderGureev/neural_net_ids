import React, { useState } from "react";
import { useActions } from "easy-peasy";
import { Modal, Input } from "antd";
import { Button } from "../styles";
import { openNotification } from "./lib/notification";

const SaveModel = ({ isDisabled }) => {
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState("");
  const { saveModel } = useActions(action => action);

  const showModal = () => setVisible(true);
  const onChange = ({ target }) => {
    setValue(target.value);
  };
  const handleOk = async () => {
    try {
      await saveModel(value);
      openNotification(`Model: ${value} saved.`);
      setVisible(false);
      setValue("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = () => {
    setVisible(false);
    setValue("");
  };
  return (
    <>
      <Button type="primary" onClick={showModal} disabled={isDisabled}>
        Save model
      </Button>
      <Modal
        title="Save model"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input placeholder="Model name" value={value} onChange={onChange} />
      </Modal>
    </>
  );
};

export default SaveModel;

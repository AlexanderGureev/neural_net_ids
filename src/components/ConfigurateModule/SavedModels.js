import React, { useState, useEffect } from "react";
import { useStore, useActions } from "easy-peasy";
import { Option, InputGroup, Label, Button, Select } from "../styles";
import { openNotification } from "./lib/notification";

const SavedModels = () => {
  const savedModels = useStore(state => state.savedModels);
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (value && savedModels.length) {
      setValue(savedModels[0].name);
    }
  }, [savedModels]);

  const { removeModel, loadModel } = useActions(action => action);

  if (!savedModels.length) return null;

  const handleChange = val => setValue(val);

  const loadModelHandler = async () => {
    try {
      await loadModel(value);
      openNotification(`Model: ${value} success loaded.`);
    } catch (error) {
      console.log(error);
    }
  };
  const deleteModelHandler = async () => {
    try {
      await removeModel(value);
      openNotification(`Model: ${value} success deleted.`);
    } catch (error) {
      console.log(error);
    }
  };
  const showInfo = () => {};

  return (
    <InputGroup>
      <Label>Saved models</Label>
      <Select
        placeholder="Please select"
        value={value || []}
        onChange={handleChange}
      >
        {savedModels.map(({ name, modelInfo }) => (
          <Option key={name}>{name}</Option>
        ))}
      </Select>
      <Button onClick={showInfo} disabled={!value}>
        Show info model
      </Button>
      <Button onClick={loadModelHandler} disabled={!value}>
        Load model
      </Button>
      <Button onClick={deleteModelHandler} disabled={!value}>
        Delete model
      </Button>
    </InputGroup>
  );
};

export default SavedModels;

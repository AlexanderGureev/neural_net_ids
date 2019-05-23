import React from "react";
import { useStore, useActions } from "easy-peasy";
import { remote } from "electron";
import { Option, InputGroup, Label, Button, Select } from "../styles";

const { labels } = remote.require("../main/formats");

const Labels = () => {
  const moduleConfig = useStore(state => state.moduleConfig);
  const updateStateAction = useActions(action => action.setState);

  const resetAll = () =>
    updateStateAction({
      datasets: null,
      model: null,
      moduleConfig: { ...moduleConfig, classes: [] }
    });
  const changeValue = values =>
    updateStateAction({
      datasets: null,
      model: null,
      moduleConfig: { ...moduleConfig, classes: values }
    });
  const selectAll = () =>
    updateStateAction({
      datasets: null,
      model: null,
      moduleConfig: { ...moduleConfig, classes: labels }
    });

  return (
    <InputGroup>
      <Label>Labels</Label>
      <Select
        mode="multiple"
        placeholder="Please select"
        onChange={changeValue}
        value={moduleConfig.classes}
      >
        {labels.map(item => (
          <Option key={item}>{item}</Option>
        ))}
      </Select>
      <Button onClick={selectAll}>Select All</Button>
      <Button onClick={resetAll}>Reset</Button>
    </InputGroup>
  );
};

export default Labels;

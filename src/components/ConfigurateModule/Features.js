import React, { useEffect } from "react";
import { useStore, useActions } from "easy-peasy";
import { remote } from "electron";
import { Option, InputGroup, Label, Button, Select } from "../styles";
import { defaultFeatures } from "../CNN_IDS/config";

const { features: allowFeatures, minFeatures } = remote.require(
  "../main/formats"
);

const Features = () => {
  const moduleConfig = useStore(state => state.moduleConfig);
  const updateStateAction = useActions(action => action.setState);

  useEffect(() => {
    if (moduleConfig.type === "cnn") changeValue(defaultFeatures);
  }, [moduleConfig]);

  const resetAll = () =>
    updateStateAction({
      datasets: null,
      model: null,
      moduleConfig: { ...moduleConfig, features: [] }
    });
  const changeValue = values =>
    updateStateAction({
      datasets: null,
      model: null,
      moduleConfig: { ...moduleConfig, features: values }
    });
  const selectAll = () =>
    updateStateAction({
      datasets: null,
      model: null,
      moduleConfig: { ...moduleConfig, features: allowFeatures }
    });

  const selectImportantFeatures = () =>
    updateStateAction({
      dataset: null,
      model: null,
      moduleConfig: { ...moduleConfig, features: minFeatures }
    });

  const isDisabled = moduleConfig.type === "cnn";

  return (
    <InputGroup>
      <Label>Features</Label>
      <Select
        mode="multiple"
        placeholder="Please select"
        onChange={changeValue}
        value={moduleConfig.features}
        disabled={isDisabled}
      >
        {allowFeatures.map(item => (
          <Option key={item}>{item}</Option>
        ))}
      </Select>
      <Button disabled={isDisabled} onClick={selectAll}>
        Select All
      </Button>
      <Button disabled={isDisabled} onClick={selectImportantFeatures}>
        Only important
      </Button>
      <Button disabled={isDisabled} onClick={resetAll}>
        Reset
      </Button>
    </InputGroup>
  );
};

export default Features;

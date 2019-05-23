import React from "react";
import { useStore, useActions } from "easy-peasy";
import {
  Switch,
  InputGroup,
  InputNumber,
  Label,
  Icon,
  Container,
  Radio
} from "../styles";

const AdditionalSettings = () => {
  const moduleConfig = useStore(state => state.moduleConfig);

  const updateStateAction = useActions(action => action.setState);
  const updateConfigAction = useActions(action => action.updateConfig);

  const changeValue = (field, value) =>
    updateStateAction({
      datasets: null,
      model: null,
      moduleConfig: { ...moduleConfig, [field]: value }
    });

  const changeConfig = (field, value) => updateConfigAction({ [field]: value });
  const changeType = (field, value) => {
    if (value === "cnn") {
      updateStateAction({
        datasets: null,
        model: null,
        moduleConfig: {
          ...moduleConfig,
          normalize: true,
          logScaling: true,
          [field]: value
        }
      });
    } else {
      changeValue(field, value);
    }
  };

  const { size, normalize, logScaling, epochs, batchSize, type } = moduleConfig;
  return (
    <>
      <InputGroup row>
        <Container>
          <Label>Type neural net</Label>
          <Radio.Group
            defaultValue={type}
            buttonStyle="solid"
            onChange={({ target: { value } }) => changeType("type", value)}
          >
            <Radio.Button value="ann">ANN</Radio.Button>
            <Radio.Button value="cnn">CNN</Radio.Button>
          </Radio.Group>
        </Container>
        <Container>
          <Label>Size dataset</Label>
          <InputNumber
            min={1}
            max={1000000}
            defaultValue={size}
            onChange={value => changeValue("size", value)}
          />
        </Container>
        <Container>
          <Label>Batch size</Label>
          <InputNumber
            min={32}
            max={2048}
            defaultValue={batchSize}
            onChange={value => changeConfig("batchSize", value)}
          />
        </Container>
        <Container>
          <Label>Number of epochs</Label>
          <InputNumber
            min={1}
            max={500}
            defaultValue={epochs}
            onChange={value => changeConfig("epochs", value)}
          />
        </Container>
      </InputGroup>
      <InputGroup row>
        <Container>
          <Label>Min-max norm</Label>
          <Switch
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
            checked={normalize}
            disabled={type === "cnn"}
            onChange={value => changeConfig("normalize", value)}
          />
        </Container>
        <Container>
          <Label>Log scaling</Label>
          <Switch
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
            checked={logScaling}
            disabled={type === "cnn"}
            onChange={value => changeConfig("logScaling", value)}
          />
        </Container>
      </InputGroup>
    </>
  );
};

export default AdditionalSettings;

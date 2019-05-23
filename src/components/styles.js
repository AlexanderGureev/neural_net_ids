import styled from "styled-components";
import {
  Select as ASelect,
  Button as AButton,
  InputNumber as AInputNumber,
  Switch as ASwitch,
  Icon as AntdIcon,
  Alert as AntdAlert,
  Progress as AntdProgress,
  Radio as AntdRadio
} from "antd";

export const Icon = styled(AntdIcon)``;
export const HomeWrapper = styled.div`
  display: flex;
`;

export const SidebarContainer = styled.div`
  background: linear-gradient(-45deg, #11122e, #3a2a75);
  min-width: 300px;
  height: 100vh;
  z-index: 10;
  position: relative;
`;
export const Logo = styled.img.attrs(props => ({
  src: props.src
}))`
  width: 210px;
  padding: 30px 0;
  margin: 0 auto;
  display: block;
`;

export const Nav = styled.ul`
  margin-top: 100px;
  padding: 0;
  list-style: none;
`;
export const Item = styled.li`
  position: relative;
  cursor: pointer;
  margin: 15px 30px;
  padding: 8px 15px;
  transition: 0.3s ease;
  border-radius: 5px;
  background-color: ${props =>
    props.active ? "rgba(17, 18, 46, 0.3)" : "none"};

  :hover {
    background-color: rgba(17, 18, 46, 0.3);
  }
`;
const NavIcon = styled.img.attrs(props => ({
  src: props.src
}))`
  width: 20px;
  margin: 0 10px 5px 0;
  display: inline-block;
`;
const Text = styled.span`
  display: inline-block;
  color: #fff;
  font-size: 16px;
  font-weight: 300;
`;

Nav.Item = Item;
Item.Icon = NavIcon;
Item.Text = Text;

export const SystemStatus = styled.div`
  position: absolute;
  bottom: 0;
  height: 80px;
  width: 100%;
  padding: 0 55px;
  display: flex;
  align-items: center;
`;

export const SystemIcon = styled.img.attrs(props => ({
  src: props.src
}))`
  cursor: pointer;
`;

export const Status = styled.span`
  display: block;
  position: relative;
  text-transform: uppercase;
  color: #fff;
  padding-left: 70px;
  font-size: 16px;
  ::before {
    position: absolute;
    content: "status:";
    left: 0;
    top: 0;
  }
`;

export const ContentContainer = styled.div`
  background: linear-gradient(0deg, #ffffff, #f8f7fc);
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  ::before {
    content: "";
    background: linear-gradient(20deg, #d1d7df, #fefefe);
    transform: rotate(25deg);
    position: absolute;
    right: -60%;
    top: 50px;
    width: 110%;
    height: 110%;
    z-index: 0;
  }
`;

export const ContentBlock = styled.div`
  position: relative;
  z-index: 100;
  padding: 30px 40px;
  margin: 0 30px 30px;
  background-color: #fff;
  box-shadow: 0 15px 65px rgba(0, 0, 0, 0.09);
  border-radius: 5px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    visibility: hidden;
    width: 3px;
    height: 2px;
  }
  ::-webkit-scrollbar-thumb {
    height: 50px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 3px;
  }
`;

export const TopLine = styled.div`
  padding: 35px 10px 35px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 100;
`;
export const PageTitle = styled.div``;
export const TitleText = styled.p`
  color: #3a2a75;
  text-transform: uppercase;
  font-size: 30px;
  font-weight: 700;
  margin: 0;

  @media (max-width: 1200px) {
    font-size: 26px;
  }
`;
export const CaptionText = styled.p`
  color: #948ca2;
  font-size: 16px;
  margin: 0;
`;

export const NotificationBlock = styled.img.attrs(props => ({
  src: props.src
}))`
  @media (max-width: 1200px) {
    width: 80px;
  }

  cursor: pointer;
`;

export const { Option } = ASelect;
export const Select = styled(ASelect)`
  && {
    .ant-select-selection--single {
      height: auto;
    }
    width: 100%;
    .ant-select-selection {
      border: none;
      padding: 7px 10px;
    }
    .ant-select-selection__choice {
      background-color: #d9d9d9;
      color: #6d6a6a;
      font-size: 14px;
      border-radius: 5px;
      border: none;
      :not(:last-child) {
        margin-right: 10px;
      }
    }

    border-radius: 5px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
    background-color: #fff;
  }
`;
export const Button = styled(AButton)`
  && {
    background: ${props =>
      props.primary
        ? "linear-gradient(-90deg, #87F1FC, #7FD4FB, #78BCFB, #74AEFA, #73A9FA)"
        : "linear-gradient(-45deg, #2b2d68, #4d36a1)"};
    box-shadow: ${props =>
      props.primary
        ? "0 15px 25px rgba(0, 232, 241, 0.15)"
        : "0 15px 25px rgba(38, 1, 103, 0.15)"};
    text-transform: uppercase;
    font-size: 11px;
    font-weight: 700;
    border-radius: 5px;
    border: none;
    color: #fff;
    padding: 5px 25px;
    :hover,
    :focus {
      background: ${props =>
        props.primary
          ? "linear-gradient(-90deg, #87F1FC, #7FD4FB, #78BCFB, #74AEFA, #73A9FA)"
          : "linear-gradient(-45deg, #2b2d68, #4d36a1)"};
      color: #fff;
    }

    &[disabled],
    &[disabled]:hover {
      background: rgba(0, 0, 0, 0.1);
      box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
    }
  }
`;
export const Label = styled.p`
  font-size: 16px;
  color: #646464;
  margin: 0;
  padding-bottom: 10px;

  @media (max-width: 1200px) {
    font-size: 14px;
  }
`;
export const InputGroup = styled.div`
  display: ${props => (props.row ? "flex" : "block")};

  :not(:last-child) {
    margin-bottom: 40px;
  }
  /* > div {
    margin-bottom: 20px;
  } */
  > button {
    margin-top: 20px;
  }
  > button:not(:last-child) {
    margin-right: 20px;
  }

  @media (max-width: 1020px) {
    display: block;
    /* > div {
      margin-bottom: 40px;
    } */
  }
`;
export const InputNumber = styled(AInputNumber)`
  && {
    border-radius: 5px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
    background-color: #fff;
    font-size: 14px;
    font-weight: 500;
    color: #6d6a6a;
    border: none;
    padding: 7px 10px;
    height: auto;
    width: 150px;
  }
`;
export const Switch = styled(ASwitch)`
  && {
    min-width: 60px;
    height: 30px;
    &::after {
      top: 2px;
      width: 22px;
      height: 22px;
      margin-left: 2px;
    }
    &.ant-switch-checked:after {
      margin-left: -3px;
    }
    &.ant-switch-checked {
      background: linear-gradient(-45deg, #2b2d68, #4d36a1);
    }
  }
`;
export const Container = styled.div`
  :not(:last-child) {
    margin-right: 40px;
    margin-bottom: 20px;
  }
  > button {
    margin-top: 5px;
  }
  @media (max-width: 1020px) {
    > button {
      margin-top: 0;
    }
  }
`;

export const BtnGroup = styled.div`
  text-align: ${props => (props.center ? "center" : "left")};

  button {
    margin-top: 20px;
  }
  button:not(:last-child) {
    margin-right: 20px;
  }
`;

export const Alert = styled(AntdAlert)`
  && {
    box-shadow: 0 15px 65px rgba(0, 0, 0, 0.09);
    .ant-alert-icon {
      left: 40px;
    }
    border-radius: 5px;
    margin: 0 30px;
    padding-left: 60px;
  }
`;

export const Progress = styled(AntdProgress)``;
export const ProgressContainer = styled.div`
  box-shadow: 0 15px 65px rgba(0, 0, 0, 0.09);
  margin: 0 30px;
  border-radius: 5px;
  background-color: #fff;
  padding: 15px 40px;
  position: relative;
`;

export const ProgressTitle = styled.span`
  font-size: 16px;
  color: #646464;
  padding-bottom: 10px;
`;

export const ConfigureModuleWrapper = styled.div`
  > div:not(:last-child) {
    margin-bottom: 20px;
  }
  display: flex;
  flex-direction: column;
`;

const RadioBtn = styled(AntdRadio.Button)``;
const RadioGroup = styled(AntdRadio.Group)`
  && {
    .ant-radio-button-wrapper-checked {
      background: linear-gradient(-45deg, #2b2d68, #4d36a1);
      border-color: initial;
      box-shadow: none;

      :hover,
      :focus {
        background: linear-gradient(-45deg, #2b2d68, #4d36a1);
        border-color: initial;
        outline: none;
      }
    }
  }
`;

export const Radio = styled(AntdRadio)``;

Radio.Button = RadioBtn;
Radio.Group = RadioGroup;

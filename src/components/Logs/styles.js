import { Empty as AEmpty } from "antd";
import { ContentBlock } from "../styles";
import styled from "styled-components";

export const Empty = styled(AEmpty)``;
export const LogItem = styled.p`
margin: 0;
font-size: 16px;
font-weight: 400;
position: relative;
text-align: ${props => (props.center ? "center" : "left")};

::before {
  content: "${props => props.str}.";
  min-width: 5%;
  position: relative;
  display: inline-block;
  font-family: "Segoe UI" !important;
  text-align: right;
  margin-right: 10px;
}
`;

export const ContentWrapper = styled(ContentBlock)`
  padding: 0;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
`;
export const LogsContainer = styled.div`
  overflow-y: scroll;
  padding: 30px 40px;
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
  + div {
    text-align: center;
    padding-bottom: 30px;
  }
`;

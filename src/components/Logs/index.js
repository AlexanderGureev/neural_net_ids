import React from "react";
import { useStore, useActions } from "easy-peasy";
import { uniqueId } from "lodash";
import { LogItem, ContentWrapper, LogsContainer, Empty } from "./styles";
import { Button, BtnGroup } from "../styles";

const Logs = () => {
  const logs = useStore(state => state.logs);
  const clearLogs = useActions(action => action.clearLogs);

  const downloadLog = () => {};
  const resetLog = () => clearLogs();
  return (
    <ContentWrapper>
      <LogsContainer>
        {logs.length ? (
          logs.map((text, i) => {
            return (
              <LogItem str={i + 1} key={uniqueId()}>
                {text}
              </LogItem>
            );
          })
        ) : (
          <Empty description="Log is empty" />
        )}
      </LogsContainer>
      <BtnGroup>
        <Button onClick={resetLog}>Clear log</Button>
        <Button onClick={downloadLog}>Download log</Button>
      </BtnGroup>
    </ContentWrapper>
  );
};

export default Logs;

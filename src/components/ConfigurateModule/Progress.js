import React from "react";
import {
  Progress as StyledProgress,
  ProgressContainer,
  ProgressTitle
} from "../styles";

const Progress = ({ totalBatch, currentBatch, training }) => {
  const currentProgress = Math.floor((currentBatch / totalBatch) * 100);

  return (
    training && (
      <ProgressContainer>
        <ProgressTitle>Training progress:</ProgressTitle>
        <StyledProgress
          percent={currentProgress}
          status="active"
          strokeColor="#27c543"
        />
      </ProgressContainer>
    )
  );
};

export default Progress;

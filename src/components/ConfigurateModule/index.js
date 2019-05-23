import React, { useRef, useState, useEffect } from "react";
import { useStore, useActions } from "easy-peasy";
import * as tf from "@tensorflow/tfjs";
import { remote } from "electron";
import { message } from "antd";
import {
  initNetAnn,
  trainNetworkAnn,
  testNetworkAnn,
  compileModelAnn
} from "./NeuralNetCore";
import {
  initNetCnn,
  trainNetworkCnn,
  testNetworkCnn,
  compileModelCnn
} from "../CNN_IDS/CNNCore";
import {
  ContentBlock,
  Button,
  BtnGroup,
  ConfigureModuleWrapper
} from "../styles";
import Labels from "./Labels";
import Features from "./Features";
import AdditionalSettings from "./AdditionalSettings";
import Alert from "./Alert";
import SavedModels from "./SavedModels";
import Progress from "./Progress";
import Visor from "./Visor";
import SaveModel from "./SaveModel";
import { openNotification } from "./lib/notification";
import { getTensors, normalizeTensor } from "./lib/tensorsOperations";

const { loadDataset } = remote.require("../main/parser");

const ConfigureModule = () => {
  const moduleConfig = useStore(state => state.moduleConfig);
  const history = useStore(state => state.history);
  const { model, datasets } = useStore(state => state);

  const { updateModel, setState } = useActions(action => action);
  const updateLogs = useActions(action => action.updateLogs);
  const updateHistory = useActions(action => action.updateHistory);

  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [training, setTraining] = useState(false);
  const [batch, setCurrentBatch] = useState(0);
  const [skip, setSkip] = useState(0);

  const id = useRef(() => {});
  const timer = useRef(() => {});

  useEffect(() => {
    loadModelList();
    return () => clearTimeout(timer.current);
  }, []);

  const loadModelList = async () => {
    try {
      const loadedModels = await tf.io.listModels();
      const models = Object.keys(loadedModels).map(key => ({
        name: key.split("/").reverse()[0],
        modelInfo: loadedModels[key]
      }));
      setState({ savedModels: models });
    } catch (error) {
      console.log(error);
    }
  };

  const isValidConfig = () =>
    Boolean(moduleConfig.features.length && moduleConfig.classes.length);

  const configurateNeuralNet = () => {
    try {
      const { normalize, logScaling, type } = moduleConfig;
      const { train, val, test } = datasets;

      if (type === "cnn") compileModelCnn(model);
      else compileModelAnn(model);

      const [trainTensor, valTensor, testTensor] = tf.tidy(() => {
        let trainTensor = getTensors(train);
        let valTensor = getTensors(val);
        let testTensor = getTensors(test);

        if (normalize) {
          trainTensor = normalizeTensor(trainTensor, logScaling);
          valTensor = normalizeTensor(valTensor, logScaling);
          testTensor = normalizeTensor(testTensor, logScaling);
        }
        return [trainTensor, valTensor, testTensor];
      });

      timer.current = setTimeout(
        () => trainNeuralNet(trainTensor, valTensor, testTensor, model),
        0
      );
    } catch (error) {
      console.log(error);
    }
  };
  const trainNeuralNet = async (train, val, test, compiledModel) => {
    try {
      const { classes, epochs, batchSize, type } = moduleConfig;
      setTraining(true);
      updateLogs("Training model start");

      const trainNet = type === "cnn" ? trainNetworkCnn : trainNetworkAnn;
      const testNet = type === "cnn" ? testNetworkCnn : testNetworkAnn;

      const historyTrain = await trainNet(compiledModel, train, val, history, {
        epochs,
        batchSize,
        cb: currentBatch => setCurrentBatch(currentBatch)
      });

      updateHistory(historyTrain);
      openNotification("Training is Complete");
      updateLogs("Training is complete");

      const { accuracy, recall, precision, f1 } = await testNet(
        model,
        test,
        classes
      );

      console.log(`Accuracy: ${accuracy}`);
      console.log(`Recall: ${recall}`);
      console.log(`Precision: ${precision}`);
      console.log(`F1: ${f1}`);

      setTraining(false);
      setCurrentBatch(0);
      updateLogs([
        `Accuracy: ${accuracy}`,
        `Recall: ${recall}`,
        `Precision: ${precision}`,
        `F1: ${f1}`
      ]);
    } catch (error) {
      setTraining(false);
      console.log(error);
    }
  };
  const testModel = async () => {
    try {
      const { normalize, logScaling, type, classes } = moduleConfig;

      setLoading(true);
      id.current = message.loading("Download test dataset...", 0);

      const res = await loadDataset(moduleConfig, skip, true);
      const [test] = JSON.parse(res);

      const testSet = tf.tidy(() => {
        const testTensor = getTensors(test);

        let testSet = null;
        if (normalize) testSet = normalizeTensor(testTensor, logScaling);
        else testSet = testTensor;

        return testSet;
      });

      setLoading(false);
      setLoaded(true);
      id.current();
      setTraining(true);
      updateLogs("Testing model start");

      const testNet = type === "cnn" ? testNetworkCnn : testNetworkAnn;
      const { accuracy, recall, precision, f1 } = await testNet(
        model,
        testSet,
        classes
      );
      console.log(`Accuracy: ${accuracy}`);
      console.log(`Recall: ${recall}`);
      console.log(`Precision: ${precision}`);
      console.log(`F1: ${f1}`);

      setSkip(skip + moduleConfig.size);
      setTraining(false);
      updateLogs([
        "Testing is complete",
        `Accuracy: ${accuracy}`,
        `Recall: ${recall}`,
        `Precision: ${precision}`,
        `F1: ${f1}`
      ]);
    } catch (error) {
      console.log(error);
      setTraining(false);
    }
  };
  const downloadDataset = async () => {
    try {
      setLoading(true);
      id.current = message.loading("Download dataset...", 0);

      const res = await loadDataset(moduleConfig, skip);
      const [train, val, test, numOfAttacks] = JSON.parse(res);

      setState({ datasets: { train, val, test }, numOfAttacks });
      setSkip(skip + moduleConfig.size);

      updateLogs([
        `Dataset download:`,
        `train size: ${train[0].length} samples`,
        `val size: ${val[0].length} samples`,
        `test size: ${test[0].length} samples`
      ]);

      setLoading(false);
      setLoaded(true);
      id.current();
    } catch (error) {
      setLoading(false);
      setLoadingError(true);
      id.current();
      console.log(error);
    }
  };
  const buildModel = () => {
    try {
      const { features, classes, type } = moduleConfig;
      const model =
        type === "cnn"
          ? initNetCnn(features.length, classes.length)
          : initNetAnn(features.length, classes.length);

      updateModel(model);
      updateHistory([]);
      updateLogs("Model successfully compiled");
      openNotification("Model successfully compiled");
    } catch (error) {
      console.log(error);
    }
  };

  const isDisabled = !datasets || loading || training;
  const TRAIN_BATCH = Math.floor(moduleConfig.size * 0.7);
  const totalBatchs = Math.floor(
    (TRAIN_BATCH / moduleConfig.batchSize) * moduleConfig.epochs
  );

  return (
    <ConfigureModuleWrapper>
      <Alert error={loadingError} training={training} loaded={loaded} />
      <Progress
        training={training}
        totalBatch={totalBatchs}
        currentBatch={batch}
      />
      <ContentBlock>
        <SavedModels />
        <Labels />
        <Features />
        <AdditionalSettings />
        <BtnGroup>
          <Visor config={moduleConfig} />
          <Button
            disabled={!isValidConfig() || loading || training}
            onClick={downloadDataset}
          >
            Load dataset
          </Button>
          <Button
            primary="true"
            disabled={!isValidConfig() || isDisabled}
            onClick={buildModel}
          >
            Build model
          </Button>
          <Button
            primary="true"
            disabled={isDisabled || !model}
            onClick={configurateNeuralNet}
          >
            Train model
          </Button>
          <Button
            primary="true"
            disabled={!isValidConfig() || loading || training || !model}
            onClick={testModel}
          >
            Test model
          </Button>
          <SaveModel isDisabled={isDisabled || !model} />
        </BtnGroup>
      </ContentBlock>
    </ConfigureModuleWrapper>
  );
};

export default ConfigureModule;

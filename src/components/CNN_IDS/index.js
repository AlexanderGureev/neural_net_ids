import React, { useState, useRef, useEffect } from "react";
import { ContentBlock, BtnGroup, Button, Label } from "../styles";
import { remote } from "electron";
import { config } from "./config";
import { message } from "antd";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import {
  getTensors,
  normalizeTensor
} from "../ConfigurateModule/lib/tensorsOperations";

const { loadDataset } = remote.require("../main/parser");

//const yLabels = tf.tensor([[0, 1, 0, 0, 0], [0, 1, 0, 0, 0]]);
//const yPreds = tf.tensor([[0, 1, 0, 0, 0], [0, 1, 0, 0, 0]]);

// const yLabels = tf.tensor( [1, 1]);  // считаем, что у нас 2 собщения - спам
// const yPreds = tf.tensor( [1, 0]);   // precision = 100%, т.к предсказано 1 сообщение как спам
// и оно фактически является спамом
// recall = 50%, т.к верно предсказано только 1 сообщение как спам из 2

//const argmaxP = yPreds.argMax(-1);
//const argmaxL = yLabels.argMax(-1);

//argmaxP.print()
//argmaxL.print()

// const p = tf.metrics.precision(yLabels, yPreds);
// console.log(p);

function getModel() {
  const model = tf.sequential();

  const IMAGE_WIDTH = 30;
  const IMAGE_HEIGHT = 30;
  const IMAGE_CHANNELS = 1;
  const NUM_OUTPUT_CLASSES = config.classes.length;

  model.add(
    tf.layers.conv2d({
      inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
      kernelSize: 3,
      filters: 16,
      strides: 1,
      activation: "relu",
      kernelInitializer: "varianceScaling"
    })
  );

  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

  model.add(
    tf.layers.conv2d({
      kernelSize: 3,
      filters: 32,
      strides: 1,
      activation: "relu",
      kernelInitializer: "varianceScaling"
    })
  );

  model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

  model.add(
    tf.layers.conv2d({
      kernelSize: 3,
      filters: 32,
      strides: 1,
      activation: "relu",
      kernelInitializer: "varianceScaling"
    })
  );

  model.add(tf.layers.flatten());

  model.add(
    tf.layers.dense({
      units: 64,
      kernelInitializer: "varianceScaling",
      activation: "relu"
    })
  );

  model.add(
    tf.layers.dense({
      units: 64,
      kernelInitializer: "varianceScaling",
      activation: "relu"
    })
  );

  model.add(tf.layers.batchNormalization());

  model.add(
    tf.layers.dense({
      units: NUM_OUTPUT_CLASSES,
      kernelInitializer: "varianceScaling",
      activation: "softmax"
    })
  );

  const optimizer = tf.train.rmsprop(0.001);
  model.compile({
    optimizer: optimizer,
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"]
  });

  return model;
}

function doPrediction(model, testData) {
  const [testXs, testYs] = tf.tidy(() => {
    const [tensorXs, tensorYs] = testData;
    const reshaped = tensorXs.reshape([tensorXs.shape[0], 8, 8, 1]);
    const resized = tf.image.resizeNearestNeighbor(reshaped, [30, 30]);

    return [resized, tensorYs];
  });

  const labels = testYs.argMax([-1]);
  const rawPreds = model.predict(testXs);
  const preds = rawPreds.argMax([-1]);

  testXs.dispose();
  return [preds, labels, rawPreds];
}

async function showAccuracy(model, data) {
  const [preds, labels] = doPrediction(model, data);
  const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
  const container = { name: "Accuracy", tab: "Evaluation" };
  tfvis.show.perClassAccuracy(container, classAccuracy, config.classes);

  labels.dispose();
}

const getMetrics = async (model, data) => {
  const [preds, labels, rawPreds] = doPrediction(model, data);
  const accuracy = await tfvis.metrics.accuracy(labels, preds);
  const [, yTrue] = data;

  // Recall
  const recallData = tf.metrics.recall(yTrue, rawPreds.round());
  const [recall] = await recallData.data();
  // Precision
  const precisionData = tf.metrics.precision(yTrue, rawPreds.round());
  const [precision] = await precisionData.data();

  // F1 score
  const F1 = (2 * precision * recall) / (precision + recall);

  return { accuracy, recall, precision, F1 };
};

async function showConfusion(model, data) {
  const [preds, labels] = doPrediction(model, data);
  const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
  const container = { name: "Confusion Matrix", tab: "Evaluation" };
  tfvis.render.confusionMatrix(
    container,
    { values: confusionMatrix },
    config.classes.length
  );

  labels.dispose();
}

async function showExamples([inputs, outputs]) {
  const surface = tfvis.visor().surface({
    name: "Input Data Examples",
    styles: { height: "800px" },
    tab: "Input Data"
  });

  const outputsArray = await outputs.array();
  for (let i = 0; i < inputs.shape[0]; i++) {
    const imageTensor = tf.tidy(() => {
      return inputs.slice([i, 0], [1, inputs.shape[1]]).reshape([8, 8, 1]);
    });

    const canvas = document.createElement("canvas");
    canvas.width = 100;
    canvas.height = 100;
    canvas.style = "margin: 4px;";
    await tf.browser.toPixels(imageTensor, canvas);

    // const resizedImage = tf.image.resizeNearestNeighbor(imageTensor, [
    //   100,
    //   100
    // ]);
    // await tf.browser.toPixels(resizedImage, canvas);
    // surface.drawArea.appendChild(canvas);

    const resCanvas = document.createElement("canvas");
    resCanvas.width = 80;
    resCanvas.height = 80;
    canvas.style = "margin: 4px;";

    const ctx = canvas.getContext("2d");
    resCanvas.getContext("2d").drawImage(ctx.canvas, 0, 0, 80, 80);

    const className = document.createElement("p");
    const box = document.createElement("div");
    className.textContent = config.classes[outputsArray[i].indexOf(1)];

    box.setAttribute(
      "style",
      "text-align:center; display: inline-block; padding: 0 5px;"
    );
    box.appendChild(className);
    box.appendChild(resCanvas);
    surface.drawArea.appendChild(box);
  }
}

const showDataset = ({ numOfAttacks }) => {
  const dsInfo = Object.keys(numOfAttacks).map(key => ({
    index: key,
    value: numOfAttacks[key]
  }));

  tfvis.render.barchart(
    {
      name: "Dataset statistics",
      tab: "Attack ratio"
    },
    dsInfo
  );
};

const trainNet = async (model, { train, val }, config) => {
  const metrics = ["loss", "val_loss", "acc", "val_acc"];
  const container = {
    name: "Model Training",
    styles: { height: "1000px" }
  };
  const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);

  const [trainXs, trainYs] = tf.tidy(() => {
    const [tensorXs, tensorYs] = train;
    const reshaped = tensorXs.reshape([tensorXs.shape[0], 8, 8, 1]);
    const resized = tf.image.resizeNearestNeighbor(reshaped, [30, 30]);

    return [resized, tensorYs];
  });
  const [valXs, valYs] = tf.tidy(() => {
    const [tensorXs, tensorYs] = val;
    const reshaped = tensorXs.reshape([tensorXs.shape[0], 8, 8, 1]);
    const resized = tf.image.resizeNearestNeighbor(reshaped, [30, 30]);

    return [resized, tensorYs];
  });

  tfvis.show.modelSummary(container, model);

  return model.fit(trainXs, trainYs, {
    batchSize: 1024,
    validationData: [valXs, valYs],
    epochs: config.epochs || 10,
    shuffle: true,
    callbacks: fitCallbacks
  });
};

const CNNModule = () => {
  const [loaded, setLoaded] = useState(false);
  const id = useRef(() => {});
  const dataset = useRef(null);

  useEffect(() => () => clearTimeout(id.current), []);

  const initNet = async () => {
    try {
      const { train, val, test } = dataset.current;

      const model = getModel();
      await trainNet(model, { train, val }, { epochs: 3 });

      await showAccuracy(model, test);
      await showConfusion(model, test);
      const { accuracy, recall, precision, F1 } = await getMetrics(model, test);

      console.log(`Accuracy: ${accuracy.toFixed(5)}`);
      console.log(`Recall: ${recall.toFixed(5)}`);
      console.log(`Precision: ${precision.toFixed(5)}`);
      console.log(`F1: ${F1.toFixed(5)}`);
    } catch (error) {
      console.log(error);
    }
  };

  const loadData = async () => {
    try {
      const EXAMPLE_BATCH = 50;

      id.current = message.loading("Download dataset...", 0);

      const data = await loadDataset(config);
      const [train, val, test, numOfAttacks] = JSON.parse(data);

      const normalizedTrain = normalizeTensor(getTensors(train), true);
      const normalizedVal = normalizeTensor(getTensors(val), true);
      const normalizedTest = normalizeTensor(getTensors(test), true);

      dataset.current = {
        train: normalizedTrain,
        val: normalizedVal,
        test: normalizedTest,
        numOfAttacks
      };

      setLoaded(true);
      id.current();

      const exampleSet = [
        dataset.current.test[0].slice([0, 0], [EXAMPLE_BATCH]),
        dataset.current.test[1].slice([0, 0], [EXAMPLE_BATCH])
      ];

      await showExamples(exampleSet);
      showDataset(dataset.current);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ContentBlock>
      <Label>Convolutional neural network module (IDS)</Label>
      <BtnGroup>
        <Button onClick={loadData}>Download dataset</Button>
        <Button disabled={!loaded} onClick={initNet}>
          Train
        </Button>
      </BtnGroup>
    </ContentBlock>
  );
};

export default CNNModule;

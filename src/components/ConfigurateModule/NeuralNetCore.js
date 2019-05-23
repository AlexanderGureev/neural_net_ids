import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import {
  doPrediction,
  getMetrics,
  showAccuracy,
  showConfusion,
  calculateAndDrawConfusionMatrix
} from "./lib/tensorsOperations";

const initNetAnn = (numOfFeatures, numOfClass) => {
  try {
    const model = tf.sequential();

    const configHidden1 = {
      inputShape: [numOfFeatures],
      activation: "relu",
      units: 128,
      kernelInitializer: "varianceScaling",
      useBias: true,
      biasInitializer: "varianceScaling"
    };
    const configHidden2 = {
      inputShape: [128],
      activation: "relu",
      units: 75,
      kernelInitializer: "varianceScaling",
      useBias: true,
      biasInitializer: "varianceScaling"
    };

    const configHidden3 = {
      inputShape: [75],
      activation: "relu",
      units: 75,
      kernelInitializer: "varianceScaling"
    };

    const configOutput = {
      units: numOfClass,
      activation: "softmax"
    };

    const hidden1 = tf.layers.dense(configHidden1);
    const batchN1 = tf.layers.batchNormalization();

    const hidden2 = tf.layers.dense(configHidden2);
    const drop = tf.layers.dropout(0.3);

    const hidden3 = tf.layers.dense(configHidden3);
    const batchN2 = tf.layers.batchNormalization();

    const output = tf.layers.dense(configOutput);

    model.add(hidden1);
    model.add(batchN1);

    model.add(hidden2);
    model.add(drop);
    model.add(hidden3);

    model.add(batchN2);
    model.add(output);

    return compileModelAnn(model);
  } catch (error) {
    throw error;
  }
};

const compileModelAnn = (model, params) => {
  try {
    const optimize = tf.train.adamax(0.001);

    model.compile({
      optimizer: optimize,
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"]
    });

    return model;
  } catch (error) {
    throw error;
  }
};

const trainNetworkAnn = async (
  model,
  [trainXs, trainYs],
  [valXs, valYs],
  history,
  config
) => {
  try {
    const surface = {
      name: "Batch end history",
      tab: "Training statistics"
    };
    let batchNum = 0;
    const metrics = ["loss", "val_loss", "acc", "val_acc"];
    const { onBatchEnd } = tfvis.show.fitCallbacks(surface, metrics);

    const callbacks = {
      onBatchEnd: async (batch, log) => {
        onBatchEnd(batch, log);
        config.cb(++batchNum);
      },
      onEpochEnd: async (epoch, log) => {
        history.push(log);
        tfvis.show.history(
          {
            name: "Epoch end history",
            tab: "Training statistics"
          },
          history,
          ["loss", "acc", "val_loss", "val_acc"]
        );

        //onEpochEnd(epoch, log);

        console.log(
          `Epoch ${epoch}: loss = ${log.loss}, acc = ${log.acc}, val_acc = ${
            log.val_acc
          }, val_loss = ${log.val_loss}`
        );

        await calculateAndDrawConfusionMatrix(model, valXs, valYs);
      }
    };

    await model.fit(trainXs, trainYs, {
      epochs: config.epochs,
      callbacks,
      validationData: [valXs, valYs],
      shuffle: true,
      batchSize: config.batchSize,
      yieldEvery: "batch"
    });
    return history;
  } catch (error) {
    throw error;
  }
};

const testNetworkAnn = async (
  model,
  [inputsTensor, outputsTensor],
  classes
) => {
  try {
    const [argMaxPreds, argMaxLabels, preds] = doPrediction(model, [
      inputsTensor,
      outputsTensor
    ]);

    await showAccuracy(argMaxPreds, argMaxLabels, classes);
    await showConfusion(argMaxPreds, argMaxLabels);
    const { accuracy, recall, precision, F1 } = await getMetrics(
      argMaxPreds,
      argMaxLabels,
      preds,
      outputsTensor
    );

    tf.dispose([argMaxPreds, argMaxLabels, preds]);

    return {
      accuracy: accuracy.toFixed(3),
      recall: recall.toFixed(3),
      precision: precision.toFixed(3),
      f1: F1.toFixed(3)
    };
  } catch (error) {
    throw error;
  }
};

export { initNetAnn, trainNetworkAnn, testNetworkAnn, compileModelAnn };

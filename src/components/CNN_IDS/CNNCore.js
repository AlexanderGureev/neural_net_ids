import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import {
  doPrediction,
  getMetrics,
  showAccuracy,
  showConfusion,
  calculateAndDrawConfusionMatrix
} from "../ConfigurateModule/lib/tensorsOperations";

function initNetCnn(numOfFeatures, numOfClass) {
  try {
    const model = tf.sequential();

    const IMAGE_WIDTH = 30;
    const IMAGE_HEIGHT = 30;
    const IMAGE_CHANNELS = 1;
    const NUM_OUTPUT_CLASSES = numOfClass;

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

    return compileModelCnn(model);
  } catch (error) {
    throw error;
  }
}

const compileModelCnn = (model, params) => {
  try {
    const optimizer = tf.train.rmsprop(0.001);
    model.compile({
      optimizer: optimizer,
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"]
    });

    return model;
  } catch (error) {
    throw error;
  }
};

const reshapeTensors = (train, val) => {
  const reshapedTrain = tf.tidy(() => {
    const [tensorXs, tensorYs] = train;
    const reshaped = tensorXs.reshape([tensorXs.shape[0], 8, 8, 1]);
    const resized = tf.image.resizeNearestNeighbor(reshaped, [30, 30]);

    return [resized, tensorYs];
  });
  const reshapedVal = tf.tidy(() => {
    const [tensorXs, tensorYs] = val;
    const reshaped = tensorXs.reshape([tensorXs.shape[0], 8, 8, 1]);
    const resized = tf.image.resizeNearestNeighbor(reshaped, [30, 30]);

    return [resized, tensorYs];
  });

  return [reshapedTrain, reshapedVal];
};

const trainNetworkCnn = async (model, train, val, history, config) => {
  try {
    const surface = {
      name: "Batch end history",
      tab: "Training statistics"
    };
    let batchNum = 0;
    const metrics = ["loss", "val_loss", "acc", "val_acc"];
    const { onBatchEnd } = tfvis.show.fitCallbacks(surface, metrics);

    const [[trainXs, trainYs], [valXs, valYs]] = reshapeTensors(train, val);

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

        console.log(
          `Epoch ${epoch}: loss = ${log.loss}, acc = ${log.acc}, val_acc = ${
            log.val_acc
          }, val_loss = ${log.val_loss}`
        );

        await calculateAndDrawConfusionMatrix(model, valXs, valYs);
      }
    };

    await model.fit(trainXs, trainYs, {
      batchSize: config.batchSize,
      validationData: [valXs, valYs],
      epochs: config.epochs,
      shuffle: true,
      callbacks,
      yieldEvery: "batch"
    });

    return history;
  } catch (error) {
    throw error;
  }
};

const testNetworkCnn = async (
  model,
  [inputsTensor, outputsTensor],
  classes
) => {
  try {
    const [argMaxPreds, argMaxLabels, preds] = doPrediction(
      model,
      [inputsTensor, outputsTensor],
      true
    );

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

export { initNetCnn, trainNetworkCnn, testNetworkCnn, compileModelCnn };

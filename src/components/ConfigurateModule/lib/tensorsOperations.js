import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

export const normalizeTensor = ([inputTensor, labels], logScaling = false) => {
  const [xs, ys] = tf.tidy(() => {
    let min = inputTensor.min();
    let max = inputTensor.max();

    if (logScaling) {
      const negTensor = inputTensor
        .add(1)
        .sub(tf.fill(inputTensor.shape, min.dataSync()));
      const lnTensor = negTensor.log();

      const denominator = tf.log(tf.fill(lnTensor.shape, 10));
      const log10Tensor = lnTensor.div(denominator);

      min = log10Tensor.min();
      max = log10Tensor.max();

      const normalizedInputTensor = log10Tensor.sub(min).div(max.sub(min));
      return [normalizedInputTensor, labels];
    }

    return [inputTensor.sub(min).div(max.sub(min)), labels];
  });
  return [xs, ys];
};
export const getTensors = ([xs, ys]) => [tf.tensor(xs), tf.tensor(ys)];

export const doPrediction = (
  model,
  [inputsTensor, outputsTensor],
  reshape = false
) => {
  const [argMaxPreds, argMaxLabels, preds] = tf.tidy(() => {
    if (reshape) {
      const reshaped = inputsTensor.reshape([inputsTensor.shape[0], 8, 8, 1]);
      inputsTensor = tf.image.resizeNearestNeighbor(reshaped, [30, 30]);
    }
    const p = model.predict(inputsTensor);
    const argMaxP = p.argMax(-1);
    const argMaxL = outputsTensor.argMax(-1);
    return [argMaxP, argMaxL, p];
  });
  return [argMaxPreds, argMaxLabels, preds];
};

export async function getMetrics(
  argMaxPreds,
  argMaxLabels,
  rawPreds,
  gtTensor
) {
  const accuracy = await tfvis.metrics.accuracy(argMaxLabels, argMaxPreds);

  const recallData = tf.metrics.recall(gtTensor, rawPreds.round());
  const [recall] = await recallData.data();

  const precisionData = tf.metrics.precision(gtTensor, rawPreds.round());
  const [precision] = await precisionData.data();

  const F1 = (2 * precision * recall) / (precision + recall);

  return { accuracy, recall, precision, F1 };
}

export async function showAccuracy(preds, labels, classes) {
  const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
  const container = { name: "Accuracy", tab: "Training statistics" };
  tfvis.show.perClassAccuracy(container, classAccuracy, classes);

  const dataBarChart = classAccuracy.map(({ count, accuracy: acc }, i) => ({
    index: i,
    value: acc
  }));

  tfvis.render.barchart(
    { name: "Accuracy per class", tab: "Training statistics" },
    dataBarChart,
    {
      xLabel: "Class",
      yLabel: "Accuracy"
    }
  );
}

export async function showConfusion(preds, labels) {
  const confMatrixData = await tfvis.metrics.confusionMatrix(labels, preds);

  tfvis.render.confusionMatrix(
    { name: "Confusion Matrix Test Set", tab: "Training statistics" },
    { values: confMatrixData }
  );
}

export const calculateAndDrawConfusionMatrix = async (model, xTest, yTest) => {
  const [preds, labels] = tf.tidy(() => {
    const p = model.predict(xTest).argMax(-1);
    const l = yTest.argMax(-1);
    return [p, l];
  });

  const confMatrixData = await tfvis.metrics.confusionMatrix(labels, preds);

  const surface = {
    name: "Confusion Matrix Validation Set",
    tab: "Training statistics"
  };
  tfvis.render.confusionMatrix(surface, { values: confMatrixData });

  tf.dispose([preds, labels]);
};

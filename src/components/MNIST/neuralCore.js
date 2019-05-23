import { MnistData } from "./data.js";
import * as tfvis from "@tensorflow/tfjs-vis";
import * as tf from "@tensorflow/tfjs";

function getModel() {
  const model = tf.sequential();

  const IMAGE_WIDTH = 28;
  const IMAGE_HEIGHT = 28;
  const IMAGE_CHANNELS = 1;
  const NUM_OUTPUT_CLASSES = 10;

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

async function train(model, data) {
  const metrics = ["loss", "val_loss", "acc", "val_acc"];
  const container = {
    name: "Model Training",
    styles: { height: "1000px" }
  };
  const fitCallbacks = tfvis.show.fitCallbacks(container, metrics);

  const BATCH_SIZE = 512;
  const TRAIN_DATA_SIZE = 55000;
  const TEST_DATA_SIZE = 10000;

  const [trainXs, trainYs] = tf.tidy(() => {
    const d = data.nextTrainBatch(TRAIN_DATA_SIZE);
    return [d.xs.reshape([TRAIN_DATA_SIZE, 28, 28, 1]), d.labels];
  });

  const [testXs, testYs] = tf.tidy(() => {
    const d = data.nextTestBatch(TEST_DATA_SIZE);
    return [d.xs.reshape([TEST_DATA_SIZE, 28, 28, 1]), d.labels];

    /*  
    const x = tf.tensor([
                          [1, 2, 3, 4], 
                          [1, 2, 3, 4]
                        ]);
    x.reshape([2, 2, 2, 1]).print();
    Tensor
      [ 
        [ //1 image
          [ 
            [1],
            [2]
          ],

          [   
            [3],
            [4]
          ]
        ],
        [ //2 image
          [ // row 1
            [1], // col 1
            [2]  // col 2
          ],

          [   
            [3],
            [4]
          ]
        ],
      ]
    */
  });

  return model.fit(trainXs, trainYs, {
    batchSize: BATCH_SIZE,
    validationData: [testXs, testYs],
    epochs: 10,
    shuffle: true,
    callbacks: fitCallbacks
  });
}

async function showExamples(data) {
  // Create a container in the visor
  const surface = tfvis
    .visor()
    .surface({ name: "Input Data Examples", tab: "Input Data" });

  // Get the examples
  const examples = data.nextTestBatch(20);
  const numExamples = examples.xs.shape[0];

  // Create a canvas element to render each example
  for (let i = 0; i < numExamples; i++) {
    const imageTensor = tf.tidy(() => {
      // Reshape the image to 28x28 px
      return examples.xs
        .slice([i, 0], [1, examples.xs.shape[1]])
        .reshape([28, 28, 1]);
      /*
        tf.tensor2d([
  										[1, 2, 3, 4, 6, 7, 8, 5, 3], 
                      [5, 6, 7, 8, 6, 7, 8, 5, 3]
                    ]);
        x.slice([0, 0], [1, 9]).reshape([3, 3, 1]);
        Tensor
        [ 
          [ [1],
            [2],
            [3] ],

          [ [4],
            [6],
            [7] ],

          [ [8],
            [5],
            [3] ] 
        ]
        */
    });

    const canvas = document.createElement("canvas");
    canvas.width = 28;
    canvas.height = 28;
    canvas.style = "margin: 4px;";
    await tf.browser.toPixels(imageTensor, canvas);
    surface.drawArea.appendChild(canvas);

    imageTensor.dispose();
  }
}

const classNames = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine"
];

function doPrediction(model, data, testDataSize = 500) {
  const IMAGE_WIDTH = 28;
  const IMAGE_HEIGHT = 28;
  const testData = data.nextTestBatch(testDataSize);
  const testxs = testData.xs.reshape([
    testDataSize,
    IMAGE_WIDTH,
    IMAGE_HEIGHT,
    1
  ]);
  const labels = testData.labels.argMax([-1]);
  const preds = model.predict(testxs).argMax([-1]);

  testxs.dispose();
  return [preds, labels];
}

async function showAccuracy(model, data) {
  const [preds, labels] = doPrediction(model, data);
  const classAccuracy = await tfvis.metrics.perClassAccuracy(labels, preds);
  const container = { name: "Accuracy", tab: "Evaluation" };
  tfvis.show.perClassAccuracy(container, classAccuracy, classNames);

  labels.dispose();
}

async function showConfusion(model, data) {
  const [preds, labels] = doPrediction(model, data);
  const confusionMatrix = await tfvis.metrics.confusionMatrix(labels, preds);
  const container = { name: "Confusion Matrix", tab: "Evaluation" };
  tfvis.render.confusionMatrix(
    container,
    { values: confusionMatrix },
    classNames
  );

  labels.dispose();
}

async function run() {
  const data = new MnistData();
  await data.load();
  await showExamples(data);

  const model = getModel();
  tfvis.show.modelSummary({ name: "Model Architecture" }, model);

  await train(model, data);

  await showAccuracy(model, data);
  await showConfusion(model, data);

  await model.save("downloads://mymodel");

  return model;
}

export { run };

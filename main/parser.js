const fs = require("fs");
const path = require("path");
const csv2 = require("csv-parser");
require("events").EventEmitter.defaultMaxListeners = 30;
const tf = require("@tensorflow/tfjs");
const { getFiles } = require("./files");

const getSamples = async (
  fileName,
  { maxCount, features, skip = 0, types, currentType }
) =>
  new Promise((res, rej) => {
    const reader = fs.createReadStream(fileName);
    const dataset = [[], []];

    reader.on("error", err => {
      if (err === "stop") res(dataset);
      else rej(err);
    });

    let currentLine = 0;
    let skipCount = 0;
    reader
      .pipe(
        csv2({
          strict: true,
          mapHeaders: ({ header }) =>
            features.includes(header) ? header : null,
          mapValues: ({ header, index, value }) => parseFloat(value)
        })
      )
      .on("data", data => {
        if (skipCount++ < skip) return;
        if (currentLine++ > maxCount) return reader.destroy("stop");

        const inputs = Object.values(data);
        dataset[0].push(inputs);
        dataset[1].push(types[currentType]);
      })
      .on("end", () => {
        res(dataset);
      });
  });

const nextBatch = data => {
  const x = data.reduce((acc, [xs]) => [...acc, ...xs], []);
  const y = data.reduce((acc, [, ys]) => [...acc, ...ys], []);

  const indexes = tf.util.createShuffledIndices(x.length);
  for (let i = 0; i < indexes.length; i++) {
    [x[i], x[indexes[i]]] = [x[indexes[i]], x[i]];
    [y[i], y[indexes[i]]] = [y[indexes[i]], y[i]];
  }

  return [x, y];
};

const createTasks = (
  files,
  types,
  features,
  maxCountsArray,
  skipArray,
  onlyTest = false
) => {
  if (onlyTest) {
    return Promise.all(
      files.map(filePath =>
        getSamples(filePath, {
          maxCount: maxCountsArray[maxCountsArray.length - 1],
          features,
          skip: skipArray[skipArray.length - 1],
          types,
          currentType: path.basename(filePath).split(".")[0]
        })
      )
    );
  }

  return maxCountsArray.map((counts, i) =>
    Promise.all(
      files.map(filePath =>
        getSamples(filePath, {
          maxCount: counts,
          features,
          skip: skipArray[i],
          types,
          currentType: path.basename(filePath).split(".")[0]
        })
      )
    )
  );
};

const getLabels = classes => {
  const outputs = classes.map(v => 0);
  const types = classes.reduce((acc, currClass, i) => {
    const output = outputs.slice(0);
    output[i] = 1;
    return { ...acc, [currClass]: output };
  }, {});

  return types;
};

const loadDataset = async (
  { size, classes, features },
  skip = 0,
  onlyTest = false
) => {
  const TRAIN_PART = 0.7;
  const VAL_PART = 0.2;
  const TEST_PART = 0.1;

  const trainSize = Math.floor(size * TRAIN_PART);
  const valSize = Math.floor(size * VAL_PART);
  const testSize = Math.floor(size * TEST_PART);

  const files = await getFiles(path.join(__dirname, "samples"));
  const filteredFiles = files.filter(filePath =>
    classes.includes(path.basename(filePath).split(".csv")[0])
  );

  const types = getLabels(classes);
  const numOfAttacks = classes.reduce(
    (acc, curr) => ({ ...acc, [curr]: Math.floor(size / classes.length) }),
    {}
  );

  const trainMaxCountPerClass = Math.floor(trainSize / classes.length);
  const valMaxCountPerClass = Math.floor(valSize / classes.length);
  const testMaxCountPerClass = Math.floor(testSize / classes.length);

  const skipTrain = Math.floor(Math.floor(skip * TRAIN_PART) / classes.length);
  const skipVal = Math.floor(Math.floor(skip * VAL_PART) / classes.length);
  const skipTest = Math.floor(Math.floor(skip * TEST_PART) / classes.length);

  const tasks = createTasks(
    filteredFiles,
    types,
    features,
    [trainMaxCountPerClass, valMaxCountPerClass, testMaxCountPerClass],
    [
      skipTrain,
      skipTrain + trainMaxCountPerClass + skipVal,
      skipTrain +
        trainMaxCountPerClass +
        skipVal +
        valMaxCountPerClass +
        skipTest
    ],
    onlyTest
  );

  if (onlyTest) {
    const test = await tasks;
    const testSet = nextBatch(test);
    return JSON.stringify([testSet]);
  }

  const [train, val, test] = await Promise.all(tasks);

  const trainSet = nextBatch(train);
  const valSet = nextBatch(val);
  const testSet = nextBatch(test);

  return JSON.stringify([trainSet, valSet, testSet, numOfAttacks]);
};

module.exports = {
  loadDataset
};

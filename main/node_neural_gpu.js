const tf = require("@tensorflow/tfjs");
//tf.backend = require("@tensorflow/tfjs-node-gpu");
const { loadDataset } = require("./parser");

const compileModel = (numOfFeatures, numOfClass) => {
  const model = tf.sequential();

  const configHidden1 = {
    inputShape: [numOfFeatures],
    activation: "relu",
    units: 75,
    kernelInitializer: "varianceScaling"
  };
  const configHidden2 = {
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

  const hidden3 = tf.layers.dense(configHidden2);
  const output = tf.layers.dense(configOutput);

  model.add(hidden1);
  model.add(batchN1);
  model.add(hidden3);
  model.add(output);

  const optimize = tf.train.adam(0.01);

  const config = {
    optimizer: optimize,
    loss: tf.losses.softmaxCrossEntropy,
    metrics: ["accuracy"]
  };

  model.compile(config);
  return model;
};
const config = {
  classes: [
    "benign",
    "bot",
    "ddos",
    "infilteration",
    "ddos attack-hoic",
    "portscan",
    "ftp-bruteforce",
    "ssh-bruteforce",
    "dos slowloris",
    "dos slowhttptest",
    "dos hulk",
    "dos goldeneye",
    "ddos attacks-loic-http"
  ],
  features: [
    "flow duration",
    "tot fwd pkts",
    "tot bwd pkts",
    "totlen fwd pkts",
    "totlen bwd pkts",
    "fwd pkt len max",
    "fwd pkt len min",
    "fwd pkt len mean",
    "fwd pkt len std",
    "bwd pkt len max",
    "bwd pkt len min",
    "bwd pkt len mean",
    "bwd pkt len std",
    "flow byts/s",
    "flow pkts/s",
    "flow iat mean",
    "flow iat std",
    "flow iat max",
    "flow iat min",
    "fwd iat tot",
    "fwd iat mean",
    "fwd iat std",
    "fwd iat max",
    "fwd iat min",
    "bwd iat tot",
    "bwd iat mean",
    "bwd iat std",
    "bwd iat max",
    "bwd iat min",
    "fwd psh flags",
    "bwd psh flags",
    "fwd urg flags",
    "bwd urg flags",
    "bwd header len",
    "fwd pkts/s",
    "bwd pkts/s",
    "pkt len min",
    "pkt len max",
    "pkt len mean",
    "pkt len std",
    "pkt len var",
    "fin flag cnt",
    "syn flag cnt",
    "rst flag cnt",
    "psh flag cnt",
    "ack flag cnt",
    "urg flag cnt",
    "cwe flag count",
    "ece flag cnt",
    "down/up ratio",
    "pkt size avg",
    "fwd seg size avg",
    "bwd seg size avg",
    "fwd byts/b avg",
    "fwd pkts/b avg",
    "fwd blk rate avg",
    "bwd byts/b avg",
    "bwd pkts/b avg",
    "bwd blk rate avg",
    "subflow fwd pkts",
    "subflow fwd byts",
    "subflow bwd pkts",
    "subflow bwd byts",
    "init fwd win byts",
    "init bwd win byts",
    "fwd act data pkts",
    "fwd seg size min",
    "active mean",
    "active std",
    "active max",
    "active min",
    "idle mean",
    "idle std",
    "idle max",
    "idle min"
  ],
  size: 200000
};

const normalizeTensor = ([inputTensor, labels], logScaling = false) => {
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
};
const getTensors = ([xs, ys]) => [tf.tensor(xs), tf.tensor(ys)];

const start = async () => {
  try {
    const res = await loadDataset(config);
    const [train, val] = JSON.parse(res);

    const trainTensor = getTensors(train);
    const valTensor = getTensors(val);

    const [trainXs, trainYs] = normalizeTensor(trainTensor, true);
    const normVal = normalizeTensor(valTensor, true);

    const model = compileModel(config.features.length, config.classes.length);

    return model.fit(trainXs, trainYs, {
      epochs: 50,
      shuffle: true,
      callbacks: {
        onBatchEnd: async (epoch, logs) => {
          console.log(logs);
        },
        onEpochEnd: async (epoch, logs) => {
          console.log(`${epoch}:${logs.loss}, ${logs.val_acc}`);
        }
      },
      validationData: normVal,
      batchSize: 512
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await start();
})();

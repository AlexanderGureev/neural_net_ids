const random = require("random");
const { argv } = require("yargs");
const fs = require("fs");

function minMaxFinder(input, logScaling) {
  return input.map(value => {
    let parsedValue;
    if (logScaling) {
      parsedValue = !isFinite(Math.log10(parseFloat(value)))
        ? 0
        : Math.log10(parseFloat(value));
    } else {
      parsedValue = parseFloat(value);
    }

    if (parsedValue > this.max) {
      this.max = parsedValue;
    }
    if (parsedValue < this.min) {
      this.min = parsedValue;
    }
    return parsedValue;
  });
}

const minMaxNorm = (inputs, { min, max }) => {
  try {
    for (let i = 0; i < inputs.length; i++) {
      inputs[i] = (parseFloat(inputs[i]) - min) / (max - min);
    }
  } catch (error) {
    throw error;
  }
};

const generateDataset = async (
  fileName,
  { normalize = false, logScaling = false },
  onlyTest
) => {
  try {
    const dataset = await fs.promises.readFile(fileName, "utf8");
    const parsedDataset = JSON.parse(dataset);

    const infoDatasets = {
      train: {
        min: 0,
        max: 0
      },
      test: {
        min: 0,
        max: 0
      },
      val: {
        min: 0,
        max: 0
      }
    };

    const usedIndex = new Set();
    const train = [[], []];
    const val = [[], []];
    const test = [[], []];

    const trainingAmount = Math.floor(parsedDataset.length * 0.8);
    const validationAmount = Math.floor(parsedDataset.length * 0.15);
    const testAmount = Math.floor(parsedDataset.length * 0.05);

    let tmp = [[], []];

    const iter = (mass, counts, data, context) => {
      for (let i = 0; i < counts; i++) {
        let index;
        let next = false;

        while (!next) {
          index = random.uniformInt(0, data.length - 1)();
          if (!usedIndex.has(index)) next = true;
        }
        usedIndex.add(index);
        next = false;

        const inputs = minMaxFinder.call(
          context,
          data[index].input,
          logScaling
        );

        mass[0].push(inputs);
        mass[1].push(data[index].output);
      }
      if (normalize) {
        mass[0].forEach(inputs => minMaxNorm(inputs, context));
      }
    };

    if (onlyTest) {
      iter(test, testAmount, parsedDataset, infoDatasets.test);
      return { test };
    }

    iter(train, trainingAmount, parsedDataset, infoDatasets.train);
    tmp = parsedDataset.filter((item, i) => !usedIndex.has(i));
    usedIndex.clear();

    iter(val, validationAmount, tmp, infoDatasets.val);
    tmp = tmp.filter((item, i) => !usedIndex.has(i));
    usedIndex.clear();

    iter(test, testAmount, tmp, infoDatasets.test);
    tmp = tmp.filter((item, i) => !usedIndex.has(i));
    usedIndex.clear();

    return { train, val, test };
  } catch (error) {
    throw error;
  }
};

process.on("message", async () => {
  const config = JSON.parse(argv.config);
  const onlyTest = JSON.parse(argv.onlyTest);
  const result = await generateDataset(argv.fileName, config, onlyTest);
  process.send(result);
});

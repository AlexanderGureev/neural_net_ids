const fs = require("fs");
const path = require("path");
const csv2 = require("csv-parser");
require("events").EventEmitter.defaultMaxListeners = 30;
const csv = require("csv");
const { getFiles } = require("./files");

const { fileAttackTypes, features, labels } = require("./formats");

const parseFile = (fileName, labels, features, openedStreams) => {
  const DEST_DIR = path.join(__dirname, "samples");

  const writers = fileAttackTypes[fileName].reduce((acc, type) => {
    if (!labels.includes(type)) return acc;
    return {
      ...acc,
      [type]: fs.createWriteStream(`${path.join(DEST_DIR, type.trim())}.csv`, {
        flags: "a+"
      })
    };
  }, {});

  const featuresClone = [...features, "label", "\n"];

  return new Promise((res, rej) => {
    fs.createReadStream(fileName)
      .pipe(
        csv2({
          strict: true,
          skipLines: 0,
          mapHeaders: ({ header }) => {
            const parsedHeader = header.toLowerCase().trim();
            return featuresClone.includes(parsedHeader) ? parsedHeader : null;
          },
          mapValues: ({ header, index, value }) => value.toLowerCase().trim()
        })
      )
      .pipe(
        csv.transform(sample => {
          if (
            Object.values(sample).some(
              num => num === "nan" || num === "infinity"
            ) ||
            !labels.includes(sample.label)
          )
            return null;

          return sample;
        })
      )
      .pipe(
        csv.stringify({
          quoted: false
        })
      )
      .pipe(
        csv.transform(data => {
          const types = data.toString("utf8").split(",");
          const outputFileName = types[types.length - 1].trim();

          if (!openedStreams[outputFileName]) {
            openedStreams[outputFileName] = true;
            writers[outputFileName].write(featuresClone.join());
          }
          writers[outputFileName].write(data);
        })
      )
      .on("close", () => {
        res();
      });
  });
};

const preParser = async () => {
  try {
    const DEST_DIR = path.join(__dirname, "samples");
    const openedStreams = {};

    const f = await fs.promises.readdir(DEST_DIR);
    if (f.length) {
      for (const filePath of f) {
        await fs.promises.unlink(path.join(DEST_DIR, filePath));
      }
    }

    const files = await getFiles();
    await Promise.all(
      files.map(f => parseFile(f, labels, features, openedStreams))
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  preParser
};

const fs = require("fs");
const path = require("path");

const cacheFileName = "cache.json";
const cacheFolder = path.join(__dirname, "cache");


const createOrReadCache = async () => {
  try {
    const dir = await fs.promises.readdir(cacheFolder);

    if (!dir.includes(cacheFileName)) {
      await fs.promises.writeFile(path.join(cacheFolder, cacheFileName), "[]");
    }

    const file = await fs.promises.readFile(
      path.join(cacheFolder, cacheFileName),
      "utf8"
    );
    return JSON.parse(file);
  } catch (error) {
    console.log(error);
  }
};

const checkCache = async (config, cache) => {
  try {
    const [isExist] = cache.reduce(
      (acc, { classes, features, size, skip, numOfAttacks, fileName }) => {
        const cachedObj = JSON.stringify({
          classes,
          features,
          size,
          skip
        });
        const equals = cachedObj === JSON.stringify(config);

        return equals ? [...acc, { fileName, numOfAttacks }] : acc;
      },
      []
    );
    return isExist;
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
  createOrReadCache,
  checkCache
}
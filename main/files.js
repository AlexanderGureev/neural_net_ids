const fs = require("fs");
const path = require("path");

const getFiles = async folder => {
  const files = await fs.promises.readdir(folder);
  return files.map(fileName => path.join(folder, fileName));
};

module.exports = {
  getFiles
};

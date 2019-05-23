const {
  override,
  fixBabelImports,
  addLessLoader,
  addBabelPlugin
} = require("customize-cra");
const ImageminPlugin = require("imagemin-webpack-plugin").default;

const addTarget = config => {
  config.output = { ...config.output, globalObject: "this" };
  config.target = "electron-renderer";
  return config;
};

const addImageMinPlugin = config => {
  config.plugins.push(
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== "production", // Disable during development
      pngquant: {
        quality: "95-100"
      }
    })
  );
  return config;
};

const addWorkerPlugin = config => {
  config.module.rules.push({
    test: /\.worker\.js$/,
    use: { loader: "worker-loader" }
  });
  return config;
};

module.exports = override(
  addBabelPlugin(["babel-plugin-styled-components", { displayName: true }]),
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "font-family": "Montserrat"
    }
  }),
  addImageMinPlugin,
  addTarget,
  addWorkerPlugin
  // addBundleVisualizer()
);

const path = require("path");
const os = require("os");
const IS_BROWSER = os.platform() === "browser";

const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

let crypto;
if (IS_BROWSER) {
  crypto = window.crypto;
} else {
  crypto = require("crypto");
}

module.exports = (env) => {
  // eslint-disable-next-line no-console
  // console.log(env.mod);

  return {
    // mode: env.mod,
    entry: {
      scriptWizCore: "./src/index.ts",
    },
    output: {
      filename: "index.js",
      library: "[name]",
      path: path.resolve(__dirname, "dist"),
      libraryTarget: "commonjs2",
    },
    devtool: "source-map", // devtool: 'cheap-module-source-map',
    module: {
      rules: [
        { test: /\.ts$/, loader: "ts-loader" },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader",
        },
        {
          test: /\.node$/,
          loader: "native-ext-loader",
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js", ".d.ts", ".node"],
    },
    externals: {
      crypto: "crypto",
    },
    plugins: [new NodePolyfillPlugin()],
  };
};

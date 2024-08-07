import { merge } from "webpack-merge";
import common from "./webpack.config.js";
import webpack from "webpack";
import dotenv from "dotenv";

export default () => {
  merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
      contentBase: "./dist",
    },
  });

  const env = dotenv.config().parsed;
  // reduce it to a nice object, the same as before
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    plugins: [new webpack.DefinePlugin(envKeys)],
  };
};

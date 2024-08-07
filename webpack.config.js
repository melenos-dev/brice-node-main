import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import webpack from "webpack";
import dotenv from "dotenv";

export default () => {
  const env = dotenv.config().parsed;
  // reduce it to a nice object, the same as before
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    output: {
      path: path.join(path.dirname(fileURLToPath(import.meta.url)), "/dist"), // the bundle output path
      filename: "bundle.js", // the name of the bundle
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          "public/index.html"
        ),
        filename: "index.html",
      }),
      new webpack.DefinePlugin(envKeys),
    ],
    devServer: {
      port: 3030, // you can change the port
      compress: true,
      allowedHosts: "all",
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/, // .js and .jsx files
          exclude: /node_modules/, // excluding the node_modules folder
          use: {
            loader: "babel-loader",
          },
        },
        {
          test: /\.(sa|sc|c)ss$/, // styles files
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.(png|jpg|woff|woff2|eot|ttf|svg|wav|ico|txt|pdf)$/, // to import images and fonts
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 8192,
            },
          },
        },
      ],
    },
  };
};

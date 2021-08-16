import * as webpack from "webpack";
import path from "path";
import nodeExternals from "webpack-node-externals";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

export default {
  mode: "production",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "out"),
    filename: "bundle.js",
  },
  target: "node",
  externals: [
    nodeExternals({ allowlist: [/yaarxiv\-api.*/]}) as any,
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        include: [
          path.resolve(__dirname, "src"),
          path.resolve(__dirname, "..", "api"),
        ],
      },
    ],
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js" ],
    plugins: [new TsconfigPathsPlugin()],
  },
  optimization: { minimize: false },
} as webpack.Configuration;

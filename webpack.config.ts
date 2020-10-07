import webpack from "webpack";
import sass from "sass";
import fibers from "fibers";
import path from "path";

const baseUrl = process.env.BASE_URL ?? "/";

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

const config: webpack.Configuration = {
  mode: isProduction ? "production" : "development",
  entry: {
    main: path.join(__dirname, "src", "index.tsx"),
  },
  output: {
    publicPath: baseUrl,
    path: path.join(__dirname, "dist"),
    filename: "scripts/[name].[contenthash:8].js",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
            options: {
              configFile: path.join(__dirname, "tsconfig.json"),
            },
          },
        ],
      },
      {
        test: /\.(?:c|sa|sc)ss$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: {
                auto: /\.module\.\w$/,
                localIdentName: isProduction ? "[hash:base64]" : "[path][name]__[local]",
                exportLocalsConvention: "dashesOnly",
              },
              sourceMap: isDevelopment,
            },
          },
          {
            loader: "sass-loader",
            options: {
              implementation: sass,
              sassOptions: {
                fiber: fibers,
              },
            },
          },
        ],
      },
    ],
  },
  devtool: isDevelopment ? "inline-source-map" : false,
};

export default config;

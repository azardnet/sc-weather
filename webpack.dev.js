const Dotenv = require('dotenv-webpack');
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    main: "./index.js"
  },
  output: {
    path: path.join(__dirname, "./build"),
    filename: "[name].bundle.js"
  },
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html"
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new Dotenv()
  ],
  devServer: {
    compress: true,
    port: 3700,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(s*)css$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /((?<!arrow.*)\.svg|\.(png|jpg))$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "img",
            esModule: false
          }
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
          options: {
            minimize: true,
          },
        },
      },
    ]
    },
  
};
const Dotenv = require('dotenv-webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const BrotliPlugin = require('brotli-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const glob = require("glob");


module.exports = {
  entry: {
    main: "./index.js",
  },
  output: {
    path: path.join(__dirname, "./build"),
    filename: "[name].[chunkhash:8].bundle.js",
    chunkFilename: "[name].[chunkhash:8].chunk.js",
  },
  mode: "production",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      filename: "index.html",
      scriptLoading: "defer",
    }),
    new CleanWebpackPlugin(),
    new PurgecssPlugin({
      paths: glob.sync(path.resolve(__dirname, "../src/**/*"), { nodir: true }),
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[chunkhash:8].bundle.css",
      chunkFilename: "[name].[chunkhash:8].chunk.css",
    }),
    new CompressionPlugin({
      algorithm: "gzip",
    }),
    new BrotliPlugin(),
    new Dotenv(),
    new CopyWebpackPlugin({
      patterns: [{ from: "static/meta", to: "pub" }],
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
      exclude: [/\.map$/, /\.DS_Store$/, /\.html$/],
      navigateFallback: "https://azardnet.github.io/sc-weather/index.html",
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "azard_vendors",
          chunks: "all",
        },
      },
      chunks: "all",
    },
    runtimeChunk: {
      name: "run",
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(s*)css$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /((?<!import.*)\.svg|\.(png|jpg))$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash].[ext]",
            outputPath: "img",
            esModule: false,
          },
        },
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
      {
        test: /\.mp4$/,
        use: {
          loader: "file-loader",
          options: {
            esModule: false,
          },
        },
      },
    ],
  },
};
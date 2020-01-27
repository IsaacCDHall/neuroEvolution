const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require("html-webpack-plugin");

const ROOT = path.resolve( __dirname, 'src' );
const DESTINATION = path.resolve( __dirname, 'dist' );

module.exports = {
  context: ROOT,

  entry: {
    main: "./main.js"
  },

  output: {
    filename: "[name].bundle.js",
    path: DESTINATION
  },

  resolve: {
    extensions: [".jsx", ".js"],
    modules: [ROOT, "node_modules"]
  },

  module: {
    rules: [
      /****************
       * PRE-LOADERS
       *****************/
      {
        enforce: "pre",
        test: /\.js$/,
        use: "source-map-loader"
      }
    ]
  },

  devtool: "cheap-module-source-map",
  devServer: {},
  plugins: [
    // New plugin
    new HtmlWebpackPlugin({
      // injects bundle.js to our new index.html
      inject: true,
      // copys the content of the existing index.html to the new /build index.html
      path: DESTINATION,
      template: path.resolve("./src/index.html")
    })
  ]
};

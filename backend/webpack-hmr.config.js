const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');


module.exports = {
  entry: ['webpack/hot/poll?100', './src/main.ts'],
  watch: true,
  target: 'node',
  externals: [
    nodeExternals({
      allowlist: ['webpack/hot/poll?100'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new RunScriptWebpackPlugin({ name: 'main.js' }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      src: path.resolve(__dirname, 'src'), // Add alias for 'src'
    },
  },
  output: {
    path: __dirname + '/dist',
    filename: 'main.js',
  },
  mode: 'development',
};


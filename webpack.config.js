// webpack.config.js
const path = require('path');

module.exports = {
  entry: './scripts/index.tsx',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'popup.js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development',
};

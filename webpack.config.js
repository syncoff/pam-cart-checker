// webpack.config.js
const path = require('path');

module.exports = {
  entry: {
    popup: './scripts/index.tsx', // Popup react enty point
    content: './scripts/content.ts' // Content script entry point
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js', // Generates popup.js and content.js
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        },
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development',
};

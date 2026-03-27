// webpack.config.js
const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  return {
    entry: {
      popup: './scripts/index.tsx', // Popup react enty point
      content: './scripts/content.ts' // Content script entry point
    },
    output: {
      path: path.resolve(__dirname, 'public'),
      filename: '[name].js', // Generates popup.js and content.js
      charset: true
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    // Hide source maps in production to keep bundle small
    devtool: isProduction ? false : 'cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: true // Fast compilation
            }
          },
          exclude: /node_modules/,
        },
        // Rule for loading CSS files into the DOM
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'images/'
              }
            }
          ]
        }
      ],
    },
    plugins: [
      // Runs TypeScript type checker on a separate process
      new ForkTsCheckerWebpackPlugin()
    ]
  };
};

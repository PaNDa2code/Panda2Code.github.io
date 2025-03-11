const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development', // Change to 'production' for final build
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js', // Output JS in 'dist/js/'
    assetModuleFilename: 'assets/[hash][ext][query]', // Organize assets
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext][query]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[name][ext]', // Store fonts in 'dist/assets/fonts/'
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/styles.css', // Store CSS in 'dist/css/'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'public/.well-known', to: '.well-known' }, // Ensure 'public' files are copied, including '.well-known/discord'
      ],
    }),
  ], devServer: {
    static: path.resolve(__dirname, 'dist'),
    hot: true,
    open: true,
    port: 3000, // Use port 3000 instead of default 8080
  },
};

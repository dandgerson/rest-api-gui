const merge = require('webpack-merge');

const path = require('path');
const glob = require('glob');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'dist'),
};

const commonConfig = merge([
  parts.loadFonts(),
  {
    plugins: [
      new HtmlWebpackPlugin({
        title: 'REST API GUI',
      }),
    ],
  },
]);

const productionConfig = merge([
  parts.clean(PATHS.build),
  parts.extractCSS({
    use: ['css-loader', parts.autoprefix(), 'sass-loader',],
  }),
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[ext]',
    },
  }),
  parts.generateSourceMaps({ type: 'source-map' }),
  {
    optimization: {
      splitChunks: {
        chunks: 'initial',
      },
    },
  },
]);

const developmentConfig = merge([
  parts.devServer({
    host: process.env.HOST,
    port: process.env.PORT,
  }),
  parts.loadCSS(),
  parts.loadImages(),
]);

module.exports = mode => {
  if (mode === 'production') {
    return merge(commonConfig, productionConfig, { mode });
  }
  return merge(commonConfig, developmentConfig, { mode });
};
/* eslint-disable no-new */
/* eslint-disable space-before-function-paren */
/* eslint-disable semi */
const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const TerserPlugin = require('terser-webpack-plugin');

let minify = true;

module.exports = (env, argv) => {
  if (argv.development) minify = false;

  // const files = fs.readdirSync('./src/views/')
  //   .filter((name) => path.extname(name).toLowerCase() === '.html')
  //   .map((file) => new HtmlWebpackPlugin({
  //     template: `./src/views/${file}`,
  //     minify : false,
  //     inject: false,
  //     filename: `./views/${file}`,
  //   }));

  const getAllFiles = function (dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath)
    arrayOfFiles = arrayOfFiles || []
    files.forEach(function (file) {
      if (fs.statSync(dirPath + '/' + file).isDirectory()) {
        arrayOfFiles = getAllFiles(dirPath + '/' + file, arrayOfFiles)
      } else {
        arrayOfFiles.push(path.join(dirPath, '/', file))
      }
    })
    return arrayOfFiles
  }

  const allfiles = getAllFiles('src/views')
  const htmlfiles = allfiles.map((file) => new HtmlWebpackPlugin({
    template: `./${file.replace('\\', '/').replace('\\', '/').replace('\\', '/').replace('\\', '/').replace('\\', '/').replace('\\', '/')}`,
    minify: true,
    inject: false,
    filename: `.${file.replace('\\', '/').replace('\\', '/').replace('\\', '/').replace('\\', '/').replace('\\', '/').replace('\\', '/').replace('src', '')}`
  }))

  const config = {
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, './dist')
    },
    plugins: [
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: true
      }),
      ...htmlfiles,
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        minify: false,
        filename: 'index.html'
      }),
      // new HtmlWebpackPlugin({
      //   template: 'src/flipbook.html',
      //   minify : false,
      //   inject: false,
      //   filename: 'flipbook.html',
      // }),
      // new HtmlWebpackPlugin({
      //   template: 'src/loading.html',
      //   minify : false,
      //   inject: false,
      //   filename: 'loading.html',
      // }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[id].[contenthash].css'
      }),
      new CopyPlugin({
        patterns: [
          { from: 'public' }
          // { from: 'form', to: 'form' }
        ]
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        moment: 'moment'
      })
      // new webpack.ProvidePlugin({
      //   'window.Dropdown': ['bootstrap', 'Dropdown']
      // })
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.svg$/,
          use: {
            loader: 'svg-url-loader',
            options: {
              encoding: 'base64'
            }
          }
        }
      ]
    },
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'async',
        minSize: 20000,
        minRemainingSize: 0,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },
    resolve: {
      fallback: {
        child_process: false
        // tls: false,
        /// ....
      }
    }
  //   node: {
  //     child_process: "empty"
  //     // fs: "empty", // if unable to resolve "fs"
  // },
  };

  if (argv.development) {
    console.log('\x1b[35m%s\x1b[0m', 'Using development configs');
    config.entry = './src/js/index.js';
    config.devtool = 'source-map';
    config.devServer = {
      contentBase: './dist',
      compress: true,
      port: 9000
    };
    config.mode = 'development';
    config.output.filename = './js/main.js';
  }

  if (argv.production) {
    console.log('\x1b[36m%s\x1b[0m', 'Setting up production configuration...');
    config.mode = 'production';
    config.entry = './src/js/index.js';
    config.output.filename = './js/main.js';
  }

  return config;
};

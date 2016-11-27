"use strict";
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require("webpack");


const types = ['vibration', 'displacement', 'strain', 'cableforce', 'corrosion', 'verticality', 'trafficload', 'deflection']
const dashboard = [
    'webpack-hot-middleware/client?reload=true',
    "./dashboard/index.js"
];

let entry = Object.assign({
    "vendor": [
      'webpack-hot-middleware/client?reload=true',
      './resource/common.less'
    ],
    "dashboard": dashboard,
}, initMonitorEntry());

function initMonitorEntry()
{
    let entries = {};

    for (let type of types)
    {
        entries[type] = [
          'webpack-hot-middleware/client?reload=true',
          "./monitor/index.js",
          `./monitor/${type}/index.js`
        ];
    }
    return entries;
}

let plugins = [
  new HtmlWebpackPlugin({
      template: "./dashboard/html.js",
      filename: "./dashboard/index.html",
      chunks: ["vendor", "dashboard"]
  }),

  // new webpack.ProvidePlugin({
  //     $: 'jquery',
  //     jQuery: 'jquery',
  //     'window.jQuery': 'jquery',
  //     'window.$': 'jquery',
  // }),
  new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[name]/common.js',
      minChunks: 4,
  }),
  new ExtractTextPlugin('resource/[name].css'),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.optimize.OccurenceOrderPlugin(),
  new webpack.NoErrorsPlugin()
].concat(initHtmlWebpackPluginConfig());

function initHtmlWebpackPluginConfig()
{
    let plugins = [];

    for (let type of types)
    {
        plugins.push(new HtmlWebpackPlugin({
            template: `./monitor/${type}/html.js`,
            filename: `./monitor/${type}/index.html`,
            chunks: ["vendor",`${type}`]
        }));
    }
    return plugins;
}


module.exports = {
    context: path.resolve("./src"),
    entry: entry,
    output: {
        path: path.resolve("./public"),
        filename: "[name].min.js",
        sourceMapFilename: '[file].map',
        publicPath: '/'

    },
    module: {
        loaders: [{
            test: /\.ejs$/,
            loader: "ejs-loader"
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader",
            query: {
                "presets": ["es2015"]
            }
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(["css"]),
            exclude: "lib"
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract(["css", "less"]),
            exclude: "lib"
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: 'url?limit=8192&name=resource/image/[name].[ext]',
            exclude: "lib"
        }, {
            test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
            loader: 'file?name=resource/font/[name].[ext]',
            exclude: "lib"
        }]
    },
    plugins: plugins,
    devtool: 'source-map'
};

"use strict";
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require("webpack");

const dashboard = [
    'webpack-hot-middleware/client?reload=true',
    "./dashboard/index.js"
];

const vibration = [
  'webpack-hot-middleware/client?reload=true',
  "./monitor/index.js",
  "./monitor/vibration/index.js"
];

const entry = {
    "vendor": [
      'webpack-hot-middleware/client?reload=true',
      './resource/common.less'
    ],
    "dashboard": dashboard,
    "vibration": vibration
};


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
    plugins: [
        new HtmlWebpackPlugin({
            template: "./dashboard/html.js",
            filename: "./dashboard/index.html",
            chunks: ["vendor", "dashboard"]
        }),

        new HtmlWebpackPlugin({
            template: "./monitor/vibration/html.js",
            filename: "./monitor/vibration/index.html",
            chunks: ["vendor", "vibration"]
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
    ],
    devtool: 'source-map'
};

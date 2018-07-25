"use strict"

const webpack = require('webpack')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const HtmlWebpackPlugin = require('html-webpack-plugin')
    //const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    devtool: 'eval-source-map',
    mode: 'development',

    entry: {
        /*
        app: ['babel-polyfill', path.resolve(__dirname, 'src', 'index.js')],
        vendor: ['phaser']
		*/
        app: './src/index.ts',
        'vendor': ['phaser']
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].[chunkhash].js'
    },

    module: {
        rules: [{
                test: /\.js$/,
                include: path.join(__dirname, 'src'),
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                },
            },
            {
                test: /\.ts$/,
                loader: ['babel-loader', 'awesome-typescript-loader'],
                include: path.join(__dirname, 'src'),
            },
            {
                test: [/\.vert$/, /\.frag$/],
                use: 'raw-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'build')
    },
    plugins: [
        /*
        new CleanWebpackPlugin('build'),
        */
        new webpack.DefinePlugin({
            'typeof CANVAS_RENDERER': JSON.stringify(true),
            'typeof WEBGL_RENDERER': JSON.stringify(true)
        }),
        new HtmlWebpackPlugin({
            path: path.resolve(__dirname, 'build', 'index.html'),
            template: 'index.html'
        }),
        new webpack.HashedModuleIdsPlugin(),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'assets'),
            to: path.resolve(__dirname, 'build', 'assets')
        }, {
            from: path.resolve(__dirname, 'favicon.ico'),
            to: path.resolve(__dirname, 'build', 'favicon.ico')
        }])

        //new webpack.optimize.SplitChunksPlugin()
    ],
}
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',                    // Location of main js file
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'                // Where the bundle file should be saved
    },
    devServer: {
        contentBase: './dist'                   // Content root path
    },
    module: {
        rules: [
            {
                test: /\*.js$/,                 // Tell babel which extension files to transpile
                exclude: /node_modules/,        // Files to be ignored
                use: {
                    loader: 'babel-loader'      // Specify the babel loader - transpile ES6
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',             // Create this file in output.path
            template: './public/index.html'     // From this template
        })
    ]
};

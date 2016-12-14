const webpack = require('webpack')
const path = require('path')

const BUILD_DIR = path.join(__dirname, 'src')
const OUTPUT_DIR = path.join(__dirname, '../public/javascripts/')

module.exports = {
    entry: path.join(BUILD_DIR, 'index.jsx'),
    output: {
        path: OUTPUT_DIR,
        filename: '[name].js',
    },
    resolve: {
        extensions: ['', '.js', '.webpack.js', '.jsx'],
        root: ['node_modules', 'src']
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                include: BUILD_DIR,
                loader: 'babel'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify('production')
        }
        })
    ]
}

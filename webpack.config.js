const path = require('path'),
    webpack = require('webpack'),
    UglifyJsPlugin = webpack.optimize.UglifyJsPlugin,
    ExtractTextPlugin = require("extract-text-webpack-plugin");

const env = process.env.NODE_ENV;
const libraryName = '[name]';

const plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env)
    })
];

let outputFile;
if (env === 'production') {
    plugins.push(new UglifyJsPlugin({
        sourceMap: true,
        compress: {
            warnings: true
        },
    }));
    plugins.push(new webpack.LoaderOptionsPlugin({
        minimize: true
    }));
    outputFile = libraryName + '.min.js';
    plugins.push(new ExtractTextPlugin({
        filename: 'css/styles.min.css'
    }));
} else {
    outputFile = libraryName + '.js';
    plugins.push(new ExtractTextPlugin({
        filename: 'css/styles.css'
    }));
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        'react-perfect-scrollbar': './index.js',
        'react-perfect-scrollbar/styles.scss': './styles.scss'
    },
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: outputFile,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    resolve: {
        modules: [
            path.join(__dirname, "./"),
            "node_modules"
        ],
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                minimize: false
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            }
        ]
    },
    externals: [
        {
            react: {
                root: 'React',
                commonjs2: 'react',
                commonjs: 'react',
                amd: 'react'
            },
        },
        {
            'react-dom': {
                root: 'ReactDOM',
                commonjs2: 'react-dom',
                commonjs: 'react-dom',
                amd: 'react-dom'
            },
        },
        {
            'prop-types': {
                root: 'PropTypes',
                commonjs2: 'prop-types',
                commonjs: 'prop-types',
                amd: 'prop-types'
            }
        }
    ],
    plugins: plugins
};

const path = require('path');

const PATHS = {
  source: path.resolve(__dirname, 'src'),
  build: path.resolve(__dirname, 'build')
};

const commonConfig = {
  entry: path.resolve(PATHS.source, 'index.ts'),
  output: {
    library: 'SvgEditor',
    libraryTarget: 'umd',
    path: PATHS.build,
    filename: 'SvgEditor.js'
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  module: {
    rules: [
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'awesome-typescript-loader'
        },
      }
    ]
  }
};

const devConfig = {
  mode: 'development',
  devtool: 'eval',
  devServer: {
    contentBase: PATHS.build,
    hot: true,
    port: 9000,
    openPage: 'example.html'
  }
};

const testConfig = {
  devServer: {
    contentBase: PATHS.build,
    hot: true,
    port: 9001,
    openPage: 'tests.html'
  }
};

const prodConfig = {
  mode: 'production'
};

module.exports = env => {
  switch (env) {
    case 'production':
      return { ...commonConfig, ...prodConfig };
    case 'development':
      return { ...commonConfig, ...devConfig };
    case 'test':
      return { ...commonConfig, ...devConfig, ...testConfig };
  }
};

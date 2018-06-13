module.exports = {
  entry: './index.js',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['env', 'react', 'stage-2']
        },
        test: /\.js$/
      },
      {
        exclude: /node_modules/,
        loader: 'eslint-loader',
        test: /\.js$/
      }
    ]
  },
  output: {
    filename: 'bundle.js',
    path: __dirname
  }
}

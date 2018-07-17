const path = require('path')

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'max-exchange-api-node.js',
    globalObject: 'this',
    library: 'MAX',
    libraryTarget: 'commonjs2',
    libraryExport: 'default'
  },
  target: 'node'
}

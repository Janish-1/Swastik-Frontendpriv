// craco.config.js
const webpack = require('webpack');

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer"),
      new webpack.EnvironmentPlugin({
        // Add other environment variables here
      })],
    },
  },
};

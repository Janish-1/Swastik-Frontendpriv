// craco.config.js
const webpack = require('webpack');

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer"),
      new webpack.EnvironmentPlugin({
        REACT_APP_API_URL: 'http://localhost:3001', // Set your default API URL here
        // Add other environment variables here
      })],
    },
  },
};

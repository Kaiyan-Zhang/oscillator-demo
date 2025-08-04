import HtmlWebpackPlugin from "html-webpack-plugin";

const config = {
  entry: "./src/index.jsx",
  plugins: [new HtmlWebpackPlugin()],
  devServer: {},
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
};

export default config;

import HtmlWebpackPlugin from "html-webpack-plugin";

const config = {
  entry: "./src/index.tsx", // 修改为.tsx
  plugins: [new HtmlWebpackPlugin()],
  devServer: {},
  module: {
    rules: [
      {
        test: /\.(jsx|tsx)$/, // 添加.tsx
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"], // 添加.ts和.tsx
  },
};

export default config;

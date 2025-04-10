import path from 'path';
// import fs from 'fs';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import nodeExternals from 'webpack-node-externals';

const __dirname = path.resolve();

//dynamically create entry points for all pages in the src/pages directory
// const pagesDir = path.resolve(__dirname, 'src/pages');
// const entryPoints = fs.readdirSync(pagesDir)
//   .filter((file) => file.endsWith('.jsx')) 
//   .reduce((entries, file) => {
//     const name = path.basename(file, '.jsx'); 
//     entries[name] = path.resolve(pagesDir, file); 
//     return entries;
//   }, {});

const entryPoint = './src/pages/Home.jsx';
const clientConfig = {
  mode: 'production',
  target: 'web', // Target the browser
  entry: entryPoint,
  // entry: {
    // home: './src/pages/Home.jsx', // Entry point for Home page
    // test: './src/pages/Test.jsx', // Entry point for Test page
    // login: './src/pages/Login.jsx', // Entry point for Test page
    // register: './src/pages/Register.jsx', // Entry point for Test page
    // contact: './src/pages/Contact.jsx', // Entry point for Test page
    // other: './src/pages/OtherPage.jsx', // Add other pages here
  // },
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    filename: '[name].[contenthash].js', // Separate bundle for each entry
    chunkFilename: '[name].[contenthash].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //   template: './index.html',
    //   inject: true,
    //   chunks: ['home'], // Include only the Home page bundle
    //   filename: 'home.html', // Output file for Home page
    // }),
    // new HtmlWebpackPlugin({
    //   template: './index.html',
    //   inject: true,
    //   chunks: ['test'], // Include only the Test page bundle
    //   filename: 'test.html', // Output file for Test page
    // }),
    // new HtmlWebpackPlugin({
    //   template: './index.html',
    //   inject: true,
    //   chunks: ['login'], // Include only the Other page bundle
    //   filename: 'login.html', // Output file for Other page
    // }),
    // new HtmlWebpackPlugin({
    //   template: './index.html',
    //   inject: true,
    //   chunks: ['register'], // Include only the Other page bundle
    //   filename: 'register.html', // Output file for Other page
    // }),
    // new HtmlWebpackPlugin({
    //   template: './index.html',
    //   inject: true,
    //   chunks: ['contact'], // Include only the Other page bundle
    //   filename: 'contact.html', // Output file for Other page
    // }),
    // ...Object.keys(entryPoints).map(
    //   (name) =>
    //     new HtmlWebpackPlugin({
    //       template: './index.html',
    //       inject: true,
    //       chunks: [name], // Include only the specific page bundle
    //       filename: `${name}.html`, // Output file for the page
    //     })
    // ),
  // ],
  new HtmlWebpackPlugin({
    template: './index.html',
    inject: true,
    filename: 'index.html', // Output file for the main page
  }),
],
optimization: {
  splitChunks: {
    chunks: 'all', // Automatically split chunks for shared dependencies
  },
},
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

const serverConfig = {
  mode: 'production',
  target: 'node', // Target Node.js
  entry: './server.js', // Server entry point
  output: {
    path: path.resolve(__dirname, 'dist/server'),
    filename: 'server.cjs',
    libraryTarget: 'commonjs2',
  },
  externals: [nodeExternals()], // Exclude node_modules from the server bundle
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.(scss|css)$/,
        use: ['ignore-loader'], // Ignore CSS files in the server build
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

export default [clientConfig, serverConfig];
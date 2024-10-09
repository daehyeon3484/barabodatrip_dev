const target = 'http://localhost:3001';
const path = require('path');
const { defineConfig } = require("@vue/cli-service");
const TerserPlugin = require("terser-webpack-plugin");
console.log("env : ", process.env.NODE_ENV);
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = defineConfig({
  productionSourceMap: process.env.NODE_ENV == 'production' ? false : true,
  configureWebpack:(config) => {
    config.output.filename = "js/[name].[hash].js";
    config.output.chunkFilename = "js/[name].[hash].js";
    config.optimization.minimizer = config.optimization.minimizer || [];
    mode =  'production';
    resolve = {
        alias: {
            '@': path.join(__dirname, 'src/'),
            moment: 'moment/src/moment',
        }
    };
    if (process.env.NODE_ENV === "production") { // 빌드를 하면 production으로 됩니다
      // 기존의 minimizer 설정이 있다면 그대로 사용하고, 없다면 빈 배열을 할당
      config.optimization.minimizer = config.optimization.minimizer || [];

      // TerserPlugin을 추가
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // 콘솔 로그를 제거합니다.
            },
            output: {
              comments: false, // 빌드 파일에서 주석을 제거합니다.
            },
          },
          extractComments: false,
        }),
      );
    }
    // plugins: [new BundleAnalyzerPlugin()],
    // devtool: process.env.NODE_ENV == 'production' ? 'eval' : 'source-map'
    // https://v.douyin.com/iNTCws1j/
  },
  chainWebpack: (config) => {
    config.plugins.delete("prefetch");
  },
  filenameHashing: true,
  devServer: {
    port: 8082,
    proxy: {
      '^/api': {
        target,
        changeOrigin: true
      },
      '^/upload': {
        target,
        changeOrigin: true,
      },
      '^/download': {
        target,
        changeOrigin: true,
      },
      '^/deleteFile': {
        target,
        changeOrigin: true,
      },
      '^/update': {
        target,
        changeOrigin: true,
      },
      '^/paymentCallBack': {
        target,
        changeOrigin: true,
      },
      '^/payment': {
        // target : "http://127.0.0.1:8082",
        target,
        changeOrigin: true,
      },
      '^/orderResult': {
        // target : "http://1.234.28.58",
        target,
        changeOrigin: true,
      },
      '^/auth': {
        // target : "http://1.234.28.58",
        target,
        changeOrigin: true,
      },
      '^/smtp': {
        // target : "http://1.234.28.58",
        target,
        changeOrigin: true,
      },
      '^/wechatpayment': {
        // target : "http://1.234.28.58",
        target,
        changeOrigin: true,
      },
      '^/monitorHistory': {
        // target : "http://1.234.28.58",
        target,
        changeOrigin: true,
      },
      '^/faceCallBack': {
        // target : "http://1.234.28.58",
        target,
        changeOrigin: true,
      },
      '^/join': {
        // target : "http://1.234.28.58",
        target,
        changeOrigin: true,
      },
      '^/loginCallback': {
        // target : "http://1.234.28.58",
        target,
        changeOrigin: true,
      },
      '^/memChk': {
        // target : "http://1.234.28.58",
        target,
        changeOrigin: true,
      },
      '^/findChk': {
        // target : "http://1.234.28.58",
        target,
        changeOrigin: true,
      },
      '^/snsFacebook': {
        // target : "http://1.234.28.58",
        target,
        changeOrigin: true,
      },
      '^/oauth': {
        // target : "http://1.234.28.58",
        target,
        changeOrigin: true,
      },
    }
  },
  pluginOptions: {
    i18n: {
      locale: 'ko',
      fallbackLocale: 'ko',
      localeDir: 'locales',
      enableLegacy: true,
      runtimeOnly: false,
      compositionOnly: true,
      fullInstall: true
    },
    // dotenv : new Dotenv({
      // path: '../../path/to/other.env',
      // safe: true, // load '../../path/to/other.env.example'
      // defaults: true, // loa
    // })
    
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#1DA57A',
            'link-color': '#1DA57A',
            'border-radius-base': '2px',
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  
})

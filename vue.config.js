/**
 * Created by OXOYO on 2019/4/4.
 *
 * cli 配置文件
 *
 * 文档：https://cli.vuejs.org/zh/config/
 */

module.exports = {
  // 部署应用包时的基本URL，置空使用相对路径
  publicPath: '',
  // 打包输出目录
  outputDir: 'dist',
  // 静态资源目录
  assetsDir: '',
  // 开发环境
  // devServer: {
  //   // 代理设置
  //   proxy: {
  //     '/api': {
  //       target: '<url>',
  //       changeOrigin: true
  //     }
  //   }
  // }
  css: {
    loaderOptions: {
      less: {
        // 解决https://github.com/ant-design/ant-motion/issues/44问题
        // 相关问题：https://github.com/ant-design/ant-design/issues/7927#issuecomment-372513256
        javascriptEnabled: true
      }
    }
  }
}

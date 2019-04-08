/**
 * Created by OXOYO on 2019/4/8.
 *
 * 路由相关工具
 */

export default {
  addRoutes (_t) {
    // 防止重复配置相同路由
    if (_t.$router.options.routes.length <= 1) {
      _t.$router.addRoutes([childRouter])
      // $router不是响应式的，所以手动将路由元注入路由对象
      _t.$router.options.routes.push(childRouter)
    }
  }
}

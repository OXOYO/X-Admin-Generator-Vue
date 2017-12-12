# x-admin-generator-vue

> 基于Vue的后台管理平台脚手架

## 特色：敏捷、轻量、JS

## 技术栈：
  前端： vue + vuex + vue-router + iview + axios
  API：koa + koa-router + jsonwebtoken + mysql + sequelize

## 前端 [Admin-Generator-Vue]()

### Start
``` bash
  # git clone

  # install dependencies
  npm install

  # serve with hot reload at localhost:8080
  npm run dev

  # build for production with minification
  npm run build
```
### 目录结构

```bash
  src
    \_ apps                         // 应用/模块 目录
        \_ demoModule001            // demoModule001 模块001
            \_ store                // 模块001 store 目录
                \_ actions.js       // 模块001 actions
                \_ index.js         // 模块001 store，主要用来定义store namespace
                \_ mutations.js     // 模块001 mutations
                \_ state.js         // 模块001 state

            \_ components           // 模块001 基础组件 目录
            \_ containers           // 模块001 容器组件 目录
            \_ pages                // 模块001 页面组件 目录
            \_ routers.js           // 模块001 路由
            \_ api.js               // 模块001 api

    \_ assets                       // 静态资源 目录
    \_ global                       // 全局公用文件 目录
        \_ components               // 全局公用组件
        \_ lib                      // 全局公用核心库
        \_ utils                    // 全局工具库
            \_ index.js             // utils index
            \_ bus.js               // bus events
            \_ filters.js           // filters
            \_ store.js             // store

    \_ platform                     // 基础平台 目录
      \_ appsStore                  // 应用/模块 根store 目录
          \_ actions.js             // 应用/模块 基础actions，一般为空
          \_ index.js               // 应用/模块 根store，主要用来定义store namespace
          \_ mutations.js           // 应用/模块 基础mutations，一般为空
          \_ state.js               // 应用/模块 基础state，一般为空

      \_ platformStore              // 平台 根store 目录
          \_ actions.js             // 平台 基础actions
          \_ index.js               // 平台 根store，主要用来定义store namespace
          \_ mutations.js           // 平台 基础mutations
          \_ state.js               // 平台 基础state

      \_ components                 // 平台 基础组件 目录
      \_ containers                 // 平台 容器组件 目录
      \_ pages                      // 平台 页面组件 目录
      \_ routers.js                 // 平台 根路由
      \_ api.js                     // 平台 根api

    \_ APP.vue                      // 系统 根组件
    \_ config.js                    // 系统 配置信息
    \_ main.js                      // 系统 入口js
```
### 开发注意事项
1.配置菜单数据: 在 `./src/platform/platformStore/state.js` 文件中，在 `menus.list` 字段下添加子菜单、模块配置信息，如：

```bash
  {
    id: 300,
    index: 300,
    // 路由 name 属性
    name: 'platform.admin.DemoModule001',
    // 字体图标
    icon: 'arrow-graph-up-right',
    title: 'DemoModule001',
    // 是否启用
    enable: true,
    // 是否在侧边栏显示
    sidebar: false,
    // 允许访问的用户类别 0 管理员 1 普通用户
    userType: [0, 1]
  }
```
2.新建应用/模块: 在`./src/apps/`目录下新建应用/模块目录及文件，如：

```bash
  demoModule001            // demoModule001 模块001
   \_ store                // 模块001 store 目录
       \_ actions.js       // 模块001 actions
       \_ index.js         // 模块001 store，主要用来定义store namespace
       \_ mutations.js     // 模块001 mutations
       \_ state.js         // 模块001 state


   \_ components           // 模块001 基础组件 目录
   \_ containers           // 模块001 容器组件 目录
   \_ pages                // 模块001 页面组件 目录
       \_ Index.vue        // 模块001 页面根组件，主要用来将store注册到apps下
   \_ routers.js           // 模块001 路由
   \_ api.js               // 模块001 api
```
3.新模块开发可以参考 `Users` 模块

## API [Admin-API-Generator-Koa]()

### Start

```bash
  # git clone

  # install dependencies
  npm install

  # serve with hot reload at localhost:3000
  npm run dev
```
   Node.js 版本需 >= 7.6.0.

### 开发步骤
1.编辑 config.js

2.使用 [sequelize-auto](https://github.com/sequelize/sequelize-auto) 将数据库导出为 schema 模型

```bash
  sequelize-auto -o "./src/schema" -d databaseName -h localhost -u root -p 3306 -e mysql
```

3.创建模块目录、文件

```bash
  apps
    \_ newModules
        Ctrl.js
        Model.js
        Routers.js
```

### 开发注意事项
1.新模块开发细节可以参考 `Users` 模块

### 打包

```bash
  npm run build
```

### 生产环境

```bash
  pm2 start ecosystem.config.js
```

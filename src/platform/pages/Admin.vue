/**
* Created by OXOYO on 2017/12/6.
*
* 后台首页
*/

<style lang="less" rel="stylesheet/less">
  .layout-admin {
    width: 100%;
    height: 100%;
    position: absolute;
    background: #f5f7f9;

    .layout-row {
      height: 100%;
    }
    .layout-ceiling-main a {
      color: #9ba7b5;
    }
    .layout-hide-text {
      .ivu-menu-item {
        text-align: center !important;
      }
      .layout-text {
        display: none !important;
      }
      .layout-icon {
        margin: 0 auto !important;
      }
    }
    .layout-sidebar {
      background: #464c5b;
      height: 100%;
    }
    .layout-main {
      height: 100%;
      overflow-y: auto;
    }
  }
</style>

<template>
  <div class="layout-admin">
    <Row type="flex" class="layout-row">
      <!-- 侧边栏 -->
      <Col id="sidebar" v-show="isShowSidebar" :span="spanLeft" class="layout-sidebar">
        <SidebarForAdmin :class="{'layout-hide-text': spanLeft < 3}"></SidebarForAdmin>
      </Col>
      <!-- 主内容区域 -->
      <Col :span="spanRight" class="layout-main">
        <MainForAdmin></MainForAdmin>
      </Col>
    </Row>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import SidebarForAdmin from '../containers/SidebarForAdmin.vue'
  import MainForAdmin from '../containers/MainForAdmin.vue'
  import utils from '@/global/utils'
  const moduleName = utils.store.getModuleName('Platform')

  export default {
    name: 'Admin',
    components: {
      SidebarForAdmin,
      MainForAdmin
    },
    data () {
      return {
        isShowSidebar: false
      }
    },
    computed: {
      ...mapState(moduleName, {
        spanLeft: function (state) {
          let _t = this
          let spanLeft = state.layout.spanSize.left
          if (spanLeft === 0) {
            _t.isShowSidebar = false
            spanLeft = 3
          } else {
            _t.isShowSidebar = true
          }
          return spanLeft
        },
        spanRight: state => state.layout.spanSize.right,
        menuList: state => state.layout.menus.list
      })
    },
    methods: {
      getUserInfo: async function () {
        let _t = this
        // 分发action，获取当前登录用户基本信息
        let res = await _t.$store.dispatch(_t.$utils.store.getType('user/BaseInfo', 'Platform'))
        if (!res || res.status !== 200) {
          return
        }
        // 处理返回数据
        if (res.data) {
          _t.$Message.success(res.msg || '获取用户基本信息成功！')
          let userInfo = res.data
          // 分发mutations，更新用户基本信息
          _t.$store.commit(_t.$utils.store.getType('userInfo/update', 'Platform'), userInfo)
        } else {
          _t.$Message.info('暂无数据！')
        }
      },
      // 更新当前激活菜单
      updateActiveMenu: function (to) {
        let _t = this
        let toName = to.name
        let menuList = _t.menuList
        let activeMenuName = ''
        for (let key in menuList) {
          let item = menuList[key]
          if (item.enable && item.sidebar && toName.includes(item.name)) {
            activeMenuName = item.name
            break
          }
        }
        _t.$store.commit(_t.$utils.store.getType('layout/menus/activeName/update', 'Platform'), activeMenuName)
      },
      // 跳转后台首页
      goToIndex: function (to) {
        let _t = this
        if ((_t.$route && _t.$route.name === 'platform.admin') || (to && to.name === 'platform.admin')) {
          _t.$router.replace({name: 'platform.admin.Index'})
        }
      }
    },
    mounted: function () {
      let _t = this
      _t.updateActiveMenu(_t.$route)
      _t.getUserInfo()
    },
    // 路由守卫
    beforeRouteUpdate (to, from, next) {
      let _t = this
      _t.updateActiveMenu(to)
      next()
    }
  }
</script>


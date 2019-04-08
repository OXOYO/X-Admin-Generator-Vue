/**
* Created by OXOYO on 2019/4/8.
*
* AdminLayout
*/

<style scoped lang="less" rel="stylesheet/less">
  .layout-admin{
    background: #f5f7f9;
    overflow: hidden;
  }
  .ivu-layout-has-sider {
    height: 100%;
  }
  .admin-sidebar {
    height: 100%;
  }
  .admin-logo {
    width: 100%;
    background: #5b6270;
    color: #fff;
    text-align: center;
    overflow: hidden;
    margin: 0;
    height: 64px;
    line-height: 64px;
    font-size: 20px;
    overflow: hidden;

    a {
      color: #fff;
      height: 30px;
      line-height: 30px;
    }
  }
  .admin-header{
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
    .menu-right {
      float: right;
    }
  }
  .menu-icon{
    transition: all .3s;
  }
  .rotate-icon{
    transform: rotate(-90deg);
  }
  .menu-item span{
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }
  .menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }
  .collapsed-menu span{
    width: 0px;
    transition: width .2s ease;
  }
  .collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }
</style>
<template>
  <div class="layout layout-admin">
    <Layout>
      <Sider class="admin-sidebar" ref="Sider" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
        <div class="admin-logo">
          <router-link :to="{ name: 'platform.admin'}">
            <template v-if="isCollapsed">
              <span>{{ $X.config.system.minTitle }}</span>
            </template>
            <template v-else>
              <span style="font-weight: bold;">{{ $X.config.system.subtitle }}</span>
            </template>
          </router-link>
        </div>
        <Menu active-name="activeSidebar" theme="dark" width="auto" :class="['menu-item', isCollapsed ? 'collapsed-menu' : '']">
          <template v-if="resourceMap['admin-sidebar']">
            <MenuItem
              v-for="(item, index) in resourceMap['admin-sidebar']"
              :key="index"
              :name="item.name"
            >
              <Icon v-if="item.icon" :type="item.icon"></Icon>
              <span>{{ item.title }}</span>
            </MenuItem>
          </template>
        </Menu>
      </Sider>
      <Layout>
        <Header class="admin-header" style="padding: 0;">
          <Icon @click.native="toggleCollapse" :class="['menu-icon', isCollapsed ? 'rotate-icon' : '']" style="margin: 0 20px;" type="md-menu" size="24"></Icon>
          <div class="menu-right">
            <SwitchLang></SwitchLang>
            <SwitchBackground></SwitchBackground>
            <SwitchUserGroup></SwitchUserGroup>
          </div>
        </Header>
        <Content class="admin-content" :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
          <router-view>
            <h1>TODO CONTENT</h1>
          </router-view>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<script>
import AdminSidebar from '../containers/AdminSidebar'
import SwitchLang from '../components/SwitchLang'
import SwitchBackground from '../components/SwitchBackground'
import SwitchUserGroup from '../components/SwitchUserGroup'

export default {
  components: {
    AdminSidebar,
    SwitchLang,
    SwitchBackground,
    SwitchUserGroup
  },
  data () {
    return {
      isCollapsed: false,
      resourceMap: {},
      activeSidebar: ''
    }
  },
  computed: {
    cookieKey () {
      return this.$X.config.cookie.getItem('admin_sidebar_isCollapsed')
    }
  },
  methods: {
    init () {
      let _t = this
      _t.getCollapsed()
      _t.getBaseInfo()
    },
    getCollapsed () {
      let _t = this
      _t.isCollapsed = !!_t.$X.Cookies.get(_t.cookieKey)
    },
    setCollapsed () {
      let _t = this
      _t.$X.Cookies.set(_t.cookieKey, !_t.isCollapsed, {
        expires: 7,
        path: _t.$X.config.cookie.path
      })
    },
    toggleCollapse () {
      let _t = this
      _t.$refs.Sider.toggleCollapse()
      // 更新cookie
      _t.setCollapsed()
    },
    // TODO 获取用户信息
    async getBaseInfo () {
      let _t = this
      // 分发action，获取当前登录用户基本信息
      let res = await _t.$store.dispatch('platform/user/BaseInfo')
      if (!res || res.code !== 200) {
        return
      }
      // 处理返回数据
      if (res.data) {
        _t.$Message.success(_t.$t('L00010'))
        let userInfo = res.data
        let userGroupKey = _t.$X.config.cookie.getItem('userGroup')
        // 设置当前选中角色
        if (!_t.userInfo || !_t.userInfo.currentUserGroup) {
          let userGroupId = _t.$X.Cookies.get(userGroupKey)
          let userGroup
          if (userGroupId) {
            userGroupId = parseInt(userGroupId)
            userGroup = userInfo.user_groups.find(item => item.id === userGroupId)
          } else {
            userGroup = userInfo.user_groups[0]
          }
          userInfo['currentUserGroup'] = userGroup
        }
        if (userInfo.currentUserGroup) {
          // 设置用户组
          _t.$X.Cookies.set(userGroupKey, userInfo.currentUserGroup.id, {path: _t.$X.config.cookie.path})
        } else {
          // 清除用户组，防止切换用户登录时除异常BUG。
          _t.$X.Cookies.remove(userGroupKey, {path: _t.$X.config.cookie.path})
        }
        // 分发mutations，更新用户基本信息
        _t.$store.commit('platform/userInfo/update', userInfo)
        // 获取当前用户组所对应的资源的列表
        _t.getResourceList(userInfo.currentUserGroup.resource_id)
      } else {
        _t.$Message.info(_t.$t('L00011'))
      }
    },
    // TODO 获取资源列表
    async getResourceList (ids) {
      let _t = this
      let resourceList = []
      // 分发action，调接口
      let res = await _t.$store.dispatch('platform/resource/list/all', {
        ids: ids,
        enable: [1],
        type: ['module-system', 'module-app', 'module-link']
      })
      if (!res || res.code !== 200) {
        return
      }
      // 处理返回数据
      if (res.data.count && res.data.list && res.data.list.length) {
        resourceList = res.data.list || []
      }
      // 处理资源
      if (resourceList.length) {
        // FIXME 挂载位置：home 前台隐式 home-nav 前台导航 admin 后台隐式 admin-nav 后台导航 admin-sidebar 后台侧边栏
        let resourceMap = {}
        let sidebarList = []
        let navList = []
        for (let i = 0, len = resourceList.length; i < len; i++) {
          let item = resourceList[i]
          if (!resourceMap.hasOwnProperty(item.position)) {
            resourceMap[item.position] = []
          }
          resourceMap[item.position].push(item)
        }
        _t.resourceMap = resourceMap
      } else {
        _t.resourceMap = {}
      }
      // 处理路由
    }
  },
  created () {
    let _t = this
    _t.init()
  }
}
</script>

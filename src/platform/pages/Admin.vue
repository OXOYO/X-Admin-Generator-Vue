/**
* Created by OXOYO on 2019/4/8.
*
* Admin
*/

<style lang="less" rel="stylesheet/less">
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
    /*background: #5b6270;*/
    background: rgba(0, 0, 0, .5);
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
  .admin-content {
    margin: 20px;
    background: #fff;
    minHeight: 260px;
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

  .sidebar-menu-wrapper {
    height: calc(~"100% - 64px");

    .sidebar-menu {
      height: 100%;
      background: rgba(0, 0, 0, .2);

      &.ivu-menu,
      .ivu-menu {
        color: #fff !important;
      }
    }
    .sidebar-menu-collapsed {
      height: 100%;
      background: rgba(0, 0, 0, .2);

      .ivu-dropdown {
        width: 100%;

        .ivu-dropdown-rel a {
          width: 100%;
        }
      }
      .ivu-tooltip {
        width: 100%;

        .ivu-tooltip-rel {
          width: 100%;

          .drop-menu-a {
            padding: 14px 24px;
            position: relative;
            cursor: pointer;
          }
        }
        .ivu-tooltip-popper .ivu-tooltip-content {
          .ivu-tooltip-arrow {
            border-right-color: #fff;
          }
          .ivu-tooltip-inner {
            background: #fff;
            color: #495060;
          }
        }
      }

      .layout-icon {
        color: #ffffffb3;
      }
    }

    .drop-menu-a{
      display: inline-block;
      padding: 6px 15px;
      width: 100%;
      text-align: center;
      color: #495060;

      &.active {
        .layout-icon {
          color: #2d8cf0;
        }
      }
    }
  }
  .ivu-icon {
    vertical-align: middle;
  }
  .layout-icon {
    width: 16px;
    height: 16px;
    margin: 0 5px;
    vertical-align: middle !important;
  }
  .layout-text {
    vertical-align: middle !important;
    overflow: hidden;
  }
</style>

<template>
  <div class="layout layout-admin">
    <Layout>
      <Sider
        class="admin-sidebar"
        ref="Sider"
        v-model="isCollapsed"
        hide-trigger
        collapsible
        :collapsed-width="78"
        :style="layoutStyle"
      >
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
        <div class="sidebar-menu-wrapper">
          <Menu
            ref="sidebarMenu"
            v-if="!isCollapsed"
            class="sidebar-menu"
            :active-name="activeMenuName"
            :open-names="openNames"
            theme="light"
            width="auto"
            accordion
            @on-select="triggerMenu"
          >
            <Scrollbar v-if="resourceTree.children && resourceTree.children.length">
              <component
                v-for="item in resourceTree.children"
                :class="item.children && item.children.length ? 'sub-menu-item' : 'menu-item'"
                :is="item.children && item.children.length ? 'Submenu' : 'MenuItem'"
                :key="item.name"
                :name="item.name"
              >
                <!-- 有子节点 -->
                <template
                  v-if="item.children && item.children.length"
                >
                  <template slot="title">
                    <Icon class="layout-icon" :type="item.icon" :size="16"></Icon>
                    <span class="layout-text">{{ item.lang ? $t(item.lang) : item.title }}</span>
                  </template>
                  <MenuItem
                    class="menu-item"
                    v-for="childItem in item.children"
                    :key="childItem.name"
                    :name="childItem.name"
                  >
                    <Icon class="layout-icon" :type="childItem.icon" :size="16"></Icon>
                    <span class="layout-text">{{ childItem.lang ? $t(childItem.lang) : childItem.title }}</span>
                  </MenuItem>
                </template>
                <!-- 无子节点 -->
                <template
                  v-else
                >
                  <Icon class="layout-icon" :type="item.icon" :size="16"></Icon>
                  <span class="layout-text">{{ item.lang ? $t(item.lang) : item.title }}</span>
                </template>
              </component>
            </Scrollbar>
          </Menu>
          <div v-if="isCollapsed" class="sidebar-menu-collapsed">
          <Scrollbar v-if="resourceTree.children && resourceTree.children.length">
            <template v-for="(item, index) in resourceTree.children">
              <Dropdown
                v-if="item.children && item.children.length"
                @on-click="triggerMenu"
                class="collased-menu-dropdown"
                transfer
                :key="index"
                :placement="item.placement ? item.placement : 'right-end'"
              >
                <a
                  :class="{'drop-menu-a': true, 'active': openNames.find(target => target === item.name)}"
                  type="text"
                  @mouseover="handleMousemove($event, item.children, item)"
                >
                  <Icon class="layout-icon" :type="item.icon" :size="16"></Icon>
                </a>
                <DropdownMenu slot="list">
                  <template
                    v-for="childItem in item.children"
                  >
                    <DropdownItem
                      :key="`drop-${childItem.name}`"
                      :name="childItem.name"
                      :selected="activeMenuName === childItem.name"
                    >
                      <Icon class="layout-icon" :type="childItem.icon" :size="16"></Icon>
                      <span class="layout-text">{{ childItem.lang ? $t(childItem.lang) : childItem.title }}</span>
                    </DropdownItem>
                  </template>
                </DropdownMenu>
              </Dropdown>
              <Tooltip
                v-else
                transfer
                :content="item.lang ? $t(item.lang) : item.title"
                placement="right"
                :key="`drop-menu-${item.name}`"
              >
                <a
                  @click="triggerMenu(item.name)"
                  :class="{'drop-menu-a': true, 'active': activeMenuName === item.name}"
                  :style="{textAlign: 'center'}"
                >
                  <Icon class="layout-icon" :type="item.icon" :size="16"></Icon>
                </a>
              </Tooltip>
            </template>
          </Scrollbar>
        </div>
        </div>
      </Sider>
      <Layout>
        <Header class="admin-header" style="padding: 0;">
          <Icon @click.native="toggleCollapse" :class="['menu-icon', isCollapsed ? 'rotate-icon' : '']" style="margin: 0 20px;" type="md-menu" size="24"></Icon>
          <BreadcrumbForAdmin></BreadcrumbForAdmin>
          <div class="menu-right">
            <SwitchLang></SwitchLang>
            <SwitchBackground></SwitchBackground>
            <SwitchUserGroup></SwitchUserGroup>
          </div>
        </Header>
        <Content class="admin-content">
          <router-view>
            <h1>TODO CONTENT</h1>
          </router-view>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import SwitchLang from '../components/SwitchLang'
  import SwitchBackground from '../components/SwitchBackground'
  import SwitchUserGroup from '../components/SwitchUserGroup'
  import BreadcrumbForAdmin from '../components/BreadcrumbForAdmin'

  export default {
    name: 'Admin',
    components: {
      SwitchLang,
      SwitchBackground,
      SwitchUserGroup,
      BreadcrumbForAdmin
    },
    data () {
      return {
        isCollapsed: false
      }
    },
    computed: {
      ...mapState('Platform', {
        userInfo: state => state.userInfo,
        background: state => state.background,
        resourceMap: state => state.admin.resourceMap,
        activeMenuName: state => state.admin.activeMenuName,
        unless: state => state.unless
      }),
      cookieKey () {
        return this.$X.config.cookie.getItem('admin_sidebar_isCollapsed')
      },
      resourceTree () {
        let _t = this
        let arr
        // 按权限处理菜单显示
        if (_t.userInfo && _t.userInfo.name) {
          arr = _t.resourceMap['admin-sidebar']
          if (_t.userInfo.type !== 0 && _t.userInfo.currentUserGroup) {
            let userResourceList = _t.userInfo.currentUserGroup.resource_id.split(',')
            arr = arr.filter(item => userResourceList.includes(item.id + ''))
          }
        } else {
          arr = []
        }
        let tree = []
        let handler = function (arr, parent) {
          for (let i = 0, len = arr.length; i < len; i++) {
            let item = arr[i]
            if (item.parent_id === parent.id) {
              let targetIndex = parent.children.findIndex(target => target.name === item.name)
              let targetItem
              if (targetIndex > -1) {
                targetItem = parent.children[targetIndex]
              } else {
                targetIndex = parent.children.length
                targetItem = {
                  ...item,
                  children: []
                }
                parent.children.push(targetItem)
              }
              // 查找子节点
              parent.children[targetIndex] = handler(arr, targetItem)
            }
          }
          return parent
        }
        tree = handler(arr, {
          id: 0,
          children: []
        })
        return tree
      },
      openNames: function () {
        let _t = this
        let menuArr = _t.resourceTree.children || []
        let tmpArr = []
        let handler = function (arr, parentName) {
          for (let i = 0, len = arr.length; i < len; i++) {
            let item = arr[i]
            if (_t.activeMenuName === item.name) {
              tmpArr.push(parentName)
            } else {
              if (item.children && item.children.length) {
                handler(item.children, item.name)
              }
            }
          }
        }
        if (_t.activeMenuName) {
          handler(menuArr, '')
        }
        if (tmpArr.length) {
          // 手动更新打开的菜单
          _t.$nextTick(() => {
            _t.$refs.sidebarMenu && _t.$refs.sidebarMenu.updateOpened && _t.$refs.sidebarMenu.updateOpened()
          })
        }
        return tmpArr
      },
      layoutStyle () {
        let _t = this
        let style = {
          'background-color': '#54364a'
        }
        if (_t.background.name && _t.background.source) {
          style = {
            'background-size': 'cover',
            'background-image': `url(${_t.background.source})`
          }
        }
        return style
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
        _t.isCollapsed = _t.$X.Cookies.get(_t.cookieKey) === 'true'
      },
      setCollapsed () {
        let _t = this
        _t.$X.Cookies.set(_t.cookieKey, _t.isCollapsed, {
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
      // 获取用户信息
      async getBaseInfo () {
        let _t = this
        // 分发action，获取当前登录用户基本信息
        let res = await _t.$store.dispatch('Platform/user/BaseInfo')
        if (!res || res.code !== 200) {
          return
        }
        // 处理返回数据
        if (res.data) {
          _t.$Message.success(res.msg)
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
            _t.$X.Cookies.set(userGroupKey, userInfo.currentUserGroup.id, { path: _t.$X.config.cookie.path })
          } else {
            // 清除用户组，防止切换用户登录时除异常BUG。
            _t.$X.Cookies.remove(userGroupKey, { path: _t.$X.config.cookie.path })
          }
          // 分发mutations，更新用户基本信息
          _t.$store.commit('Platform/userInfo/update', userInfo)
        } else {
          _t.$Message.info(_t.$t('L00011'))
        }
      },
      triggerMenu (name) {
        let _t = this
        let target = _t.resourceMap['admin-sidebar'].find(item => item.name === name)
        if (target) {
          if (['module-system', 'module-app'].includes(target.type)) {
            _t.$router.push({ name: target.name })
          } else if (['module-link'].includes(target.type)) {
            if (target.target) {
              window.open(target.url, target.title)
            } else {
              // 点击菜单跳转路由
              _t.$router.push({
                name: 'platform.admin.FramePage',
                params: {
                  name: target.name,
                  info: target
                }
              })
            }
          }
        }
      },
      handleMousemove: function (event, children, item) {
        const { pageY } = event
        const height = children.length * 38
        const isOverflow = pageY + height < window.innerHeight
        item.placement = isOverflow ? 'right-start' : 'right-end'
      },
      // 用户鉴权
      async doVerifyAccess (toName) {
        let _t = this
        // FIXME !!! 处理路由排除
        if (_t.unless.verifyAccess.router.includes(toName)) {
          return {
            verifyFlag: true,
            resources: null
          }
        }
        // 分发action，调接口
        let res = await _t.$store.dispatch('Platform/user/access/verify', {
          name: toName
        })
        if (!res || res.code !== 200) {
          return {
            verifyFlag: false,
            resources: []
          }
        }
        let verifyFlag = !!res.data.verifyFlag
        if (!verifyFlag) {
          _t.$Message.error(res.msg)
        }
        return {
          verifyFlag: verifyFlag,
          resources: res.data.resources || []
        }
      },
      // 更新当前激活菜单
      updateActiveMenu: function (to) {
        let _t = this
        let activeMenu = _t.resourceMap['admin-sidebar'].find(target => target.name === to.name)
        _t.$store.commit('Platform/admin/activeMenuName/update', activeMenu ? activeMenu.name : '')
      }
    },
    created () {
      let _t = this
      _t.init()
    },
    mounted () {
      let _t = this
      _t.updateActiveMenu(_t.$route)
    },
    // 路由守卫
    async beforeRouteUpdate (to, from, next) {
      let _t = this
      let verifyRes = await _t.doVerifyAccess(to.name)
      if (verifyRes.verifyFlag) {
        _t.updateActiveMenu(to)
        if (verifyRes.resources !== null) {
          // 分发mutations，更新用户资源信息
          _t.$store.commit('Platform/userInfo/resources/update', verifyRes.resources)
        }
        next()
      } else {
        // 清除存储的信息
        _t.$X.utils.storage.clear.apply(_t)
        _t.$store.commit('Platform/userInfo/reset', {})
        setTimeout(function () {
          // 点击菜单跳转路由
          _t.$router.push({
            name: 'platform.home'
          })
        }, 500)
      }
    }
  }
</script>

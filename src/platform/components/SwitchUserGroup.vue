/**
* Created by OXOYO on 2019/4/8.
*
* SwitchUserGroup
*/

<style scoped lang="less" rel="stylesheet/less">
  .switch-box {
    display: inline-block;

    .switch-item {
      padding: 0 20px;
    }
  }
</style>

<template>
  <div class="switch-box">
    <Dropdown class="switch-item" @on-click="handleGroupChange" v-if="userInfo.user_groups && userInfo.user_groups.length">
      <a href="javascript:void(0)">
        {{ userInfo.currentUserGroup.name }}
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem
          v-for="(item, index) in userInfo.user_groups"
          :key="index"
          :name="index"
          :selected="item.id === userInfo.currentUserGroup.id"
        >
          {{ item.name }}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Dropdown class="switch-item" @on-click="handleAction">
      <a href="javascript:void(0)">
        <Icon v-if="Object.keys(userInfo).length" :type="userClass[userInfo.type]['icon']" :title="userClass[userInfo.type]['title']"></Icon>
        {{ userInfo.name }}
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem name="SignOut">{{ $t('L00012') }}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'SwitchUserGroup',
    computed: {
      ...mapState('platform', {
        userInfo: state => state.userInfo,
        userClass: state => state.userClass
      })
    },
    methods: {
      handleGroupChange (index) {
        // 更新用户选中角色
        let currentUserGroup = _t.userInfo.user_groups[index] || {}
        // 设置用户组
        let userGroupKey = _t.$X.config.cookie.getItem('userGroup')
        _t.$X.Cookies.set(userGroupKey, currentUserGroup.id, {path: _t.$X.config.cookie.path})
        // 分发mutations，更新用户基本信息
        _t.$store.commit(_t.$utils.store.getType('userInfo/update', 'Platform'), {
          ..._t.userInfo,
          currentUserGroup
        })
      },
      handleAction (name) {
        let _t = this
        if (name === 'SignOut') {
          // 清除用户状态
          _t.$Message.success(_t.$t('L00013'))
          // FIXME 清空Session Storeage
          sessionStorage.clear()
          // 清空cookie
          let keysArr = Object.keys(_t.$X.Cookies.get())
          // FIXME 处理待排除的key
          let unless = []
          for (let i = 0, len = _t.$X.config.cookie.unless.length; i < len; i++) {
            let key = _t.$X.config.cookie.unless[i]
            let val = _t.$X.config.cookie.getItem(key)
            unless.push(val)
          }
          for (let i = 0, len = keysArr.length; i < len; i++) {
            let key = keysArr[i]
            // 判断是否需要排除
            if (!unless.includes(key)) {
              _t.$X.Cookies.remove(key, {path: _t.$X.config.cookie.path})
            }
          }
          _t.$store.commit('platform/userInfo/reset', {})
          setTimeout(function () {
            // 点击菜单跳转路由
            _t.$router.push({
              name: 'platform.home'
            })
          }, 500)
        }
      }
    }
  }
</script>

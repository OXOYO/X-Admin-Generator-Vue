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
      ...mapState('Platform', {
        userInfo: state => state.userInfo,
        userClass: state => state.userClass
      })
    },
    methods: {
      handleGroupChange (index) {
        let _t = this
        // 更新用户选中角色
        let currentUserGroup = _t.userInfo.user_groups[index] || {}
        // 设置用户组
        let userGroupKey = _t.$X.config.cookie.getItem('userGroup')
        _t.$X.Cookies.set(userGroupKey, currentUserGroup.id, { path: _t.$X.config.cookie.path })
        // 分发mutations，更新用户基本信息
        _t.$store.commit('Platform/userInfo/update', {
          ..._t.userInfo,
          currentUserGroup
        })
      },
      handleAction (name) {
        let _t = this
        if (name === 'SignOut') {
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
  }
</script>

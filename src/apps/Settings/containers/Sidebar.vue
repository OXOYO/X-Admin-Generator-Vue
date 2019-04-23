/**
* Created by yangfan9244 on 2019/4/23.
*
* Sidebar
*/

<style scoped lang="less" rel="stylesheet/less">
  .sidebar-box {
    min-height: 500px;
    background: rgba(0, 0, 0, .1);

    .menu {
      height: 100%;
    }
  }
</style>

<template>
  <div class="sidebar-box">
    <Menu class="menu" theme="light" :active-name="currentActiveName" @on-select="triggerMenu">
      <MenuItem
        v-for="(item, index) in menuList.filter(item => item.enable)"
        :key="index"
        :name="item.name"
      >
        <Icon v-if="item.icon" :type="item.icon"></Icon>
        <span>{{ item.lang ? $t(item.lang) : item.label}}</span>
      </MenuItem>
    </Menu>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'Sidebar',
    computed: {
      ...mapState('Apps/Settings', {
        menuList: state => state.menuList,
        currentActiveName: state => state.currentActiveName
      })
    },
    methods: {
      triggerMenu (name) {
        let _t = this
        // 分发mutation，更新state
        _t.$store.commit('Apps/Settings/currentActiveName/update', name)
      }
    }
  }
</script>

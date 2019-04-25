/**
* Created by OXOYO on 2019/4/25.
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
    <Menu class="menu" ref="sidebar" theme="light" :active-name="currentActiveName" @on-select="triggerMenu">
      <!-- 通用菜单 -->
      <MenuItem
        v-for="(item, index) in menuList.filter(item => item.enable)"
        :key="'menu_' + index"
        :name="'menu_' + index"
      >
        <Icon v-if="item.icon" :type="item.icon"></Icon>
        <span>{{ item.lang ? $t(item.lang) : item.label}}</span>
      </MenuItem>
      <MenuItem
        v-for="(item, index) in categoryMap.system"
        :key="'category_system_' + index"
        :name="'category_system_' + index"
      >
        <Icon type="md-list" :style="{ color: item.theme }"></Icon>
        <span :style="{ color: item.theme }">{{ item.lang ? $t(item.lang) : item.name}}</span>
      </MenuItem>
      <MenuItem
        v-for="(item, index) in categoryMap.custom"
        :key="'category_custom_' + index"
        :name="'category_custom_' + index"
      >
        <Icon type="md-list"></Icon>
        <span>{{ item.lang ? $t(item.lang) : item.name}}</span>
      </MenuItem>
      <MenuItem name="addCategory">
        <Icon type="md-add"></Icon>
        <span>{{ $t('L00166')}}</span>
      </MenuItem>
    </Menu>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'Sidebar',
    data () {
      return {
        categoryMap: {
          // 系统默认分类
          system: [],
          // 用户自定义分类
          custom: []
        }
      }
    },
    computed: {
      ...mapState('Apps/TODO', {
        menuList: state => state.menuList,
        currentActiveName: state => state.currentActiveName
      })
    },
    methods: {
      async init () {
        let _t = this
        await _t.getCategoryList()
        // 触发菜单
        _t.triggerMenu('category_system_0')
      },
      // 获取分类列表
      async getCategoryList () {
        let _t = this
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/TODO/category/list', {})
        if (!res || res.code !== 200) {
          return
        }
        // 处理返回数据
        if (res.data.count && res.data.list && res.data.list.length) {
          _t.$Message.success(res.msg)
        } else {
          _t.$Message.info(_t.$t('L00011'))
        }
        let resList = res.data.list || []
        let categoryMap = {
          // 系统默认分类
          system: [],
          // 用户自定义分类
          custom: []
        }
        for (let i = 0, len = resList.length; i < len; i++) {
          let item = resList[i]
          // 系统默认分类
          if (item.create_user_id === 0) {
            categoryMap.system.push(item)
          } else {
            categoryMap.custom.push(item)
          }
        }
        _t.categoryMap = categoryMap
        // 分发mutation，更新state
        _t.$store.commit('Apps/TODO/categoryMap/update', categoryMap)
      },
      triggerMenu (name) {
        let _t = this
        let currentMenu = {
          type: '',
          info: {}
        }
        let parent
        if (name.includes('menu')) {
          currentMenu.type = 'menu'
        } else if (name.includes('category')) {
          currentMenu.type = 'category'
          parent = name.split('_')[1]
        }
        let index = name.split('_').pop()
        if (currentMenu.type === 'menu') {
          currentMenu.info = _t.menuList[index]
        } else if (currentMenu.type === 'category') {
          currentMenu.info = _t.categoryMap[parent][index]
        }
        // 分发mutation，更新state
        _t.$store.commit('Apps/TODO/currentActiveName/update', name)
        _t.$store.commit('Apps/TODO/currentMenu/update', currentMenu)
      }
    },
    created () {
      let _t = this
      _t.init()
    }
  }
</script>

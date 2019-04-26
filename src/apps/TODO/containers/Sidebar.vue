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
      <!-- 分类菜单 系统默认 -->
      <MenuItem
        v-for="(item, index) in categoryMap.system"
        :key="'category_system_' + index"
        :name="'category_system_' + index"
      >
        <Icon :style="{ color: item.theme }" type="md-list"></Icon>
        <span :style="{ color: item.theme }">{{ item.lang ? $t(item.lang) : item.name}}</span>
      </MenuItem>
      <!-- 分类菜单 用户自定义 -->
      <MenuItem
        v-for="(item, index) in categoryMap.custom"
        :key="'category_custom_' + index"
        :name="'category_custom_' + index"
      >
        <Icon
          v-show="!(currentCategory.type === 'category' && currentCategory.info && currentCategory.info.id === item.id)"
          :style="{ color: item.theme }" type="md-list"
        ></Icon>
        <span
          v-show="!(currentCategory.type === 'category' && currentCategory.info && currentCategory.info.id === item.id)"
          :style="{ color: item.theme }"
        >
          {{ item.lang ? $t(item.lang) : item.name}}
        </span>
        <Input
          v-show="currentCategory.type === 'category' && currentCategory.info && currentCategory.info.id === item.id"
          :ref="'editCategory_' + item.id"
          class="input-block"
          v-model="editForm.name"
          :placeholder="$t('L00170')"
          size="large"
          :autofocus="true"
          @click.native.stop.prevent
          @on-blur="handleBlur('edit')"
          @on-enter.stop.prevent="doEditCategory"
        >
          <Icon type="md-add" slot="prefix"/>
        </Input>
      </MenuItem>
      <!-- 新增分类 -->
      <MenuItem name="action_addCategory">
        <Icon v-show="!isAddingCategory" type="md-add"></Icon>
        <span v-show="!isAddingCategory">{{ $t('L00166')}}</span>
        <Input
          v-show="isAddingCategory"
          ref="addCategory"
          class="input-block"
          v-model="addForm.name"
          :placeholder="$t('L00170')"
          size="large"
          :autofocus="true"
          @click.native.stop.prevent
          @on-blur="handleBlur('add')"
          @on-enter.stop.prevent="doAddCategory"
        >
          <Icon type="md-add" slot="prefix"/>
        </Input>
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
        },
        addForm: {
          name: ''
        },
        editForm: {
          id: '',
          name: ''
        },
        // 是否正在添加分类
        isAddingCategory: false,
        currentActiveName: '',
        currentCategory: {
          type: '',
          info: {}
        }
      }
    },
    computed: {
      ...mapState('Apps/TODO', {
        menuList: state => state.menuList
      })
    },
    methods: {
      async init () {
        let _t = this
        _t.initAddForm()
        _t.initEditForm()
        _t.initCurrentCategory()
        await _t.getCategoryList()
        // 处理激活菜单
        _t.handleActiveName()
        // 触发菜单激活
        _t.triggerMenu(_t.currentActiveName)
      },
      initAddForm () {
        let _t = this
        _t.addForm = {
          name: ''
        }
      },
      initEditForm (data) {
        let _t = this
        _t.editForm = data || {
          id: '',
          name: ''
        }
      },
      initCurrentCategory () {
        let _t = this
        _t.currentCategory = {
          type: '',
            info: {}
        }
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
      // 处理激活菜单
      handleActiveName () {
        let _t = this
        if (_t.menuList.filter(item => item.enable).length) {
          _t.currentActiveName = 'menu_0'
        } else if (_t.categoryMap.system.length) {
          _t.currentActiveName = 'category_system_0'
        } else if (_t.categoryMap.custom.length) {
          _t.currentActiveName = 'category_custom_0'
        }
      },
      triggerMenu (name) {
        let _t = this
        let currentMenu = {
          type: '',
          info: {}
        }
        if (name.includes('menu') || name.includes('category')) {
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
        } else if (name.includes('action')) {
          let actionName = name.split('_')[1]
          currentMenu = {
            type: 'action',
            info: {
              name: actionName
            }
          }
          if (actionName === 'addCategory') {
            _t.isAddingCategory = true
            _t.$nextTick(function () {
              if (_t.$refs.addCategory && _t.$refs.addCategory.autofocus) {
                _t.$refs.addCategory.focus()
              }
            })
          }
        }
        // 分发mutation，更新state
        _t.$store.commit('Apps/TODO/currentMenu/update', currentMenu)
        // 处理分类激活
        if (currentMenu.type === 'category') {
          _t.$nextTick(function () {
            // 广播事件
            _t.$X.utils.bus.$emit('Apps/TODO/Sidebar/category/trigger', currentMenu)
          })
        }
      },
      async doAddCategory () {
        let _t = this
        if (!_t.addForm.name) {
          return
        }
        let res = await _t.$store.dispatch('Apps/TODO/category/add', _t.addForm)
        if (!res || res.code !== 200) {
          return
        }
        // 处理返回数据
        _t.$Message.success(res.msg)
        // 初始化表单
        _t.initAddForm()
        // 刷新列表
        _t.getCategoryList()
      },
      async doEditCategory () {
        let _t = this
        if (!_t.editForm.name) {
          return
        }
        let res = await _t.$store.dispatch('Apps/TODO/category/edit', _t.editForm)
        if (!res || res.code !== 200) {
          return
        }
        // 处理返回数据
        _t.$Message.success(res.msg)
        // 初始化表单
        _t.initEditForm()
        _t.initCurrentCategory()
        // 刷新列表
        _t.getCategoryList()
      },
      handleBlur (action) {
        let _t = this
        switch (action) {
          case 'add':
            _t.isAddingCategory = false
            _t.initAddForm()
            break
          case 'edit':
            _t.initEditForm()
            _t.initCurrentCategory()
            break
        }
      }
    },
    created () {
      let _t = this
      _t.init()
      _t.$X.utils.bus.$on('Apps/TODO/Sidebar/refresh', function () {
        // 刷新列表
        _t.getCategoryList()
      })
      _t.$X.utils.bus.$on('Apps/TODO/Sidebar/category/edit', function (data) {
        _t.currentCategory = data
        _t.initEditForm(data.info)
        _t.$nextTick(function () {
          let key = 'editCategory_' + data.info.id
          if (_t.$refs[key][0] && _t.$refs[key][0].autofocus) {
            _t.$refs[key][0].focus()
          }
        })
      })
    },
    beforeDestroy: function () {
      let _t = this
      // 销毁监听
      _t.$X.utils.bus.$off('Apps/TODO/Sidebar/refresh')
      _t.$X.utils.bus.$off('Apps/TODO/Sidebar/category/edit')
    }
  }
</script>

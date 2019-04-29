/**
* Created by OXOYO on 2019/4/29.
*
* AdminBlogCategory 应用根组件
*/

<style scoped lang="less" rel="stylesheet/less">
</style>

<template>
  <div class="main-box">
    <XPanel>
      <div slot="header-right" class="panel-header">
        <div class="action-btn" @click.stop="handleAction('add')">
          <Tooltip placement="top" :content="$t('L00122')">
            <Icon class="action-icon" type="md-add"></Icon>
          </Tooltip>
        </div>
        <div class="action-btn" @click.stop="handleAction('refresh')">
          <Tooltip placement="top" :content="$t('L00121')">
            <Icon class="action-icon" type="md-refresh"></Icon>
          </Tooltip>
        </div>
      </div>
      <div slot="body" class="panel-body">
        <SearchCategory></SearchCategory>
      </div>
    </XPanel>
    <!-- 新增/编辑弹窗 -->
    <EditCategory></EditCategory>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Store from '../store'
import EditCategory from '../containers/EditCategory.vue'
import SearchCategory from '../containers/SearchCategory.vue'

  export default {
    name: 'AdminBlogCategory',
    components: {
      EditCategory,
      SearchCategory
    },
    computed: {
      ...mapGetters('Platform', [
        'verifyPermission'
      ])
    },
    methods: {
      // 处理操作
      handleAction: function (action) {
        let _t = this
        switch (action) {
          case 'add':
            // 广播事件
            _t.$X.utils.bus.$emit('Apps/AdminBlogCategory/edit', {
              action: 'add',
              info: {}
            })
            break
          case 'refresh':
            // 刷新列表
            _t.$X.utils.bus.$emit('Apps/AdminBlogCategory/list/refresh')
            break
        }
      }
    },
    created () {
      let _t = this
      // 将store注册到apps下
      _t.$store.registerModule(['Apps', Store.moduleName], Store.store)
      _t.$nextTick(function () {
        // 初始化列表
        _t.$X.utils.bus.$emit('Apps/AdminBlogCategory/list/init')
      })
    },
    destroyed () {
      let _t = this
      // 卸载store
      _t.$store.unregisterModule(['Apps', Store.moduleName])
    }
  }
</script>

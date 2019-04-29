/**
* Created by OXOYO on 2019/4/29.
*
* AdminBlogTag 应用根组件
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
        <SearchTag></SearchTag>
      </div>
    </XPanel>
    <!-- 新增/编辑弹窗 -->
    <EditTag></EditTag>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Store from '../store'
import EditTag from '../containers/EditTag.vue'
import SearchTag from '../containers/SearchTag.vue'

  export default {
    name: 'AdminBlogTag',
    components: {
      EditTag,
      SearchTag
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
            _t.$X.utils.bus.$emit('Apps/AdminBlogTag/edit', {
              action: 'add',
              info: {}
            })
            break
          case 'refresh':
            // 刷新列表
            _t.$X.utils.bus.$emit('Apps/AdminBlogTag/list/refresh')
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
        _t.$X.utils.bus.$emit('Apps/AdminBlogTag/list/init')
      })
    },
    destroyed () {
      let _t = this
      // 卸载store
      _t.$store.unregisterModule(['Apps', Store.moduleName])
    }
  }
</script>

/**
* Created by OXOYO on 2017/12/5.
*
* 模块002 根组件
*/

<style scoped lang="less" rel="stylesheet/less">

</style>

<template>
  <div class="main-box" v-if="verifyPermission($route.name, 0)">
    <XPanel>
      <div slot="header-right" class="panel-header">
        <div class="action-btn" v-if="verifyPermission($route.name, 1)" @click.stop="handleAction('add')">
          <Tooltip transfer placement="top" :content="$t('L00122')">
            <Icon class="action-icon" type="md-add"></Icon>
          </Tooltip>
        </div>
        <div class="action-btn" @click.stop="handleAction('refresh')">
          <Tooltip transfer placement="top" :content="$t('L00121')">
            <Icon class="action-icon" type="md-refresh"></Icon>
          </Tooltip>
        </div>
        <div class="action-btn" v-if="verifyPermission($route.name, 1)" @click.stop="handleAction('sort')">
          <Tooltip transfer placement="top" :content="$t('L00130')">
            <Icon class="action-icon" type="md-swap" style="transform:rotate(90deg);"></Icon>
          </Tooltip>
        </div>
      </div>
      <div slot="body" class="panel-body">
        <SearchResources></SearchResources>
      </div>
    </XPanel>
    <!-- 新增/编辑弹窗 -->
    <EditResource v-if="verifyPermission($route.name, 1)"></EditResource>
    <!-- 详情弹窗 -->
    <DetailResource></DetailResource>
    <!-- 对侧边栏菜单排序 -->
    <SortResource v-if="verifyPermission($route.name, 1)"></SortResource>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  import Store from '../store'
  import EditResource from '../containers/EditResource.vue'
  import DetailResource from '../containers/DetailResource.vue'
  import SearchResources from '../containers/SearchResources.vue'
  import SortResource from '../containers/SortResource.vue'

  export default {
    name: 'Resources',
    components: {
      EditResource,
      DetailResource,
      SearchResources,
      SortResource
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
            _t.$X.utils.bus.$emit('Apps/Resources/edit', {
              action: 'add',
              info: {}
            })
            break
          case 'refresh':
            // 刷新列表
            _t.$X.utils.bus.$emit('Apps/Resources/list/refresh')
            break
          case 'sort':
            // 排序侧边栏菜单
            _t.$X.utils.bus.$emit('Apps/Resources/sort')
            break
        }
      }
    },
    created: function () {
      let _t = this
      // 将store注册到apps下
      _t.$store.registerModule(['Apps', Store.moduleName], Store.store)
      _t.$nextTick(function () {
        // 初始化列表
        _t.$X.utils.bus.$emit('Apps/Resources/list/init')
      })
    },
    destroyed: function () {
      let _t = this
      // 卸载store
      _t.$store.unregisterModule(['Apps', Store.moduleName])
    }
  }
</script>

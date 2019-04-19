/**
* Created by OXOYO on 2017/12/5.
*
* 角色管理模块 根组件
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
      </div>
      <div slot="body" class="panel-body">
        <SearchRoles></SearchRoles>
      </div>
    </XPanel>
    <!-- 新增/编辑弹窗 -->
    <EditRole v-if="verifyPermission($route.name, 1)"></EditRole>
    <!-- 详情 -->
    <DetailRole></DetailRole>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Store from '../store'
  import EditRole from '../containers/EditRole.vue'
  import SearchRoles from '../containers/SearchRoles.vue'
  import DetailRole from '../containers/DetailRole.vue'

  export default {
    name: 'Roles',
    components: {
      EditRole,
      SearchRoles,
      DetailRole
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
            _t.$X.utils.bus.$emit('Apps/Roles/edit', {
              action: 'add',
              info: {}
            })
            break
          case 'refresh':
            // 刷新列表
            _t.$X.utils.bus.$emit('Apps/Roles/list/refresh')
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
        _t.$X.utils.bus.$emit('Apps/Roles/list/init')
      })
    },
    destroyed: function () {
      let _t = this
      // 卸载store
      _t.$store.unregisterModule(['Apps', Store.moduleName])
    }
  }
</script>

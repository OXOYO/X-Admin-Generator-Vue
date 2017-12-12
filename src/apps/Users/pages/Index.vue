/**
* Created by OXOYO on 2017/12/5.
*
* 用户管理模块 根组件
*/

<style scoped lang="less" rel="stylesheet/less">
  .main-box {
    width: 100%;
    height: 100%;
    padding: 10px;
    overflow: auto;
  }
  .panel-header {
    display: inline-block;
    float: right;

    .action-btn {
      display: inline-block;

      .action-icon {
        font-size: 18px;
        padding: 2px;
        color: #2d8cf0;
        border: 1px solid transparent;

        &:hover {
          color: #57a3f3;
          border-color: #57a3f3;
        }
      }
      &.action-text {
        color: #2d8cf0;
        padding: 10px;
        cursor: pointer;
        &:hover {
          color: #57a3f3;
          font-size: 1.2em;
        }
      }
    }
  }
</style>

<template>
  <div class="main-box">
    <UPanel>
      <div slot="header" class="panel-header">
        <div class="action-btn" @click="handleAction('add')">
          <Tooltip transfer placement="top" content="新增">
            <Icon class="action-icon" type="plus"></Icon>
          </Tooltip>
        </div>
        <div class="action-btn" @click="handleAction('refresh')">
          <Tooltip transfer placement="top" content="刷新">
            <Icon class="action-icon" type="refresh"></Icon>
          </Tooltip>
        </div>
      </div>
      <div slot="body" class="panel-body">
        <SearchUsers></SearchUsers>
      </div>
    </UPanel>
    <!-- 新增/编辑弹窗 -->
    <EditUser></EditUser>
  </div>
</template>

<script>
  import Store from '../store'
  import EditUser from '../containers/EditUser.vue'
  import SearchUsers from '../containers/SearchUsers.vue'
  export default {
    name: 'Users',
    components: {
      EditUser,
      SearchUsers
    },
    methods: {
      // 处理操作
      handleAction: function (action, index) {
        let _t = this
        switch (action) {
          case 'add':
            // 广播事件
            _t.$utils.bus.$emit('Apps/Users/edit', {
              action: 'add',
              info: {}
            })
            break
          case 'refresh':
            // 刷新列表
            _t.$utils.bus.$emit('Apps/Users/list/refresh')
            break
        }
      }
    },
    created: function () {
      let _t = this
      // 将store注册到apps下
      _t.$store.registerModule([_t.$utils.store.getModuleName('Apps'), Store.moduleName], Store.store)
      _t.$nextTick(function () {
        // 初始化列表
        _t.$utils.bus.$emit('Apps/Users/list/init')
      })
    },
    destroyed: function () {
      let _t = this
      // 卸载store
      _t.$store.unregisterModule([_t.$utils.store.getModuleName('Apps'), Store.moduleName])
    }
  }
</script>


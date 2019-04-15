/**
* Created by OXOYO on 2018/5/14.
*
* 排序侧边栏菜单
*/

<style scoped lang="less" rel="stylesheet/less">
  .sort-list {
    display: inline-block;
    border: 1px solid #dddddd;
    position: relative;

    .sort-item {
      display: inline-block;
      width: 100%;
      position: relative;
      border-top: 1px solid #dddddd;
      border-bottom: 1px solid #dddddd;
      margin-bottom: -1px;
    }

    .sort-children {
      display: none;
      padding: 0;

      .sort-item {

        .item-num {
          margin-left: 20px;
        }
      }
    }
    .item-num {
      display: inline-block;
      margin-left: 10px;
    }
    .item-title {
      display: inline-block;
      padding: 10px;
    }
    .handler {
      position: absolute;
      right: 10px;
      top: 10px;
      width: 25px;
      height: 25px;
      line-height: 25px;
      text-align: center;
      cursor: default;
    }

    .sort-children-open {
      display: inline-block;
    }
    .sort-drag {
      display: none;
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      background: #fff;

      &.sort-drag-ing {
        display: inline-block;
      }

      .sort-title {

      }
    }
  }
</style>

<template>
  <Modal
    v-model="isShowModal"
    title="排序"
    :mask-closable="true"
    :closable="true"
    @on-cancel="handleCancel"
  >
    <div
      class="sort-list"
    >
      <div
        class="sort-item"
        v-if="menuMap.children && menuMap.children.length"
        v-for="item in menuMap.children"
        :key="item.name"
      >
        <InputNumber class="item-num" v-model="item.num"></InputNumber>
        <div class="item-title">{{ item.id}} {{ item.title }}</div>
        <div
          v-if="item.resources.children && item.resources.children.length"
          :class="{ 'handler': true, 'handler-open': item.expand }"
          @click="handleExpand(item)"
        >
          <Icon :type="item.expand ? 'chevron-down' : 'chevron-up'"></Icon>
        </div>
        <div
          :class="{ 'sort-children': true, 'sort-children-open': item.expand }"
          v-if="item.resources.children && item.resources.children.length"
        >
          <div
            class="sort-item"
            v-for="childItem in item.resources.children"
            :key="childItem.name"
          >
            <InputNumber class="item-num" v-model="childItem.num"></InputNumber>
            <div class="item-title">{{ childItem.id}} {{ childItem.title }}</div>
          </div>
        </div>
      </div>
    </div>
    <div slot="footer">
      <Button type="primary" :loading="doSaveLoading" @click="doSave">保存</Button>
      <Button :loading="doResetLoading" @click="doReset">重置</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'SortResource',
    data () {
      return {
        // 是否显示弹窗
        isShowModal: false,
        // 菜单列表
        menuList: [],
        menuMap: {},
        // 资源列表
        resourceList: [],
        // 保存loading
        doSaveLoading: false,
        // 重置loading
        doResetLoading: false,
        // 备份数据
        backModalInfo: {}
      }
    },
    methods: {
      init: function () {
        let _t = this
        _t.handleMenuList()
        // 显示弹窗
        _t.isShowModal = true
      },
      // 处理菜单列表
      handleMenuList: async function (resourceList) {
        let _t = this
        if (!resourceList) {
          resourceList = await _t.getResourceList()
          _t.resourceList = resourceList
        }
        // 将资源按级别划分 parent_id 0 为根节点
        let handleByLevel = function (list, parentID) {
          let tmpObj = {
            parent_id: parentID,
            children: [],
            // 是否展开子节点
            expand: false
          }
          // 筛选出子节点和非子节点
          let otherList = []
          let index = 0
          list.map(item => {
            if (item.parent_id === parentID) {
              tmpObj.children.push({
                ...item,
                index: index
              })
              index = index + 1
            } else {
              otherList.push(item)
            }
          })
          // 排序
          tmpObj.children.sort((a, b) => a.num - b.num)
          // 查找每个节点的子节点
          if (tmpObj.children.length && otherList.length) {
            tmpObj.children.map(item => {
              item.resources = handleByLevel(otherList, item.id)
            })
          }
          return tmpObj
        }
        _t.menuMap = handleByLevel(resourceList, 0)
      },
      // 获取资源列表
      getResourceList: async function () {
        let _t = this
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/Resources/list/all', {
          enable: [1],
          sidebar: [1],
          type: ['module-system', 'module-app', 'module-link']
        })
        if (!res || res.code !== 200) {
          return []
        }
        // 处理返回数据
        if (res.data.count && res.data.list && res.data.list.length) {
          _t.$Message.success(res.msg || '查询列表成功！')
        } else {
          _t.$Message.info('暂无数据！')
        }
        // 更新数据
        return res.data.list || []
      },
      // 关闭弹窗
      handleCancel: function () {
        let _t = this
        // 关闭弹窗
        _t.isShowModal = false
      },
      // 处理折叠展开
      handleExpand: function (info) {
        let _t = this
        _t.menuMap.children = _t.menuMap.children.map(item => {
          if (item.name === info.name) {
            item.expand = !item.expand
          }
          return item
        })
      },
      doSave: async function () {
        let _t = this
        // 递归查找，获取所有的资源id、num
        let tmpArr = []
        let getNum = function (list) {
          list.map(item => {
            tmpArr.push({
              id: item.id,
              num: item.num
            })
            if (item.resources && item.resources.children && item.resources.children.length) {
              getNum(item.resources.children)
            }
          })
        }
        getNum(_t.menuMap.children)
        // 分发action，执行保存
        let res = await _t.$store.dispatch('Apps/Resources/sort', tmpArr)
        _t.doSaveLoading = false
        if (!res || res.code !== 200) {
          return
        }
        // 处理返回数据
        _t.$Message.success(res.msg || '保存成功！')
        // 关闭弹窗
        _t.handleCancel()
        // 刷新列表
        _t.$X.utils.bus.$emit('Apps/Resources/list/refresh')
        // 刷新侧边栏
        _t.$X.utils.bus.$emit('Platform/Sidebar/refresh')
      },
      doReset: function () {}
    },
    created: function () {
      let _t = this
      // 监听
      _t.$X.utils.bus.$on('Apps/Resources/sort', function () {
        // 初始化
        _t.init()
      })
    },
    beforeDestroy: function () {
      let _t = this
      // 销毁监听
      _t.$X.utils.bus.$off('Apps/Resources/sort')
    }
  }
</script>

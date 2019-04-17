/**
* Created by OXOYO on 2019/2/22.
*
* 资源详情
*/

<style scoped lang="less" rel="stylesheet/less">
  .circle {
    width: 22px;
    height: 22px;
    line-height: 22px;
    font-size: 12px;
    background: red;
    border-radius: 50%;
    display: inline-block;
    text-align: center;
    color: #fff;
  }
</style>

<template>
  <Modal
    class="detail-modal"
    v-model="isShowModal"
    title="详情"
    :mask-closable="true"
    :closable="true"
    :width="900"
    @on-cancel="handleCancel"
  >
    <Form
      class="detail-form"
      :model="detailInfo"
      :label-width="120"
    >
      <template v-for="(key, index) in Object.keys(detailInfo).filter(k => !['_index', '_rowKey'].includes(k))">
        <FormItem v-if="key === 'title'" label="用户组名称" prop="title" :key="key + '_' + index">
          <Input v-model="detailInfo.title" placeholder="用户组名称" readonly style="width: 400px;"></Input>
        </FormItem>
        <FormItem v-else-if="key === 'description'" label="用户组描述" prop="description" :key="key + '_' + index">
          <Input v-model="detailInfo.description" placeholder="用户组描述" type="textarea" :rows="4" readonly style="width: 400px;"></Input>
        </FormItem>
        <FormItem v-else-if="key === 'status'" label="状态" prop="status" :key="key + '_' + index">
          <Radio-group v-model="detailInfo.status">
            <Radio :label="0" v-if="0 === detailInfo.status">停用</Radio>
            <Radio :label="1" v-if="1 === detailInfo.status">启用</Radio>
          </Radio-group>
        </FormItem>
        <FormItem v-else-if="key === 'create_user'" label="创建人" prop="url" :key="key + '_' + index">
          <span>{{ detailInfo.create_user.name }} {{ detailInfo.create_user.account }}</span>
        </FormItem>
        <FormItem  v-else-if="key === 'create_time'" label="创建时间" prop="create_time" :key="key + '_' + index">
          <div>{{ $X.moment(detailInfo[key]).format('YYYY-MM-DD hh:mm:ss') }}</div>
        </FormItem>
        <FormItem  v-else-if="key === 'update_time'" label="更新时间" prop="update_time" :key="key + '_' + index">
          <div>{{ $X.moment(detailInfo[key]).format('YYYY-MM-DD hh:mm:ss') }}</div>
        </FormItem>
        <FormItem v-else-if="key === 'resource_id'" label="资源" :key="key + '_' + index">
          <ElTable
            class="table-card"
            :data="rowList"
            :span-method="handleSpan"
            border
          >
            <ElTableColumn
              prop="title"
              label="一级菜单"
            >
              <template slot-scope="scope">
              <span v-if="scope.row.parent_id === 0">
                <div class="circle" :style="{ 'background-color': handleResourceTypeTag(scope.row, 'color') }">{{ scope.row.id }}</div>
                {{ scope.row.title }}
              </span>
                <span v-else>
                <div class="circle" :style="{ 'background-color': handleResourceTypeTag(scope.row.parent, 'color') }">{{ scope.row.parent.id }}</div>
                {{ scope.row.parent.title }}
              </span>
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="second"
              label="二级菜单">
              <template slot-scope="scope">
              <span v-if="scope.row.parent_id != 0">
                <div class="circle" :style="{ 'background-color': handleResourceTypeTag(scope.row, 'color') }">{{ scope.row.id }}</div>
                {{ scope.row.title }}
              </span>
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="type"
              label="资源类别">
              <template slot-scope="scope">
                <Tag :color="handleResourceTypeTag(scope.row, 'color')">{{ handleResourceTypeTag(scope.row, 'label') }}</Tag>
              </template>
            </ElTableColumn>
            <ElTableColumn
              prop="permission"
              label="读写权限">
              <template slot-scope="scope">
                <CheckboxGroup v-if="scope.row.permission.length" v-model="scope.row.permission" style="position: relative;">
                  <div class="mask-disabled" @click.stop.prevent></div>
                  <Checkbox
                    v-for="(item, index) in $X.config.permissionTypeList.filter(item.enable && scope.row.permission_type.includes(item.key) && scope.row.permission.includes(item.key))"
                    :key="index"
                    :label="item.key"
                  >
                    {{ item.label }}
                  </Checkbox>
                </CheckboxGroup>
                <span v-else>-</span>
              </template>
            </ElTableColumn>
          </ElTable>
        </FormItem>
      </template>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="handleCancel">关闭</Button>
    </div>
  </Modal>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'DetailRole',
    data () {
      return {
        // 是否显示弹窗
        isShowModal: false,
        // 详情
        detailInfo: {},
        resourceList: [],
        rowList: []
      }
    },
    computed: {
      ...mapState('Platform', {
        userInfo: state => state.userInfo
      })
    },
    methods: {
      init: function (detailInfo) {
        let _t = this
        _t.detailInfo = detailInfo
        // 处理资源树
        _t.handleResourceTree()
      },
      // 关闭弹窗
      handleCancel: function () {
        let _t = this
        // 清空备份数据
        _t.detailInfo = {}
        // 关闭弹窗
        _t.isShowModal = false
      },
      // 获取资源列表
      getResourceList: async function () {
        let _t = this
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/Roles/resource/list/all', {
          enable: [0, 1],
          type: ['module-system', 'module-app', 'module-link']
        })
        if (!res || res.code !== 200) {
          return
        }
        // 处理返回数据
        if (res.data.count && res.data.list && res.data.list.length) {
          _t.$Message.success(res.msg || '查询列表成功！')
        } else {
          _t.$Message.info('暂无数据！')
        }
        // 更新数据
        _t.resourceList = res.data.list || []
      },
      // 处理资源树
      handleResourceTree: function () {
        let _t = this
        // 处理resourceTree
        let currentUserGroup = _t.userInfo.currentUserGroup || _t.userInfo.user_groups[0] || {}
        let accessResources = currentUserGroup.resource_id ? currentUserGroup.resource_id.split(',') : []
        accessResources = accessResources.map(idStr => parseInt(idStr))
        // 根据权限码显示菜单
        let handlerByAccess = function (list) {
          return list.filter(item => {
            // 判断当前节点是否启用、是否放置在sidebar、是否允许当前用户类别及角色
            return ((_t.userInfo.type !== 0 && accessResources.includes(item.id)) || _t.userInfo.type === 0) && item.enable && ['module-system', 'module-app', 'module-link'].includes(item.type)
          })
        }
        // 根据用户权限获取有效的资源数据
        let resourceList = handlerByAccess(_t.resourceList)
        // 处理行列表
        let rowList = []
        let roleResourceList = _t.detailInfo.permission.split(',').map(item => {
          let [id, ...permission] = item.split('|').map(item => parseInt(item))
          return {
            id: id,
            permission
          }
        })
        // 处理一级菜单
        resourceList.map((item, index) => {
          if (item.parent_id === 0) {
            // 查找二级菜单
            let count = 0
            let rowIndex
            resourceList.map(child => {
              if (child.parent_id === item.id) {
                if (rowIndex === undefined) {
                  rowIndex = rowList.length
                }
                let resourceTarget = roleResourceList.find(resourceItem => resourceItem.id === child.id)
                rowList.push({
                  ...child,
                  level: 2,
                  count: 0,
                  // FIXME 需处理权限
                  permission: resourceTarget ? resourceTarget.permission : [],
                  parent: item
                })
                count++
              }
            })
            if (count) {
              if (rowIndex !== undefined) {
                rowList[rowIndex]['count'] = count
              }
            } else {
              let resourceTarget = roleResourceList.find(resourceItem => resourceItem.id === item.id)
              // 无二级菜单则插入一级菜单
              rowList.push({
                ...item,
                level: 1,
                count: 1,
                permission: resourceTarget ? resourceTarget.permission : []
              })
            }
          }
        })
        _t.rowList = rowList
      },
      handleSpan: function ({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          return {
            rowspan: row.count,
            colspan: 1
          }
        }
        return {
          rowspan: 1,
          colspan: 1
        }
      },
      handleResourceTypeTag: function (rowData, key) {
        let _t = this
        let target = _t.$X.config.resourceTypeList.find(item => item.name === rowData.type)
        return target ? target[key] : ''
      }
    },
    mounted: async function () {
      let _t = this
      // 监听
      _t.$X.utils.bus.$on('Apps/Roles/detail', async function (data) {
        // 获取资源列表
        await _t.getResourceList()
        // 初始化
        _t.init(data.info)
        // 显示弹窗
        _t.isShowModal = true
      })
    },
    beforeDestroy: function () {
      let _t = this
      // 销毁监听
      _t.$X.utils.bus.$off('Apps/Roles/detail')
    }
  }
</script>

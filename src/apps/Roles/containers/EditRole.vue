/**
* Created by OXOYO on 2018/8/7.
* 编辑角色
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
    v-model="isShowModal"
    :title="currentAction === 'edit' ? '编辑' : currentAction === 'add' ? '新增' : ''"
    :mask-closable="true"
    :closable="true"
    :width="900"
    @on-cancel="handleCancel"
  >
    <Form
      ref="modalForm"
      :model="modalForm"
      :rules="modalFormRules"
      :label-width="120"
    >
      <FormItem label="用户组名称" prop="title">
        <Input v-model="modalForm.title" placeholder="请输入用户组名称" style="width: 400px"></Input>
      </FormItem>
      <FormItem label="用户组描述" prop="description">
        <Input v-model="modalForm.description" placeholder="请输入用户组描述信息" type="textarea" :rows="4" style="width: 400px"></Input>
      </FormItem>
      <FormItem label="状态" prop="status">
        <Radio-group v-model="modalForm.status">
          <Radio :label="0">停用</Radio>
          <Radio :label="1">启用</Radio>
        </Radio-group>
      </FormItem>
      <FormItem label="资源">
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
              <CheckboxGroup v-model="scope.row.permission" @on-change="(val) => handlePermissionChange(val, scope.$index)">
                <Checkbox
                  v-for="(item, index) in $X.config.permissionTypeList.filter(item => item.enable && scope.row.permission_type.includes(item.key))"
                  :key="index"
                  :label="item.key"
                >
                 {{ item.label }}
                </Checkbox>
              </CheckboxGroup>
            </template>
          </ElTableColumn>
        </ElTable>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" :loading="doSaveLoading" @click="doSave">保存</Button>
      <Button :loading="doResetLoading" @click="doReset">重置</Button>
    </div>
  </Modal>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'EditRole',
    data () {
      return {
        // 是否显示弹窗
        isShowModal: false,
        // 当前操作类型
        currentAction: '',
        // 默认表单数据
        defModalForm: {
          title: '',
          description: '',
          status: 1,
          resource_id: '',
          permission: ''
        },
        // 表单数据
        modalForm: {},
        // 表单校验规则
        modalFormRules: {
          title: [
            {
              required: true,
              message: '请填写用户组名称',
              trigger: 'blur'
            }
          ],
          description: [
            {
              // required: true,
              message: '请填写用户组描述信息',
              trigger: 'blur'
            }
          ],
          resource_id: [
            {
              required: true,
              type: 'array',
              min: 1,
              message: '请至少选择一个资源',
              trigger: 'change'
            }
          ]
        },
        // 保存loading
        doSaveLoading: false,
        // 重置loading
        doResetLoading: false,
        // 备份数据
        backModalInfo: {},
        // 资源列表数据
        resourceList: [],
        spanCount: [],
        rowList: []
      }
    },
    computed: {
      ...mapState('Platform', {
        userInfo: state => state.userInfo
      })
    },
    methods: {
      // 执行保存
      doSave: async function () {
        let _t = this
        // 校验结果
        let validResult
        _t.$refs['modalForm'].validate((valid) => {
          validResult = valid
        })
        if (validResult !== undefined && !validResult) {
          _t.$Message.error(_t.$t('L00136'))
          return
        }
        let permissionList = []
        let resourceIdList = []
        _t.rowList.map(item => {
          if (item.permission.length) {
            let tmpArr = [item.id, ...item.permission]
            resourceIdList.push(item.id)
            permissionList.push(tmpArr.join('|'))
          }
        })
        _t.doSaveLoading = false
        let actionPath
        let payload = {
          ..._t.modalForm,
          resource_id: resourceIdList.join(','),
          permission: permissionList.join(',')
        }
        // 按action类别分别处理
        if (_t.currentAction === 'add') {
          actionPath = 'Apps/Roles/add'
        } else if (_t.currentAction === 'edit') {
          actionPath = 'Apps/Roles/edit'
        }
        if (!actionPath) {
          return
        }
        // 分发action，执行保存
        _t.doSaveLoading = true
        let res = await _t.$store.dispatch(actionPath, payload)
        _t.doSaveLoading = false
        if (!res || res.code !== 200) {
          return
        }
        // 处理返回数据
        _t.$Message.success(res.msg)
        // 关闭弹窗
        _t.handleCancel()
        // 刷新列表
        _t.$X.utils.bus.$emit('Apps/Roles/list/refresh')
      },
      // 执行重置
      doReset: function () {
        let _t = this
        _t.doResetLoading = true
        // 初始化表单数据
        _t.initFormData()
        _t.doResetLoading = false
      },
      // 初始化表单数据
      initFormData: function () {
        let _t = this
        _t.currentAction = _t.backModalInfo && _t.backModalInfo.action ? _t.backModalInfo.action : _t.currentAction
        let defModalForm = JSON.parse(JSON.stringify(_t.defModalForm))

        if (_t.currentAction === 'edit' && _t.backModalInfo && _t.backModalInfo.info) {
          let backModalInfo = _t.backModalInfo.info instanceof Object ? JSON.parse(JSON.stringify(_t.backModalInfo.info)) : _t.backModalInfo.info
          _t.modalForm = {
            ...defModalForm,
            ...backModalInfo
          }
        } else {
          _t.modalForm = {
            ...defModalForm
          }
        }
        // 处理资源树
        _t.handleResourceTree()
      },
      // 关闭弹窗
      handleCancel: function () {
        let _t = this
        // 初始化表单数据
        _t.initFormData()
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
          _t.$Message.success(res.msg)
        } else {
          _t.$Message.info(_t.$t('L00011'))
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
        let roleResourceList = _t.modalForm.permission.split(',').map(item => {
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
      },
      // FIXME 处理权限改变，有写权限则有读权限
      handlePermissionChange: function (val, index) {
        let _t = this
        if (_t.rowList[index].permission.includes(1) && !_t.rowList[index].permission.includes(0)) {
          _t.rowList[index].permission = [0, 1]
        }
      }
    },
    created: function () {
      let _t = this
      // 监听
      _t.$X.utils.bus.$on('Apps/Roles/edit', async function (data) {
        // 显示弹窗
        _t.isShowModal = true
        // 备份数据
        _t.backModalInfo = data
        // 获取资源列表
        await _t.getResourceList()
        // 初始化表单数据
        _t.initFormData()
      })
    },
    beforeDestroy: function () {
      let _t = this
      // 销毁监听
      _t.$X.utils.bus.$off('Apps/Roles/edit')
    }
  }
</script>

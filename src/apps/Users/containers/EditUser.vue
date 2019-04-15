/**
* Created by OXOYO on 2017/12/7.
*
* 新增/编辑 用户
*/

<style lang="less" rel="stylesheet/less">
  .notice {
    border: none;
    background: transparent;

    &.ivu-alert-with-icon {
      padding-left: 16px;
    }

    .ivu-alert-icon {
      left: 0;
    }
  }
</style>

<template>
  <Modal
    v-model="isShowModal"
    :title="modalTitle[currentAction]"
    :mask-closable="true"
    :closable="true"
    @on-cancel="handleCancel"
  >
    <Form
      ref="modalForm"
      :model="modalForm"
      :rules="modalFormRules"
      :label-width="120"
    >
      <FormItem label="账号" prop="account">
        <Input v-model="modalForm.account" placeholder="请输入账号" :disabled="currentAction === 'transfer'" style="width: 200px;"></Input>
      </FormItem>
      <FormItem label="姓名" prop="name">
        <Input v-model="modalForm.name" placeholder="请输入姓名" :disabled="currentAction === 'transfer'" style="width: 200px;"></Input>
      </FormItem>
      <FormItem label="级别" prop="type">
        <Radio-group v-model="modalForm.type">
          <Radio :label="0" v-if="userInfo && [0].includes(userInfo.type)" :disabled="currentAction === 'transfer'">
            <Icon :type="userClass[0]['icon']"></Icon>
            <span>超级管理员</span>
          </Radio>
          <Radio :label="1" v-if="userInfo && [0].includes(userInfo.type)" :disabled="currentAction === 'transfer'">
            <Icon :type="userClass[1]['icon']"></Icon>
            <span>管理员</span>
          </Radio>
          <Radio :label="2" v-if="userInfo && [0, 1].includes(userInfo.type)" :disabled="currentAction === 'transfer'">
            <Icon :type="userClass[2]['icon']"></Icon>
            <span>普通用户</span>
          </Radio>
        </Radio-group>
      </FormItem>
      <FormItem label="用户组" prop="group_id">
        <Select v-model="modalForm.group_id" multiple filterable :disabled="currentAction === 'transfer' || (userInfo.type === 1 && !hasUserGroup)" style="width: 300px;">
          <OptionGroup
            v-for="item in userGroupMap"
            :label="item.createUser.name + ' ' + item.createUser.account"
            :key="'crate_user_id_' + item.createUser.id"
          >
            <Option
              v-for="groupItem in item.list"
              :value="groupItem.id"
              :key="groupItem.id"
              :label="groupItem.title + ' ' + item.createUser.name + ' ' + item.createUser.account"
              :disabled="userInfo.type === 1 && groupItem.create_user_id !== userInfo.id"
            >
              {{ groupItem.title }}
            </Option>
          </OptionGroup>
          <!--
          <Option
            v-for="item in userGroupMap"
            :value="item.id"
            :key="item.id"
            :disabled="item.create_user_id !== userInfo.id"
            style="display: inline-block; width: 100%; position: relative;"
          >
            <span style="float: left; margin-top: 5px;">{{ item.title }}</span>
            <span style="position: absolute; right: 35px; margin-top: 5px;">{{ item.create_user.name }} {{ item.create_user.account }}</span>
          </Option>
          -->
        </Select>
        <Alert v-if="userInfo.type === 1" class="notice" :type="hasUserGroup ? 'info' : 'error'" show-icon>{{ hasUserGroup ? '只可操作自己创建的用户组！' : '暂无可操作的用户组，请先创建用户组！' }}</Alert>
      </FormItem>
      <FormItem label="状态" prop="status">
        <Radio-group v-model="modalForm.status">
          <Radio :label="0" :disabled="currentAction === 'transfer'">停用</Radio>
          <Radio :label="1" :disabled="currentAction === 'transfer'">启用</Radio>
        </Radio-group>
      </FormItem>
      <FormItem label="创建人" prop="create_user_id" v-if="currentAction === 'transfer'">
        <Select v-model="modalForm.create_user_id">
          <Option
            v-for="item in adminList"
            :value="item.id"
            :key="item.id"
            style="display: inline-block; width: 100%; position: relative;"
          >
            <span style="float: left; margin-top: 5px;">{{ item.name }}</span>
            <span style="position: absolute; right: 35px; margin-top: 5px;">{{ item.account }}</span>
          </Option>
        </Select>
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
    name: 'EditUser',
    data () {
      return {
        // 是否显示弹窗
        isShowModal: false,
        // 当前操作类型
        currentAction: '',
        // 弹窗标题
        modalTitle: {
          edit: '编辑',
          add: '新增',
          transfer: '转移'
        },
        // 默认表单数据
        defModalForm: {
          account: '',
          name: '',
          type: 2,
          group_id: [],
          status: 1
        },
        // 表单数据
        modalForm: {},
        // 表单校验规则
        modalFormRules: {
          account: [
            {
              required: true,
              message: '请填写账号',
              trigger: 'blur'
            }
          ],
          name: [
            {
              required: true,
              message: '请填写用户名',
              trigger: 'blur'
            }
          ],
          group_id: [
            {
              type: 'array',
              // required: true,
              message: '请选择用户组',
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
        // 用户组列表
        userGroupMap: [],
        // 管理员列表
        adminList: [],
        // 当前管理员是否有自己创建的角色
        hasUserGroup: false
      }
    },
    computed: {
      ...mapState('Platform', {
        userInfo: state => state.userInfo,
        userClass: state => state.userClass
      })
    },
    methods: {
      // 执行保存
      doSave: async function () {
        let _t = this
        _t.doSaveLoading = true
        // 校验结果
        let validResult = false
        this.$refs['modalForm'].validate((valid) => {
          validResult = valid
          if (!valid) {
            _t.$Message.error('表单验证失败！')
            _t.doSaveLoading = false
          }
        })
        if (!validResult) {
          return
        }
        let actionPath = ''
        let payload = {
          ..._t.modalForm,
          group_id: _t.modalForm.group_id.join(',')
        }
        // 按action类别分别处理
        if (_t.currentAction === 'add') {
          actionPath = 'Apps/Users/add'
        } else if (['edit', 'transfer'].includes(_t.currentAction)) {
          actionPath = 'Apps/Users/edit'
        }
        // 分发action，执行保存
        let res = await _t.$store.dispatch(actionPath, payload)
        _t.doSaveLoading = false
        if (!res || res.code !== 200) {
          return
        }
        // 处理返回数据
        _t.$Message.success(res.msg || '保存成功！')
        // 关闭弹窗
        _t.handleCancel()
        // 刷新列表
        _t.$X.utils.bus.$emit('Apps/Users/list/refresh')
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

        if (['edit', 'transfer'].includes(_t.currentAction) && _t.backModalInfo && _t.backModalInfo.info) {
          let backModalInfo = _t.backModalInfo.info instanceof Object ? JSON.parse(JSON.stringify(_t.backModalInfo.info)) : _t.backModalInfo.info
          let tmpArr = backModalInfo.group_id ? backModalInfo.group_id.split(',') : []
          tmpArr = tmpArr.map(idStr => parseInt(idStr))
          _t.modalForm = {
            ...defModalForm,
            ...backModalInfo,
            group_id: tmpArr
          }
        } else {
          _t.modalForm = {
            ...defModalForm
          }
        }
      },
      // 关闭弹窗
      handleCancel: function () {
        let _t = this
        // 初始化表单数据
        _t.initFormData()
        // 清空校验
        _t.$refs.modalForm.resetFields()
        // 关闭弹窗
        _t.isShowModal = false
      },
      // 获取用户组列表
      getUserGroupList: async function () {
        let _t = this
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/Users/role/list/all', {
          status: [1]
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
        let resList = res.data.list || []
        // 按创建人划分
        let userGroupMap = {}
        for (let i = 0, len = resList.length; i < len; i++) {
          let item = resList[i]
          if (!userGroupMap.hasOwnProperty(item.create_user_id)) {
            userGroupMap[item.create_user_id] = {
              createUser: item.create_user,
              list: []
            }
          }
          userGroupMap[item.create_user_id].list.push(item)
        }
        _t.userGroupMap = userGroupMap
        // 判断用户类别
        if (_t.userInfo.type === 1) {
          _t.hasUserGroup = _t.userGroupMap.hasOwnProperty(_t.userInfo.id)
        }
      },
      // 获取管理员列表
      getAdminList: async function () {
        let _t = this
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/Users/list/all', {
          status: [1],
          type: [0, 1]
        })
        if (!res || res.code !== 200) {
          return
        }
        // 处理返回数据
        if (res.data.count && res.data.list && res.data.list.length) {
          _t.$Message.success('查询管理员列表成功！')
        } else {
          _t.$Message.info('暂无数据！')
        }
        // 更新列表数据
        _t.adminList = res.data.list || []
      }
    },
    created: async function () {
      let _t = this
      // 监听
      _t.$X.utils.bus.$on('Apps/Users/edit', async function (data) {
        // 显示弹窗
        _t.isShowModal = true
        // 备份数据
        _t.backModalInfo = data
        // 获取用户组列表
        await _t.getUserGroupList()
        if (data.action === 'transfer') {
          await _t.getAdminList()
        }
        // 初始化表单数据
        _t.initFormData()
      })
    },
    beforeDestroy: function () {
      let _t = this
      // 销毁监听
      _t.$X.utils.bus.$off('Apps/Users/edit')
    }
  }
</script>


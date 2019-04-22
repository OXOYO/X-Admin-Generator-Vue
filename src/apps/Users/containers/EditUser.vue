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
      <FormItem :label="$t('L00049')" prop="account">
        <Input v-model="modalForm.account" :placeholder="$t('L00045')" style="width: 200px;"></Input>
      </FormItem>
      <FormItem :label="$t('L00050')" prop="name">
        <Input v-model="modalForm.name" :placeholder="$t('L00046')" style="width: 200px;"></Input>
      </FormItem>
      <FormItem :label="$t('L00055')" prop="type">
        <Radio-group v-model="modalForm.type">
          <Radio
            v-for="(item, index) in userClass.filter(item => item.enable && item.type >= userInfo.type)"
            :key="index"
            :label="item.type"
          >
            <Icon :type="item.icon"></Icon>
            <span>{{ $t(item.lang) }}</span>
          </Radio>
        </Radio-group>
      </FormItem>
      <FormItem :label="$t('L00056')" prop="group_id">
        <Select v-model="modalForm.group_id" multiple filterable :disabled="userInfo.type === 1 && !hasUserGroup" style="width: 300px;">
          <OptionGroup
            v-for="item in userGroupMap"
            :label="item.createUser.name + ' ' + item.createUser.account"
            :key="'crate_user_id_' + item.createUser.id"
          >
            <Option
              v-for="groupItem in item.list"
              :value="groupItem.id"
              :key="groupItem.id"
              :label="groupItem.name + ' ' + item.createUser.name + ' ' + item.createUser.account"
              :disabled="userInfo.type === 1 && groupItem.create_user_id !== userInfo.id"
            >
              {{ groupItem.name }}
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
      <FormItem :label="$t('L00037')" prop="status">
        <Radio-group v-model="modalForm.status">
          <Radio :label="0">{{ $t('L00106') }}</Radio>
          <Radio :label="1">{{ $t('L00105') }}</Radio>
        </Radio-group>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" :loading="doSaveLoading" @click="doSave">{{ $t('L00109') }}</Button>
      <Button @click="doReset">{{ $t('L00111') }}</Button>
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
          add: '新增'
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
        // 备份数据
        backModalInfo: {},
        // 用户组列表
        userGroupMap: [],
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
        // 校验结果
        let validResult
        _t.$refs['modalForm'].validate((valid) => {
          validResult = valid
        })
        if (validResult !== undefined && !validResult) {
          _t.$Message.error(_t.$t('L00136'))
          return
        }
        let actionPath
        let payload = {
          ..._t.modalForm,
          group_id: _t.modalForm.group_id.join(',')
        }
        // 按action类别分别处理
        if (_t.currentAction === 'add') {
          actionPath = 'Apps/Users/add'
        } else if (_t.currentAction === 'edit') {
          actionPath = 'Apps/Users/edit'
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
        _t.$X.utils.bus.$emit('Apps/Users/list/refresh')
      },
      // 执行重置
      doReset: function () {
        let _t = this
        // 初始化表单数据
        _t.initFormData()
      },
      // 初始化表单数据
      initFormData: function () {
        let _t = this
        _t.currentAction = _t.backModalInfo && _t.backModalInfo.action ? _t.backModalInfo.action : _t.currentAction
        let defModalForm = JSON.parse(JSON.stringify(_t.defModalForm))

        if (['edit'].includes(_t.currentAction) && _t.backModalInfo && _t.backModalInfo.info) {
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
          _t.$Message.success(res.msg)
        } else {
          _t.$Message.info(_t.$t('L00011'))
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

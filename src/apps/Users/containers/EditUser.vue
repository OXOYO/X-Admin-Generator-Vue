/**
* Created by OXOYO on 2017/12/7.
*
* 新增/编辑 用户
*/

<style scoped lang="less" rel="stylesheet/less">

</style>

<template>
  <Modal
    v-model="isShowModal"
    :title="currentAction === 'edit' ? '编辑用户' : currentAction === 'add' ? '新增用户' : ''"
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
        <Input v-model="modalForm.account" placeholder="请输入账号"></Input>
      </FormItem>
      <FormItem label="姓名" prop="name">
        <Input v-model="modalForm.name" placeholder="请输入姓名"></Input>
      </FormItem>
      <FormItem label="级别" prop="type">
        <Radio-group v-model="modalForm.type">
          <Radio label="0">管理员</Radio>
          <Radio label="1">普通用户</Radio>
        </Radio-group>
      </FormItem>
      <FormItem label="状态" prop="status">
        <Radio-group v-model="modalForm.status">
          <Radio label="0">停用</Radio>
          <Radio label="1">启用</Radio>
        </Radio-group>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" :loading="doSaveLoading" @click="doSave">保存</Button>
      <Button type="ghost" :loading="doResetLoading" @click="doReset">重置</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'EditUser',
    data () {
      return {
        // 是否显示弹窗
        isShowModal: false,
        // 当前操作类型
        currentAction: '',
        // 默认表单数据
        defModalForm: {
          account: '',
          name: '',
          type: 1,
          status: 1,
          apps: []
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
          apps: [
            {
              required: true,
              type: 'array',
              min: 1,
              message: '请至少选择一个应用',
              trigger: 'blur'
            }
          ]
        },
        // 保存loading
        doSaveLoading: false,
        // 重置loading
        doResetLoading: false,
        // 备份数据
        backModalInfo: {}
      }
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
        // 按action类别分别处理
        if (_t.currentAction === 'add') {
          // 分发action，执行保存
          let res = await _t.$store.dispatch(_t.$utils.store.getType('Users/add', 'Apps'), {
            ..._t.modalForm
          })
          _t.doSaveLoading = false
          if (!res || res.status !== 200) {
            return
          }
          // 处理返回数据
          if (res) {
            _t.$Message.success(res.msg || '保存成功！')
            // 关闭弹窗
            _t.handleCancel()
          }
        } else if (_t.currentAction === 'edit') {
          // 分发action，执行保存
          let res = await _t.$store.dispatch(_t.$utils.store.getType('Users/edit', 'Apps'), {
            ..._t.modalForm
          })
          _t.doSaveLoading = false
          res = _t.$utils.Serv.handleRes(_t, res, true)
          if (!res || res.status !== 200) {
            return
          }
          // 处理返回数据
          if (res) {
            _t.$Message.success(res.msg || '保存成功！')
            // 关闭弹窗
            _t.handleCancel()
            // 刷新列表
            _t.$utils.bus.$emit('Apps/Users/list/refresh')
          }
        }
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

        if (_t.currentAction === 'edit' && _t.backModalInfo && _t.backModalInfo.info) {
          _t.modalForm = {
            ..._t.defModalForm,
            ..._t.backModalInfo.info
          }
        } else {
          _t.modalForm = {
            ..._t.defModalForm
          }
        }
      },
      // 关闭弹窗
      handleCancel: function () {
        let _t = this
        // 初始化表单数据
        _t.initFormData()
        // 关闭弹窗
        _t.isShowModal = false
      }
    },
    created: async function () {
      let _t = this
      // 监听
      _t.$utils.bus.$on('Apps/Users/edit', function (data) {
        // 显示弹窗
        _t.isShowModal = true
        // 备份数据
        _t.backModalInfo = data
        // 初始化表单数据
        _t.initFormData()
      })
    },
    beforeDestroy: function () {
      let _t = this
      // 销毁监听
      _t.$utils.bus.$off('Apps/Users/edit')
    }
  }
</script>


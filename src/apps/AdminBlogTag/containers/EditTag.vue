/**
* Created by OXOYO on 2019/4/29.
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
    :title="$t(modalTitle[currentAction])"
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
      <FormItem :label="$t('L00178')" prop="name">
        <Input v-model="modalForm.name" :placeholder="$t('L00179')" style="width: 200px;"></Input>
      </FormItem>
      <FormItem :label="$t('L00180')" prop="alias">
        <Input v-model="modalForm.alias" :placeholder="$t('L00181')" style="width: 200px;"></Input>
      </FormItem>
      <FormItem :label="$t('L00182')" prop="description">
        <Input v-model="modalForm.description" :placeholder="$t('L00183')" type="textarea" :rows="4" style="width: 300px"></Input>
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
  export default {
    name: 'EditTag',
    data () {
      return {
        // 是否显示弹窗
        isShowModal: false,
        // 当前操作类型
        currentAction: '',
        // 弹窗标题
        modalTitle: {
          edit: 'L00123',
          add: 'L00122'
        },
        // 默认表单数据
        defModalForm: {
          name: '',
          alias: '',
          description: '',
          status: 1
        },
        // 表单数据
        modalForm: {},
        // 保存loading
        doSaveLoading: false,
        // 备份数据
        backModalInfo: {}
      }
    },
    computed: {
      // 表单校验规则
      modalFormRules () {
        let _t = this
        return {
          name: [
            {
              required: true,
              message: _t.$t('L00179'),
              trigger: 'blur'
            }
          ]
        }
      }
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
          ..._t.modalForm
        }
        // 按action类别分别处理
        if (_t.currentAction === 'add') {
          actionPath = 'Apps/AdminBlogTag/add'
        } else if (_t.currentAction === 'edit') {
          actionPath = 'Apps/AdminBlogTag/edit'
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
        _t.$X.utils.bus.$emit('Apps/AdminBlogTag/list/refresh')
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
          _t.modalForm = {
            ...defModalForm,
            ...backModalInfo
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
      }
    },
    created: async function () {
      let _t = this
      // 监听
      _t.$X.utils.bus.$on('Apps/AdminBlogTag/edit', async function (data) {
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
      _t.$X.utils.bus.$off('Apps/AdminBlogTag/edit')
    }
  }
</script>

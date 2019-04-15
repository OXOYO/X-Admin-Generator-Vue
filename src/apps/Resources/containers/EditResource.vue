/**
* Created by OXOYO on 2017/12/7.
*
* 新增/编辑 资源
*/

<style scoped lang="less" rel="stylesheet/less">

</style>

<template>
  <Modal
    v-model="isShowModal"
    :title="modalTitle[currentAction]"
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
      <FormItem label="资源名称" prop="name">
        <Input v-model="modalForm.name" placeholder="请输入资源名称（英文）" style="width: 400px;"></Input>
      </FormItem>
      <FormItem label="资源标题" prop="title">
        <Input v-model="modalForm.title" placeholder="请输入资源标题（中文/英文）" style="width: 400px;"></Input>
      </FormItem>
      <FormItem label="资源描述" prop="description">
        <Input v-model="modalForm.description" placeholder="请输入资源描述信息" type="textarea" :rows="4" style="width: 400px;"></Input>
      </FormItem>
      <FormItem label="资源图标" prop="icon">
        <Input v-model="modalForm.icon" placeholder="请输入资源图标" :icon="modalForm.icon" style="width: 200px;"></Input>
      </FormItem>
      <FormItem label="父ID" prop="parent_id">
        <InputNumber v-model="modalForm.parent_id" placeholder="请输入父节点ID，根节点为0" style="width: 200px;"></InputNumber>
      </FormItem>
      <FormItem label="序号" prop="num">
        <InputNumber v-model="modalForm.num" placeholder="请输入菜单顺序号，按升序排列" style="width: 200px;"></InputNumber>
      </FormItem>
      <FormItem label="资源类别" prop="type">
        <Radio-group v-model="modalForm.type" @on-change="handleResourceTypeChange">
          <Radio
            v-for="item in $X.config.resourceTypeList"
            v-if="item.enable"
            :key="item.name"
            :label="item.name"
          >
            {{ item.label }}
          </Radio>
        </Radio-group>
      </FormItem>
      <FormItem label="权限类别" prop="permission_type">
        <CheckboxGroup v-model="modalForm.permission_type">
          <Checkbox
            v-for="(item, index) in permissionTypeList"
            :key="index"
            :label="item.key"
          >
            <span>{{ item.label }}</span>
          </Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="外链模块链接" prop="url" v-show="modalForm.type === 'module-link'">
        <Input v-model="modalForm.url" placeholder="请输入外链模块连接"></Input>
      </FormItem>
      <FormItem label="新窗口打开" prop="target" v-show="modalForm.type === 'module-link'">
        <Radio-group v-model="modalForm.target">
          <Radio :label="0">否</Radio>
          <Radio :label="1">是</Radio>
        </Radio-group>
      </FormItem>
      <FormItem label="状态" prop="enable">
        <Radio-group v-model="modalForm.enable">
          <Radio :label="0">停用</Radio>
          <Radio :label="1">启用</Radio>
        </Radio-group>
      </FormItem>
      <FormItem label="侧边栏显示" prop="sidebar" v-show="modalForm.type !== 'action'">
        <Radio-group v-model="modalForm.sidebar">
          <Radio :label="0">隐藏</Radio>
          <Radio :label="1">显示</Radio>
        </Radio-group>
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
    name: 'EditResource',
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
          addChild: '新增子节点'
        },
        // 默认表单数据
        defModalForm: {
          title: '',
          name: '',
          icon: '',
          parent_id: 0,
          num: 0,
          type: 'module-app',
          url: '',
          target: 0,
          permission_type: [],
          enable: 1,
          sidebar: 1
        },
        // 表单数据
        modalForm: {},
        // 表单校验规则
        modalFormRules: {
          title: [
            {
              required: true,
              message: '请输入资源标题（中文/英文）',
              trigger: 'blur'
            }
          ],
          name: [
            {
              required: true,
              message: '请输入资源名称（英文）',
              trigger: 'blur'
            }
          ],
          description: [
            {
              required: true,
              message: '请输入资源描述',
              trigger: 'blur'
            }
          ],
          parent_id: [
            {
              required: true,
              type: 'number',
              message: '请输入父节点，根节点为0',
              trigger: 'blur'
            }
          ],
          permission_type: [
            {
              required: true,
              type: 'array',
              message: '请选择权限类别'
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
    computed: {
      ...mapState('Platform', {
        userInfo: state => state.userInfo,
        userClass: state => state.userClass
      }),
      permissionTypeList: function () {
        let _t = this
        return _t.$X.config.permissionTypeList.filter(item => item.enable && item.resourceType.includes(_t.modalForm.type))
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
        let actionPath = ''
        if (['add', 'addChild'].includes(_t.currentAction)) {
          actionPath = 'Apps/Resources/add'
        } else if (_t.currentAction === 'edit') {
          actionPath = 'Apps/Resources/edit'
        }
        if (actionPath) {
          // 分发action，执行保存
          let res = await _t.$store.dispatch(actionPath, {
            ..._t.modalForm,
            permission_type: _t.modalForm.permission_type.join(',')
          })
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
        let defModalForm = JSON.parse(JSON.stringify(_t.defModalForm))

        if (['edit', 'addChild'].includes(_t.currentAction) && _t.backModalInfo && _t.backModalInfo.info) {
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
      },
      handleResourceTypeChange: function (val) {
        let _t = this
        // 清空权限类别
        _t.modalForm.permission_type = []
        // 切换资源类别清空外链地址
        if (val !== 'module-link') {
          _t.modalForm.url = ''
        }
        if (val === 'action') {
          _t.modalForm.sidebar = 0
        }
      }
    },
    created: async function () {
      let _t = this
      // 监听
      _t.$X.utils.bus.$on('Apps/Resources/edit', function (data) {
        // 显示弹窗
        _t.isShowModal = true
        // 备份数据
        if (data && data.action && data.action === 'addChild') {
          _t.backModalInfo = {
            action: data.action,
            info: {
              parent_id: data.info.id
            }
          }
        } else {
          _t.backModalInfo = data
        }
        // 初始化表单数据
        _t.initFormData()
      })
    },
    beforeDestroy: function () {
      let _t = this
      // 销毁监听
      _t.$X.utils.bus.$off('Apps/Resources/edit')
    }
  }
</script>

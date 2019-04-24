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
    :title="$t(modalTitle[currentAction])"
    :mask-closable="true"
    :closable="true"
    :width="900"
    @on-cancel="handleCancel"
  >
    <Form
      ref="modalForm"
      :model="modalForm"
      :rules="formRules"
      :label-width="120"
    >
      <FormItem :label="$t('L00018')" prop="name">
        <Input v-model="modalForm.name" :placeholder="$t('L00019')" style="width: 400px;"></Input>
      </FormItem>
      <FormItem :label="$t('L00020')" prop="title">
        <Input v-model="modalForm.title" :placeholder="$t('L00021')" style="width: 400px;"></Input>
      </FormItem>
      <FormItem :label="$t('L00063')" prop="lang">
        <Input v-model="modalForm.lang" :placeholder="$t('L00064')" style="width: 400px;"></Input>
      </FormItem>
      <FormItem :label="$t('L00022')" prop="description">
        <Input v-model="modalForm.description" :placeholder="$t('L00023')" type="textarea" :rows="4" style="width: 400px;"></Input>
      </FormItem>
      <FormItem :label="$t('L00024')" prop="icon">
        <Input v-model="modalForm.icon" :placeholder="$t('L00025')" :icon="modalForm.icon" style="width: 200px;"></Input>
      </FormItem>
      <FormItem :label="$t('L00144')" prop="dir">
        <Input v-model="modalForm.dir" :placeholder="$t('L00145')" style="width: 400px;"></Input>
      </FormItem>
      <FormItem :label="$t('L00026')" prop="parent_id">
        <InputNumber v-model="modalForm.parent_id" :placeholder="$t('L00058')" style="width: 200px;"></InputNumber>
      </FormItem>
      <FormItem :label="$t('L00028')" prop="num">
        <InputNumber v-model="modalForm.num" :placeholder="$t('L00061')" style="width: 200px;"></InputNumber>
      </FormItem>
      <FormItem :label="$t('L00030')" prop="type">
        <Radio-group v-model="modalForm.type" @on-change="handleResourceTypeChange">
          <Radio
            v-for="item in $X.config.resourceTypeList.filter(item => item.enable)"
            :key="item.name"
            :label="item.name"
          >
            {{ item.lang ? $t(item.lang) : item.label }}
          </Radio>
        </Radio-group>
      </FormItem>
      <FormItem :label="$t('L00031')" prop="permission_type">
        <CheckboxGroup v-model="modalForm.permission_type">
          <Checkbox
            v-for="(item, index) in permissionTypeList"
            :key="index"
            :label="item.key"
          >
            <span>{{ item.lang ? $t(item.lang) : item.label }}</span>
          </Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem :label="$t('L00032')" prop="url" v-show="modalForm.type === 'module-link'">
        <Input v-model="modalForm.url" :placeholder="$t('L00033')"></Input>
      </FormItem>
      <FormItem :label="$t('L00034')" prop="target" v-show="modalForm.type === 'module-link'">
        <Radio-group v-model="modalForm.target">
          <Radio :label="0">{{ $t('L00104') }}</Radio>
          <Radio :label="1">{{ $t('L00103') }}</Radio>
        </Radio-group>
      </FormItem>
      <FormItem :label="$t('L00037')" prop="enable">
        <Radio-group v-model="modalForm.enable">
          <Radio :label="0">{{ $t('L00106') }}</Radio>
          <Radio :label="1">{{ $t('L00105') }}</Radio>
        </Radio-group>
      </FormItem>
      <FormItem :label="$t('L00146')" prop="position">
        <CheckboxGroup v-model="modalForm.position">
          <Checkbox
            v-for="(item, index) in positionTypeList"
            :key="index"
            :label="item.name"
          >
            <span>{{ item.lang ? $t(item.lang) : item.label }}</span>
          </Checkbox>
        </CheckboxGroup>
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
    name: 'EditResource',
    data () {
      return {
        // 是否显示弹窗
        isShowModal: false,
        // 当前操作类型
        currentAction: '',
        // 弹窗标题
        modalTitle: {
          edit: 'L00123',
          add: 'L00122',
          addChild: 'L00062'
        },
        // 默认表单数据
        defModalForm: {
          title: '',
          name: '',
          icon: '',
          dir: '',
          parent_id: 0,
          num: 0,
          type: 'module-app',
          url: '',
          target: 0,
          permission_type: [],
          enable: 1,
          position: ''
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
      ...mapState('Platform', {
        userInfo: state => state.userInfo,
        userClass: state => state.userClass
      }),
      permissionTypeList: function () {
        let _t = this
        return _t.$X.config.permissionTypeList.filter(item => item.enable && item.resourceType.includes(_t.modalForm.type))
      },
      positionTypeList: function () {
        let _t = this
        return _t.$X.config.positionTypeList.filter(item => item.enable)
      },
      // 表单校验规则
      formRules () {
        let _t = this
        return {
          title: [
            {
              required: true,
              message: _t.$t('L00021'),
              trigger: 'blur'
            }
          ],
          name: [
            {
              required: true,
              message: _t.$t('L00019'),
              trigger: 'blur'
            }
          ],
          parent_id: [
            {
              required: true,
              type: 'number',
              message: _t.$t('L00058'),
              trigger: 'blur'
            }
          ],
          permission_type: [
            {
              required: true,
              type: 'array',
              message: _t.$t('L00079')
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
        // 按action类别分别处理
        let actionPath = ''
        if (['add', 'addChild', 'copyAdd'].includes(_t.currentAction)) {
          actionPath = 'Apps/Resources/add'
        } else if (_t.currentAction === 'edit') {
          actionPath = 'Apps/Resources/edit'
        }
        if (!actionPath) {
          return
        }
        // 分发action，执行保存
        _t.doSaveLoading = true
        let res = await _t.$store.dispatch(actionPath, {
          ..._t.modalForm,
          permission_type: _t.modalForm.permission_type.join(','),
          position: _t.modalForm.position.join(',')
        })
        _t.doSaveLoading = false
        if (!res || res.code !== 200) {
          return
        }
        // 处理返回数据
        _t.$Message.success(res.msg)
        // 关闭弹窗
        _t.handleCancel()
        // 刷新列表
        _t.$X.utils.bus.$emit('Apps/Resources/list/refresh')
        // 刷新页面
        _t.$X.utils.bus.$emit('Platform/Admin/refresh')
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

        if (['edit', 'addChild', 'copyAdd'].includes(_t.currentAction) && _t.backModalInfo && _t.backModalInfo.info) {
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

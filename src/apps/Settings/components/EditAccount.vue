/**
* Created by OXOYO on 2019/4/23.
*
* EditAccount
*/

<style scoped lang="less" rel="stylesheet/less"></style>

<template>
  <Form
    ref="editForm"
    :model="editForm"
    :rules="editFormRules"
    label-position="top"
  >
    <FormItem :label="$t('L00154')" prop="oldPassword">
      <Input type="password" v-model="editForm.oldPassword" :placeholder="$t('L00155')" style="width: 200px;"></Input>
    </FormItem>
    <FormItem :label="$t('L00156')" prop="newPassword">
      <Input type="password" v-model="editForm.newPassword" :placeholder="$t('L00157')" style="width: 200px;"></Input>
    </FormItem>
    <FormItem :label="$t('L00158')" prop="confirmNewPassword">
      <Input type="password" v-model="editForm.confirmNewPassword" :placeholder="$t('L00159')" style="width: 200px;"></Input>
    </FormItem>
    <FormItem>
      <Button type="primary" :loading="doSaveLoading" @click="doSave">{{ $t('L00109') }}</Button>
    </FormItem>
  </Form>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'EditAccount',
  data () {
    return {
      // 保存loading
      doSaveLoading: false,
      editForm: {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      }
    }
  },
  computed: {
    ...mapState('Platform', {
      userInfo: state => state.userInfo
    }),
    // 表单校验规则
    editFormRules () {
      let _t = this
      return {
        oldPassword: [
          {
            required: true,
            message: _t.$t('L00155'),
            trigger: 'blur'
          },
          {
            pattern: _t.$X.config.system.passwordReg,
            message: _t.$t('L00160'),
            trigger: 'blur'
          }
        ],
        newPassword: [
          {
            required: true,
            message: _t.$t('L00157'),
            trigger: 'blur'
          },
          {
            pattern: _t.$X.config.system.passwordReg,
            message: _t.$t('L00160'),
            trigger: 'blur'
          }
        ],
        confirmNewPassword: [
          {
            required: true,
            message: _t.$t('L00159'),
            trigger: 'blur'
          },
          {
            pattern: _t.$X.config.system.passwordReg,
            message: _t.$t('L00160'),
            trigger: 'blur'
          },
          {
            validator: function (rule, value, callback) {
              if (value !== _t.editForm.newPassword) {
                callback(new Error(_t.$t('L00161')))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  methods: {
    // 执行保存
    async doSave () {
      let _t = this
      // 校验结果
      let validResult
      _t.$refs['editForm'].validate((valid) => {
        validResult = valid
      })
      if (validResult !== undefined && !validResult) {
        _t.$Message.error(_t.$t('L00136'))
        return
      }
      // 分发action，执行保存
      _t.doSaveLoading = true
      let res = await _t.$store.dispatch('Apps/Settings/Account/edit', {
        ..._t.editForm,
        id: _t.userInfo.id
      })
      _t.doSaveLoading = false
      if (!res || res.code !== 200) {
        return
      }
      // 处理返回数据
      _t.$Message.success(res.msg)
      // 刷新页面
      _t.$X.utils.bus.$emit('Platform/Admin/refresh')
    }
  }
}
</script>

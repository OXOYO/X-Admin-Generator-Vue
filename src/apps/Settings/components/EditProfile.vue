/**
* Created by yangfan9244 on 2019/4/23.
*
* EditProfile
*/

<style scoped lang="less" rel="stylesheet/less"></style>

<template>
  <Form
    ref="editForm"
    :model="editForm"
    :rules="editFormRules"
    label-position="top"
  >
    <FormItem :label="$t('L00049')" prop="account">
      <Input v-model="editForm.account" :placeholder="$t('L00045')" style="width: 200px;" @on-change="handleChange"></Input>
    </FormItem>
    <FormItem :label="$t('L00050')" prop="name">
      <Input v-model="editForm.name" :placeholder="$t('L00046')" style="width: 200px;" @on-change="handleChange"></Input>
    </FormItem>
    <FormItem>
      <Button type="primary" :disabled="!isChange" :loading="doSaveLoading" @click="doSave">{{ $t('L00109') }}</Button>
    </FormItem>
  </Form>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'EditProfile',
    data () {
      return {
        // 保存loading
        doSaveLoading: false,
        isChange: false
      }
    },
    computed: {
      ...mapState('Platform', {
        userInfo: state => state.userInfo
      }),
      editForm () {
        let _t = this
        let id = ''
        let account = ''
        let name = ''
        if (_t.userInfo) {
          id = _t.userInfo.id
          account = _t.userInfo.account
          name = _t.userInfo.name
        }
        return {
          id,
          account,
          name
        }
      },
      // 表单校验规则
      editFormRules () {
        let _t = this
        return {
          account: [
            {
              required: true,
              message: _t.$t('L00045'),
              trigger: 'blur'
            }
          ],
          name: [
            {
              required: true,
              message: _t.$t('L00046'),
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      handleChange: function () {
        let _t = this
        let keys = Object.keys(_t.editForm)
        let flag = false
        for (let i = 0, len = keys.length; i < len; i++) {
          let key = keys[i]
          if (_t.editForm[key] !== _t.userInfo[key]) {
            flag = true
            break
          }
        }
        _t.isChange = flag
      },
      // 执行保存
      doSave: async function () {
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
        let res = await _t.$store.dispatch('Apps/Settings/Profile/edit', _t.editForm)
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

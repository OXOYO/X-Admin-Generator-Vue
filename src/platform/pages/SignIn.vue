/**
* Created by OXOYO on 2019/4/4.
*
* SignIn
*/

<style scoped lang="less" rel="stylesheet/less">
  .login-modal {
    .login-modal-header {
      height: auto;
      text-align: center;
      .login-logo {
        display: block;
        width: auto;
        margin: 0 auto;
      }
      .login-title {
        display: inline-block;
        cursor: default;
        width: 100%;
        padding-top: 10px;
        font-size: 26px;
        font-weight: bolder;
        color: rgb(52, 117, 207);
      }
    }
    .login-modal-body {
      .login-form {
      }
    }
  }
</style>

<template>
  <Modal
    class="login-modal"
    :closable="false"
    :mask-closable="true"
    :width="300"
    v-model="isShowModal"
    @on-cancel="handleCancel"
  >
    <div slot="header" class="login-modal-header">
      <img class="login-logo" :src="$X.config.system.logo" :alt="$X.config.system.title">
      <!--<div class="login-title">{{ $X.config.system.subtitle }}</div>-->
    </div>
    <div class="login-modal-body">
      <Form class="login-form" ref="signInForm" :model="signInForm" :rules="signInFormRules">
        <Form-item prop="account">
          <Input type="text" v-model="signInForm.account" :placeholder="$t('SigIn.signInForm.account.placeholder')">
          <Icon type="md-person" slot="prepend" style="font-size: 16px;"></Icon>
          </Input>
        </Form-item>
        <Form-item prop="password">
          <Input :type="passwordInputType" v-model="signInForm.password" :placeholder="$t('SigIn.signInForm.password.placeholder')" @on-enter="handleSignIn">
          <Icon type="md-lock" slot="prepend" style="font-size: 16px;"></Icon>
          <Button slot="append" :icon="passwordInputType === 'password' ? 'md-eye' : 'md-eye-off'" style="font-size: 16px; line-height: 1;" @click="showPassword"></Button>
          </Input>
        </Form-item>
      </Form>
    </div>
    <div slot="footer">
      <Button type="primary" :loading="loading" @click="handleSignIn">{{ $t('SigIn.sigIn') }}</Button>
    </div>
  </Modal>
</template>

<script>
export default {
  name: 'SignIn',
  data () {
    return {
      // 是否显示登录弹窗
      isShowModal: false,
      loading: false,
      // 表单数据
      signInForm: {
        account: '',
        password: ''
      },
      // 密码输入框类型
      passwordInputType: 'password'
    }
  },
  computed: {
    signInFormRules () {
      let _t = this
      return {
        account: [
          { required: true, message: _t.$t('SigIn.signInForm.account.rules.required'), trigger: 'change' }
        ],
        password: [
          { required: true, message: _t.$t('SigIn.signInForm.password.rules.required'), trigger: 'change' },
          { type: 'string', min: 6, max: 16, message: _t.$t('SigIn.signInForm.password.rules.min_max'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleSignIn: async function () {
      let _t = this
      // 调用接口执行登录
      let res = await _t.$store.dispatch('platform/user/signIn', {
        account: _t.signInForm.account.trim(),
        password: _t.signInForm.password.trim()
      })
      if (!res || res.code !== 200) {
        return
      }
      let userInfo = res.data.userInfo || null
      let token = res.data[_t.$X.config.cookie.getItem('token')] || null
      console.log('userInfo', userInfo, token)
      if (userInfo && token) {
        _t.$Message.success('登录成功！')
        // 存储token信息
        _t.$store.commit('platform/userInfo/update', userInfo)
        _t.$X.Cookies.set(_t.$X.config.cookie.getItem('token'), token)
        _t.$nextTick(function () {
          _t.$router.push({name: 'platform.admin'})
        })
      } else {
        _t.$Message.error('登录失败，接口返回数据异常！')
      }
    },
    showPassword: function () {
      let _t = this
      _t.passwordInputType = _t.passwordInputType === 'password' ? 'text' : 'password'
    },
    handleCancel () {
      let _t = this
      _t.isShowModal = false
      _t.$nextTick(function () {
        _t.$router.push({name: 'platform.home'})
      })
    }
  },
  created () {
    let _t = this
    _t.isShowModal = true
  },
  beforeRouteLeave (to, from, next) {
    let _t = this
    // 销毁组件
    _t.$destroy()
    next()
  }
}
</script>

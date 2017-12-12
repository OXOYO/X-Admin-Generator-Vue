/**
* Created by OXOYO on 2017/12/5.
*
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
    v-model="showSignInModal"
    @on-cancel="closeSignInModal"
    title="登录"
  >
    <div slot="header" class="login-modal-header">
      <img class="login-logo" :src="$Config.System.logo" :alt="$Config.System.title">
      <div class="login-title">{{ $Config.System.subtitle }}</div>
    </div>
    <div class="login-modal-body">
      <Form class="login-form" ref="signInForm" :model="signInForm" :rules="signInFormRules">
        <Form-item prop="account">
          <Input type="text" v-model="signInForm.account" placeholder="请输入用户名">
          <Icon type="ios-person-outline" slot="prepend" style="font-size: 16px;"></Icon>
          </Input>
        </Form-item>
        <Form-item prop="password">
          <Input :type="passwordInputType" v-model="signInForm.password" placeholder="请输入密码" @on-enter="handleSignIn">
          <Icon type="ios-locked-outline" slot="prepend" style="font-size: 16px;"></Icon>
          <Button slot="append" :icon="passwordInputType === 'password' ? 'eye' : 'eye-disabled'" style="font-size: 16px; line-height: 1;" @click="showPassword"></Button>
          </Input>
        </Form-item>
      </Form>
    </div>
    <div slot="footer">
      <Button type="primary" :loading="loading" @click="handleSignIn">登录</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'SignIn',
    data () {
      return {
        // 是否显示登录弹窗
        showSignInModal: false,
        loading: false,
        // 表单数据
        signInForm: {
          account: '',
          password: ''
        },
        signInFormRules: {
          account: [
            { required: true, message: '请填写用户名', trigger: 'change' }
          ],
          password: [
            { required: true, message: '请填写密码', trigger: 'change' },
            { type: 'string', min: 6, max: 16, message: '密码长度必须在6到16位之间', trigger: 'change' }
          ]
        },
        // 密码输入框类型
        passwordInputType: 'password'
      }
    },
    methods: {
      handleSignIn: async function () {
        let _t = this
        // 调用接口执行登录
        let res = await _t.$store.dispatch(_t.$utils.store.getType('user/signIn', 'Platform'), {
          account: _t.signInForm.account.trim(),
          password: _t.signInForm.password.trim()
        })
        if (!res || res.status !== 200) {
          return
        }
        let userInfo = res.data.userInfo || null
        let token = res.data[_t.$Config.Cookie.getItem('token')] || null
        if (userInfo && token) {
          _t.$Message.success('登录成功！')
          // TODO 用户信息存入state；token存入sessionStorage；路由跳转
          _t.$store.commit(_t.$utils.store.getType('userInfo/update', 'Platform'), userInfo)
//          sessionStorage.setItem(_t.$Config.Cookie.getItem('token'), token)
          _t.$Cookies.set(_t.$Config.Cookie.getItem('token'), token)
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
      closeSignInModal: function () {
        let _t = this
        _t.showSignInModal = false
        _t.$nextTick(function () {
          _t.$router.push({name: 'platform.index'})
        })
      }
    },
    created: function () {
      let _t = this
      _t.showSignInModal = true
    },
    beforeRouteLeave: function (to, from, next) {
      let _t = this
      // 销毁组件
      _t.$destroy()
      next()
    }
  }
</script>


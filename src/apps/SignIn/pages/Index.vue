/**
* Created by OXOYO on 2017/12/5.
*
* SigIn 应用根组件
*/
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
          <Input type="text" v-model="signInForm.account" :placeholder="$t('L00003')">
            <Icon type="md-person" slot="prepend" style="font-size: 16px;"></Icon>
          </Input>
        </Form-item>
        <Form-item prop="password">
          <Input :type="passwordInputType" v-model="signInForm.password" :placeholder="$t('L00005')" @on-enter="handleSignIn">
            <Icon type="md-lock" slot="prepend" style="font-size: 16px;"></Icon>
            <Button slot="append" :icon="passwordInputType === 'password' ? 'md-eye' : 'md-eye-off'" style="font-size: 16px; line-height: 1;" @click="showPassword"></Button>
          </Input>
        </Form-item>
      </Form>
    </div>
    <div slot="footer">
      <Button type="primary" :loading="loading" @click="handleSignIn">{{ $t('L00001') }}</Button>
    </div>
  </Modal>
</template>

<script>
  import Store from '../store'

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
            { required: true, message: _t.$t('L00004'), trigger: 'change' }
          ],
          password: [
            { required: true, message: _t.$t('L00006'), trigger: 'change' },
            { type: 'string', min: 6, max: 16, message: _t.$t('L00007'), trigger: 'change' }
          ]
        }
      }
    },
    methods: {
      handleSignIn: async function () {
        let _t = this
        // 调用接口执行登录
        let res = await _t.$store.dispatch('Platform/user/signIn', {
          account: _t.signInForm.account.trim(),
          password: _t.signInForm.password.trim()
        })
        if (!res || res.code !== 200) {
          return
        }
        let userInfo = res.data.userInfo
        let token = res.data[_t.$X.config.cookie.getItem('token')]
        if (userInfo && token) {
          _t.$Message.success(_t.$t('L00008'))
          // 存储token信息
          _t.$store.commit('Platform/userInfo/update', userInfo)
          _t.$X.Cookies.set(_t.$X.config.cookie.getItem('token'), token)
          // 跳转后台
          _t.$nextTick(function () {
            _t.$router.push({ name: 'platform.admin' })
          })
        } else {
          _t.$Message.error(_t.$t('L00009'))
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
          _t.$router.push({ name: 'platform.home' })
        })
      }
    },
    created () {
      let _t = this
      _t.isShowModal = true
      // 将store注册到apps下
      _t.$store.registerModule(['Apps', Store.moduleName], Store.store)
    },
    beforeRouteLeave (to, from, next) {
      let _t = this
      // 销毁组件
      _t.$destroy()
      next()
    },
    destroyed () {
      let _t = this
      // 卸载store
      _t.$store.unregisterModule(['Apps', Store.moduleName])
    }
  }
</script>

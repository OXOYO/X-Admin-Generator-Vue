/**
 * Created by OXOYO on 2019/4/6.
 *
 */

export default {
  HomeNav: {
    sigin: '登录',
    about: '关于',
  },
  SigIn: {
    signInForm: {
      account: {
        placeholder: '请输入用户名',
        rules: {
          required: '请填写用户名'
        }
      },
      password: {
        placeholder: '请输入密码',
        rules: {
          required: '请填写密码',
          min_max: '密码长度必须在6到16位之间'
        }
      }
    },
    sigIn: '登录'
  }
}

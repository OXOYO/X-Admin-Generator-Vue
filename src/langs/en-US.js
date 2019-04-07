/**
 * Created by OXOYO on 2019/4/6.
 *
 */

export default {
  HomeNav: {
    sigin: 'SigIn',
    about: 'About'
  },
  SigIn: {
    signInForm: {
      account: {
        placeholder: 'Please enter your username',
        rules: {
          required: 'Please fill in the user name'
        }
      },
      password: {
        placeholder: 'Please input a password',
        rules: {
          required: 'Please fill in the password',
          min_max: 'Password length must be between 6 and 16 bits'
        }
      }
    },
    sigIn: 'SigIn'
  }
}

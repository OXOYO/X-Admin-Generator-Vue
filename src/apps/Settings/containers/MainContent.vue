/**
* Created by OXOYO on 2019/4/23.
*
* MainContent
*/

<style scoped lang="less" rel="stylesheet/less">
  .main-content-box {
    width: 100%;
    min-height: 500px;
    padding: 10px;
  }
</style>

<template>
  <div class="main-content-box">
    <component :is="currentComponent"></component>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import EditProfile from '../components/EditProfile'
  import EditAccount from '../components/EditAccount'

  export default {
    name: 'MainContent',
    computed: {
      ...mapState('Apps/Settings', {
        currentActiveName: state => state.currentActiveName
      }),
      currentComponent () {
        let _t = this
        let component
        switch (_t.currentActiveName) {
          case 'profile':
            component = EditProfile
            break
          case 'account':
            component = EditAccount
            break
        }
        return component
      }
    }
  }
</script>

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

  import TaskList from '../components/TaskList'

  export default {
    name: 'MainContent',
    computed: {
      ...mapState('Apps/TODO', {
        currentActiveName: state => state.currentActiveName,
        currentMenu: state => state.currentMenu
      }),
      currentComponent () {
        let _t = this
        let component
        switch (_t.currentMenu.type) {
          case 'category':
            component = TaskList
            break
        }
        return component
      }
    }
  }
</script>

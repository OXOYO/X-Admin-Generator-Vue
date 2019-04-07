/**
* Created by OXOYO on 2019/4/4.
*
* Home
*/

<style scoped lang="less" rel="stylesheet/less"></style>

<template>
  <!-- 系统首页 -->
  <div class="layout layout-home" :style="layoutStyle">
    <HomeNav></HomeNav>
    <HomeContent>
      <router-view></router-view>
      <Copyright></Copyright>
    </HomeContent>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import HomeNav from '../containers/HomeNav'
  import HomeContent from '../containers/HomeContent'

  export default {
    name: 'Home',
    components: {
      HomeNav,
      HomeContent
    },
    computed: {
      ...mapState('platform', {
        background: state => state.background
      }),
      layoutStyle () {
        let _t = this
        let style = {
          'background-color': '#54364a'
        }
        if (_t.background.name && _t.background.source) {
          style = {
            'background-size': 'cover',
            'background-image': `url(${_t.background.source})`
          }
        }
        return style
      }
    }
  }
</script>

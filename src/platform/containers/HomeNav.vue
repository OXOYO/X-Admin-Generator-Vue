/**
* Created by OXOYO on 2017/12/6.
*
* 前台导航栏
*/

<style scoped lang="less" rel="stylesheet/less">
  .home-nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: transparent;
    z-index: 1000;
    height: 60px;
    overflow: hidden;

    &:hover {
      background: #386ed3;
    }

    .ivu-menu-item {
      &:hover {
        color: #000;
      }
    }
    .nav-logo {
      height: 60px;
      overflow: hidden;
      text-align: center;
      float: left;
      position: relative;
      padding: 0 20px;

      a {
        line-height: 0;

        &:hover {
          color: #ff8300;
        }
      }
      img {
        width: 60px;
        height: 60px;
      }
    }
    .home-nav-menu {
      float: right;
      margin: 0 auto;

      li {
        &:hover {
          color: #fff !important;
          background: #184fb6;
        }
      }
    }
    .layout-assistant {
      width: 300px;
      margin: 0 auto;
      height: inherit;
    }
  }
</style>

<template>
  <div class="home-nav">
    <Menu class="nav" mode="horizontal" theme="light" @on-select="triggerMenu">
      <div class="nav-logo">
        <router-link :to="{ name: 'platform.home'}">
          <img :src="$X.config.system.logo" alt="">
        </router-link>
      </div>
      <div class="home-nav-menu">
        <template v-if="resourceMap['home-nav']">
          <MenuItem
            v-for="(item, index) in resourceMap['home-nav']"
            :key="index"
            :name="'home-nav' + '|' + index"
          >
            <Icon v-if="item.icon" :type="item.icon"></Icon>
            {{ item.lang ? $t(item.lang) : item.title }}
          </MenuItem>
        </template>
        <SwitchLang></SwitchLang>
        <SwitchBackground></SwitchBackground>
      </div>
    </Menu>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  import SwitchLang from '../components/SwitchLang'
  import SwitchBackground from '../components/SwitchBackground'

  export default {
    name: 'HomeNav',
    components: {
      SwitchLang,
      SwitchBackground
    },
    computed: {
      ...mapState('Platform', {
        resourceMap: state => state.home.resourceMap
      })
    },
    methods: {
      triggerMenu (name) {
        let _t = this
        if (name) {
          let [type, index] = name.split('|')
          if (type && parseInt(index) > -1) {
            let target = _t.resourceMap[type][index]
            if (['module-system', 'module-app'].includes(target.type)) {
              _t.$router.push({ name: target.name })
            } else if (['module-link'].includes(target.type)) {
              window.open(target.url, target.title)
            }
          }
        }
      }
    }
  }
</script>

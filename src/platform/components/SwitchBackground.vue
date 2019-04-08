/**
* Created by OXOYO on 2019/4/6.
*
*/

<style scoped lang="less" rel="stylesheet/less">
  .switch-box {
    display: inline-block;

    .switch-item {
      padding: 0 20px;
    }

    .current {
      display: inline-block;

      img {
        vertical-align: middle;
        padding: 0 5px;
      }
      i {
        vertical-align: middle;
      }
    }
  }
</style>

<template>
  <div class="switch-box">
    <Dropdown class="switch-item" trigger="click" @on-click="handleChange">
      <a href="javascript:void(0)" class="current">
        <img :src="background.source" alt="">
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem
          v-for="(source, key) in backgroundMap"
          :key="key"
          :name="key"
          :selected="key === background.name"
        >
          <img :src="source" alt="">
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  export default {
    name: 'SwitchBackground',
    data () {
      return {
        background: {
          name: '',
          source: null
        },
        backgroundMap: {
          a: require('../../assets/a.jpg'),
          b: require('../../assets/b.jpg'),
          c: require('../../assets/c.jpg'),
          d: require('../../assets/d.jpg'),
          e: require('../../assets/e.jpg'),
          f: require('../../assets/f.jpg'),
          g: require('../../assets/g.jpg'),
          h: require('../../assets/h.jpg'),
          i: require('../../assets/i.jpg'),
          j: require('../../assets/j.jpg')
        }
      }
    },
    computed: {
      cookieKey () {
        return this.$X.config.cookie.getItem('background')
      }
    },
    methods: {
      init () {
        let _t = this
        // 从cookie获取background
        let name = _t.$X.Cookies.get(_t.cookieKey)
        let keys = Object.keys(_t.backgroundMap)
        // 触发change
        _t.handleChange(name || keys[0])
      },
      handleChange (name) {
        let _t = this
        // 更新cookie
        _t.$X.Cookies.set(_t.cookieKey, name, {
          expires: 7,
          path: _t.$X.config.cookie.path
        })
        // 更新background
        _t.background = {
          name: name,
          source: _t.backgroundMap[name]
        }
        // 分发mutation，更新state
        _t.$store.commit('platform/background/switch', _t.background)
      }
    },
    created () {
      let _t = this
      _t.init()
    }
  }
</script>

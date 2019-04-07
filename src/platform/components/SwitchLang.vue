/**
* Created by OXOYO on 2019/4/6.
*
* i18n语言切换
*/

<style scoped lang="less" rel="stylesheet/less">
  .switch-lang {
    display: inline-block;
    padding: 0 20px;
  }
</style>

<template>
  <div class="switch-lang">
    <Dropdown @on-click="handleChange">
      <a href="javascript:void(0)">
        {{ localeLabel }}
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <DropdownMenu slot="list">
        <DropdownItem
          v-for="(label, key) in $X.langs.label"
          :key="key"
          :name="key"
          :selected="key === locale"
        >
          {{ label }}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
  import Vue from 'vue'
  export default {
    name: 'SwitchLang',
    data () {
      return {
        locale: ''
      }
    },
    computed: {
      localeLabel () {
        let _t = this
        return _t.$X.langs.label[_t.locale]
      }
    },
    methods: {
      init () {
        let _t = this
        _t.locale = _t.$X.locale
      },
      handleChange (name) {
        let _t = this
        // 更新cookie
        let key = _t.$X.config.cookie.getItem('locale')
        _t.$X.Cookies.set(key, name, {
          expires: 7,
          path: _t.$X.config.cookie.path
        })
        _t.$i18n.locale = _t.$X.langs.locale = _t.locale = name
      }
    },
    created () {
      let _t = this
      // 初始化
      _t.init()
    }
  }
</script>

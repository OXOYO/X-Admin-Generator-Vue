/**
* Created by OXOYO on 2019/4/8.
*
* AdminSidebar
*/

<style scoped lang="less" rel="stylesheet/less">
  .admin-sidebar {
    height: 100%;
  }
  .admin-logo {
    width: 100%;
    background: #5b6270;
    color: #fff;
    text-align: center;
    overflow: hidden;
    margin: 0;
    height: 64px;
    line-height: 64px;
    font-size: 20px;
    overflow: hidden;

    a {
      color: #fff;
      height: 30px;
      line-height: 30px;
    }
  }
  .menu-item span{
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }
  .menu-item i{
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }
  .collapsed-menu span{
    width: 0px;
    transition: width .2s ease;
  }
  .collapsed-menu i{
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }
</style>

<template>
  <Sider class="admin-sidebar" ref="Sider" hide-trigger collapsible :collapsed-width="78" :value="collapsed">
    <div class="admin-logo">
      <router-link :to="{ name: 'platform.admin'}">
        <template v-if="collapsed">
          <span>{{ $X.config.system.minTitle }}</span>
        </template>
        <template v-else>
          <span style="font-weight: bold;">{{ $X.config.system.subtitle }}</span>
        </template>
      </router-link>
    </div>
    <Menu active-name="1-2" theme="dark" width="auto" :class="['menu-item', collapsed ? 'collapsed-menu' : '']">
      <MenuItem name="1-1">
        <Icon type="ios-navigate"></Icon>
        <span>Option 1</span>
      </MenuItem>
      <MenuItem name="1-2">
        <Icon type="ios-search"></Icon>
        <span>Option 2</span>
      </MenuItem>
      <MenuItem name="1-3">
        <Icon type="ios-settings"></Icon>
        <span>Option 3</span>
      </MenuItem>
    </Menu>
  </Sider>
</template>

<script>
  export default {
    name: 'AdminSidebar',
    props: {
      collapsed: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

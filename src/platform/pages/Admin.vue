/**
* Created by OXOYO on 2019/4/4.
*
* Admin
*/

<style scoped lang="less" rel="stylesheet/less"></style>

<template>
  <div class="layout layout-admin">
    <AdminSidebar></AdminSidebar>
    <AdminContent></AdminContent>
  </div>
</template>

<script>
  import AdminSidebar from '../containers/AdminSidebar'
  import AdminContent from '../containers/AdminContent'

  export default {
    name: 'Admin',
    components: {
      AdminSidebar,
      AdminContent
    }
  }
</script>

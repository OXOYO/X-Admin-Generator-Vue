/**
* Created by OXOYO on 2018/8/31.
*
* 日志详情
*/

<style scoped lang="less" rel="stylesheet/less">

</style>

<template>
  <Modal
    class="detail-modal"
    v-model="isShowModal"
    :title="$t('L00017') + ' ' + detailInfo.requestId"
    :mask-closable="true"
    :closable="true"
    :width="900"
    @on-cancel="handleCancel"
  >
    <Form
      class="detail-form"
      :model="detailInfo"
    >
      <FormItem
        v-for="key in Object.keys(detailInfo).filter(k => !['_index', '_rowKey'].includes(k)).sort()"
        :prop="key"
        :key="key"
        class="detail-form-item"
      >
        <HighLight :ref="key" lang="Javascript" :title="key" :data="detailInfo[key]"></HighLight>
      </FormItem>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="handleCancel">{{ $t('L00113') }}</Button>
    </div>
  </Modal>
</template>

<script>
  export default {
    name: 'DetailLog',
    data () {
      return {
        // 是否显示弹窗
        isShowModal: false,
        // 详情
        detailInfo: {}
      }
    },
    methods: {
      init: function (detailInfo) {
        let _t = this
        _t.detailInfo = detailInfo
      },
      // 关闭弹窗
      handleCancel: function () {
        let _t = this
        // 清空备份数据
        _t.detailInfo = {}
        // 关闭弹窗
        _t.isShowModal = false
      }
    },
    mounted: async function () {
      let _t = this
      // 监听
      _t.$X.utils.bus.$on('Apps/SystemLog/detail', function (data) {
        // 初始化
        _t.init(data.info)
        // 显示弹窗
        _t.isShowModal = true
      })
    },
    beforeDestroy: function () {
      let _t = this
      // 销毁监听
      _t.$X.utils.bus.$off('Apps/SystemLog/detail')
    }
  }
</script>

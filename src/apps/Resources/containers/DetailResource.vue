/**
* Created by OXOYO on 2019/2/21.
*
* 资源详情
*/

<style scoped lang="less" rel="stylesheet/less">

</style>

<template>
  <Modal
    class="detail-modal"
    v-model="isShowModal"
    :title="$t('L00017')"
    :mask-closable="true"
    :closable="true"
    :width="900"
    @on-cancel="handleCancel"
  >
    <Form
      class="detail-form"
      :model="detailInfo"
      :label-width="120"
    >
      <template
        v-for="(key, index) in Object.keys(detailInfo).filter(k => !['_index', '_rowKey'].includes(k))"
      >
        <FormItem v-if="key === 'name'" :label="$t('L00018')" prop="name" :key="key + '_' + index">
          <Input v-model="detailInfo.name" :placeholder="$t('L00019')" readonly style="width: 400px;"></Input>
        </FormItem>
        <FormItem v-else-if="key === 'title'" :label="$t('L00020')" prop="title" :key="key + '_' + index">
          <Input v-model="detailInfo.title" :placeholder="$t('L00021')" readonly style="width: 400px;"></Input>
        </FormItem>
        <FormItem v-else-if="key === 'description'" :label="$t('L00022')" prop="description" :key="key + '_' + index">
          <Input v-model="detailInfo.description" :placeholder="$t('L00023')" type="textarea" :rows="4" readonly style="width: 400px;"></Input>
        </FormItem>
        <FormItem v-else-if="key === 'icon'" :label="$t('L00024')" prop="icon" :key="key + '_' + index">
          <Input v-model="detailInfo.icon" :placeholder="$t('L00025')" :icon="detailInfo.icon" readonly style="width: 200px;"></Input>
        </FormItem>
        <FormItem v-else-if="key === 'parent_id'" :label="$t('L00026')" prop="parent_id" :key="key + '_' + index">
          <Input v-model="detailInfo.parent_id" :placeholder="$t('L00027')" readonly style="width: 200px;"></Input>
        </FormItem>
        <FormItem v-else-if="key === 'num'" :label="$t('L00028')" prop="num" :key="key + '_' + index">
          <Input v-model="detailInfo.num" :placeholder="$t('L00029')" readonly style="width: 200px;"></Input>
        </FormItem>
        <FormItem v-else-if="key === 'type'" :label="$t('L00030')" prop="type" :key="key + '_' + index">
          <Radio-group v-model="detailInfo.type">
            <Radio
              v-for="item in $X.config.resourceTypeList.filter(item => item.enable && item.name === detailInfo.type)"
              :key="item.name"
              :label="item.name"
            >
              {{ item.lang ? $t(item.lang) : item.label }}
            </Radio>
          </Radio-group>
        </FormItem>
        <FormItem v-else-if="key === 'permission_type'" :label="$t('L00031')" prop="permission_type" :key="key + '_' + index">
          <CheckboxGroup v-model="detailInfo.permission_type" style="position: relative;">
            <div class="mask-disabled" @click.stop.prevent></div>
            <Checkbox
              v-for="(item, index) in permissionTypeList"
              :key="index"
              :label="item.key"
            >
              <span>{{ item.lang ? $t(item.lang) : item.label }}</span>
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem v-else-if="key === 'url'" :label="$t('L00032')" prop="url" v-show="detailInfo.type === 'module-link'" :key="key + '_' + index">
          <Input v-model="detailInfo.url" :placeholder="$t('L00033')" readonly></Input>
        </FormItem>
        <FormItem v-else-if="key === 'target'" :label="$t('L00034')" prop="target" v-show="detailInfo.type === 'module-link'" :key="key + '_' + index">
          <Radio-group v-model="detailInfo.target">
            <Radio :label="0" v-if="0 === detailInfo.target">{{ $t('L00104') }}</Radio>
            <Radio :label="1" v-if="1 === detailInfo.target">{{ $t('L00103') }}</Radio>
          </Radio-group>
        </FormItem>
        <FormItem v-else-if="key === 'enable'" :label="$t('L00037')" prop="enable" :key="key + '_' + index">
          <Radio-group v-model="detailInfo.enable">
            <Radio :label="0" v-if="0 === detailInfo.enable">{{ $t('L00106') }}</Radio>
            <Radio :label="1" v-if="1 === detailInfo.enable">{{ $t('L00105') }}</Radio>
          </Radio-group>
        </FormItem>
        <FormItem v-else-if="key === 'sidebar'" :label="$t('L00040')" prop="sidebar" v-show="detailInfo.type !== 'action'" :key="key + '_' + index">
          <Radio-group v-model="detailInfo.sidebar">
            <Radio :label="0" v-if="0 === detailInfo.sidebar">{{ $t('L00108') }}</Radio>
            <Radio :label="1" v-if="1 === detailInfo.sidebar">{{ $t('L00107') }}</Radio>
          </Radio-group>
        </FormItem>
        <FormItem  v-else-if="key === 'create_time'" :label="$t('L00043')" prop="create_time" :key="key + '_' + index">
          <div>{{ $X.moment(detailInfo[key]).format('YYYY-MM-DD hh:mm:ss') }}</div>
        </FormItem>
        <FormItem  v-else-if="key === 'update_time'" :label="$t('L00044')" prop="update_time" :key="key + '_' + index">
          <div>{{ $X.moment(detailInfo[key]).format('YYYY-MM-DD hh:mm:ss') }}</div>
        </FormItem>
        <FormItem  v-else :label="key" :prop="key" :key="key + '_' + index">
          <div>{{ detailInfo[key] }}</div>
        </FormItem>
      </template>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="handleCancel">{{ $t('L00113') }}</Button>
    </div>
  </Modal>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'DetailResource',
    data () {
      return {
        // 是否显示弹窗
        isShowModal: false,
        // 详情
        detailInfo: {}
      }
    },
    computed: {
      ...mapState('Platform', {
        userInfo: state => state.userInfo,
        userClass: state => state.userClass
      }),
      permissionTypeList: function () {
        let _t = this
        return _t.$X.config.permissionTypeList.filter(item => item.enable && item.resourceType.includes(_t.detailInfo.type) && _t.detailInfo.permission_type.includes(item.key))
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
      _t.$X.utils.bus.$on('Apps/Resources/detail', function (data) {
        // 初始化
        _t.init(data.info)
        // 显示弹窗
        _t.isShowModal = true
      })
    },
    beforeDestroy: function () {
      let _t = this
      // 销毁监听
      _t.$X.utils.bus.$off('Apps/Resources/detail')
    }
  }
</script>

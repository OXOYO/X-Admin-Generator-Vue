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
    title="详情"
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
        <FormItem v-if="key === 'name'" label="资源名称" prop="name" :key="key + '_' + index">
          <Input v-model="detailInfo.name" placeholder="资源名称（英文）" readonly style="width: 400px;"></Input>
        </FormItem>
        <FormItem v-else-if="key === 'title'" label="资源标题" prop="title" :key="key + '_' + index">
          <Input v-model="detailInfo.title" placeholder="资源标题（中文/英文）" readonly style="width: 400px;"></Input>
        </FormItem>
        <FormItem v-else-if="key === 'description'" label="资源描述" prop="description" :key="key + '_' + index">
          <Input v-model="detailInfo.description" placeholder="资源描述信息" type="textarea" :rows="4" readonly style="width: 400px;"></Input>
        </FormItem>
        <FormItem v-else-if="key === 'icon'" label="资源图标" prop="icon" :key="key + '_' + index">
          <Input v-model="detailInfo.icon" placeholder="资源图标" :icon="detailInfo.icon" readonly style="width: 200px;"></Input>
        </FormItem>
        <FormItem v-else-if="key === 'parent_id'" label="父ID" prop="parent_id" :key="key + '_' + index">
          <Input v-model="detailInfo.parent_id" placeholder="父节点ID，根节点为0" readonly style="width: 200px;"></Input>
        </FormItem>
        <FormItem v-else-if="key === 'num'" label="序号" prop="num" :key="key + '_' + index">
          <Input v-model="detailInfo.num" placeholder="菜单顺序号，按升序排列" readonly style="width: 200px;"></Input>
        </FormItem>
        <FormItem v-else-if="key === 'type'" label="资源类别" prop="type" :key="key + '_' + index">
          <Radio-group v-model="detailInfo.type">
            <Radio
              v-for="item in $X.config.resourceTypeList.filter(item => item.enable && item.name === detailInfo.type)"
              :key="item.name"
              :label="item.name"
            >
              {{ item.label }}
            </Radio>
          </Radio-group>
        </FormItem>
        <FormItem v-else-if="key === 'permission_type'" label="权限类别" prop="permission_type" :key="key + '_' + index">
          <CheckboxGroup v-model="detailInfo.permission_type" style="position: relative;">
            <div class="mask-disabled" @click.stop.prevent></div>
            <Checkbox
              v-for="(item, index) in permissionTypeList"
              :key="index"
              :label="item.key"
            >
              <span>{{ item.label }}</span>
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem v-else-if="key === 'url'" label="外链模块链接" prop="url" v-show="detailInfo.type === 'module-link'" :key="key + '_' + index">
          <Input v-model="detailInfo.url" placeholder="外链模块连接" readonly></Input>
        </FormItem>
        <FormItem v-else-if="key === 'target'" label="新窗口打开" prop="target" v-show="detailInfo.type === 'module-link'" :key="key + '_' + index">
          <Radio-group v-model="detailInfo.target">
            <Radio :label="0" v-if="0 === detailInfo.target">否</Radio>
            <Radio :label="1" v-if="1 === detailInfo.target">是</Radio>
          </Radio-group>
        </FormItem>
        <FormItem v-else-if="key === 'enable'" label="状态" prop="enable" :key="key + '_' + index">
          <Radio-group v-model="detailInfo.enable">
            <Radio :label="0" v-if="0 === detailInfo.enable">停用</Radio>
            <Radio :label="1" v-if="1 === detailInfo.enable">启用</Radio>
          </Radio-group>
        </FormItem>
        <FormItem v-else-if="key === 'sidebar'" label="侧边栏显示" prop="sidebar" v-show="detailInfo.type !== 'action'" :key="key + '_' + index">
          <Radio-group v-model="detailInfo.sidebar">
            <Radio :label="0" v-if="0 === detailInfo.sidebar">隐藏</Radio>
            <Radio :label="1" v-if="1 === detailInfo.sidebar">显示</Radio>
          </Radio-group>
        </FormItem>
        <FormItem  v-else-if="key === 'create_time'" label="创建时间" prop="create_time" :key="key + '_' + index">
          <div>{{ $X.moment(detailInfo[key]).format('YYYY-MM-DD hh:mm:ss') }}</div>
        </FormItem>
        <FormItem  v-else-if="key === 'update_time'" label="更新时间" prop="update_time" :key="key + '_' + index">
          <div>{{ $X.moment(detailInfo[key]).format('YYYY-MM-DD hh:mm:ss') }}</div>
        </FormItem>
        <FormItem  v-else :label="key" :prop="key" :key="key + '_' + index">
          <div>{{ detailInfo[key] }}</div>
        </FormItem>
      </template>
    </Form>
    <div slot="footer">
      <Button type="primary" @click="handleCancel">关闭</Button>
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

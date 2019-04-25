/**
* Created by OXOYO on 2019/4/25.
*
* TaskList
*/

<style lang="less" rel="stylesheet/less">
  .task-box {
    .header {
      .title {
        font-size: 20px;
        font-weight: bold;
      }
    }
    .body {
      margin: 20px 0;

      .input-block {
        width: 100%;

        input {
          border-top: none;
          border-right: none;
          border-left: none;

          &:hover,
          &:focus {
            box-shadow: none;
          }
        }

        .icon {
          cursor: pointer;
        }
      }
    }
  }
</style>

<template>
  <div class="task-box" v-if="Object.keys(currentMenu.info).length">
    <div class="header">
      <div class="title" :style="themeStyle">{{ currentMenu.info ? currentMenu.info.name : '' }}</div>
    </div>
    <div class="body">
      <div class="add-block">
        <Form
          ref="addForm"
          :model="addForm"
          inline
          @submit.native.prevent
        >
          <FormItem prop="content" style="width: 100%;">
            <Input
              class="input-block"
              v-model="addForm.content"
              :placeholder="$t('L00167')"
              size="large"
              @on-enter.stop.prevent="doAdd"
            >
              <Icon type="md-add" slot="prefix"/>
            </Input>
          </FormItem>
        </Form>
      </div>
      <div class="list-block">
        <Form
          inline
          @submit.native.prevent
        >
          <FormItem
            v-for="(item, index) in taskList"
            :key="index"
            style="width: 100%;"
          >
            <Input
              class="input-block"
              :value="item.content"
              readonly=""
              size="large"
            >
              <Icon
                class="icon"
                :style="themeStyle"
                :type="item.icon"
                slot="prefix"
                @mouseover.native="handleOver(index)"
                @mouseout.native="handleOut(index)"
                @click.native="handleClick(item)"
              />
            </Input>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'TaskList',
    data () {
      return {
        addForm: {},
        taskList: [],
        iconList: ['ios-radio-button-off', 'ios-checkmark-circle']
      }
    },
    computed: {
      ...mapState('Apps/TODO', {
        currentMenu: state => state.currentMenu
      }),
      themeStyle () {
        let _t = this
        if (_t.currentMenu.info && _t.currentMenu.info.theme) {
          return {
            color: _t.currentMenu.info.theme
          }
        }
        return {}
      }
    },
    methods: {
      init () {
        let _t = this
        _t.initAddForm()
        _t.getTaskList()
      },
      initAddForm () {
        let _t = this
        _t.addForm = {
          content: ''
        }
      },
      handleOut (index) {
        let _t = this
        if (_t.taskList[index].status) {
          _t.taskList[index].icon = 'ios-checkmark-circle'
        } else {
          _t.taskList[index].icon = 'ios-radio-button-off'
        }
      },
      handleOver (index) {
        let _t = this
        if (_t.taskList[index].status) {
          _t.taskList[index].icon = 'ios-checkmark-circle'
        } else {
          _t.taskList[index].icon = 'ios-checkmark-circle-outline'
        }
      },
      async handleClick (item) {
        let _t = this
        let oldStatus = item.status
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/TODO/task/edit', {
          id: item.id,
          // 0 停用 1 启用
          status: oldStatus ? 0 : 1
        })
        if (!res || res.code !== 200) {
          return
        }
        // 处理返回数据
        _t.$Message.success(oldStatus ? _t.$t('L00168') : _t.$t('L00169'))
        // 刷新列表
        _t.getTaskList()
      },
      async doAdd () {
        let _t = this
        if (!_t.addForm.content) {
          return
        }
        let res = await _t.$store.dispatch('Apps/TODO/task/add', {
          content: _t.addForm.content,
          category_id: _t.currentMenu.info.id
        })
        if (!res || res.code !== 200) {
          return
        }
        // 处理返回数据
        _t.$Message.success(res.msg)
        // 初始化表单
        _t.initAddForm()
        // 刷新列表
        _t.getTaskList()
      },
      // 获取任务列表
      async getTaskList () {
        let _t = this
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/TODO/task/list', {})
        if (!res || res.code !== 200) {
          return
        }
        // 处理返回数据
        if (res.data.count && res.data.list && res.data.list.length) {
          _t.$Message.success(res.msg)
        } else {
          _t.$Message.info(_t.$t('L00011'))
        }
        let resList = res.data.list || []
        // 处理icon
        for (let i = 0, len = resList.length; i < len; i++) {
          resList[i].icon = _t.iconList[resList[i].status]
        }
        _t.taskList = resList
      }
    },
    created () {
      let _t = this
      _t.init()
    }
  }
</script>

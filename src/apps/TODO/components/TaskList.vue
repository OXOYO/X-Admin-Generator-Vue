/**
* Created by OXOYO on 2019/4/25.
*
* TaskList
*/

<style lang="less" rel="stylesheet/less">
  .task-box {
    .header {
      .title {
        display: inline-block;
        font-size: 20px;
        font-weight: bold;
        vertical-align: middle;
      }
      .tools {
        display: inline-block;
        margin: 0 10px;

        .tool-item {
          display: inline-block;
        }
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
          color: inherit;

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
    .list-block {
      .input-block {
        .ivu-input-prefix {
          width: 170px;
        }
        .ivu-input-with-prefix {
          padding-left: 170px;
        }
        .ivu-rate {
          margin: 0 5px;
        }
      }
    }
  }
</style>

<template>
  <div class="task-box">
    <div class="header">
      <div class="title" :style="themeStyle">{{ currentCategory.info ? currentCategory.info.name : '' }}</div>
      <div class="tools">
        <ColorPicker
          v-if="currentCategory.info.create_user_id"
          class="tool-item"
          :transfer="false"
          v-model="currentTheme"
          @on-change="handleThemeChange"
        />
        <Dropdown
          v-if="currentCategory.info.create_user_id"
          class="tool-item"
          trigger="click"
          style="margin-left: 10px"
          @on-click="handleAction"
        >
          <a href="javascript:void(0)">
            <Icon type="ios-more" style="font-size: 20px;"/>
          </a>
          <DropdownMenu slot="list">
            <DropdownItem name="edit">{{ $t('L00171') }}</DropdownItem>
            <DropdownItem name="remove" style="color: #ed4014">{{ $t('L00124') }}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
    <div class="body">
      <div class="add-block">
        <Form
          :model="addForm"
          inline
          @submit.native.prevent
        >
          <FormItem prop="content" style="width: 100%;">
            <Input
              class="input-block"
              ref="addTask"
              v-model="addForm.content"
              :placeholder="$t('L00167')"
              size="large"
              :autofocus="true"
              @on-enter.stop.prevent="doAddTask"
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
          <template
            v-for="key in Object.keys(taskMap).sort().reverse()"
          >
            <FormItem
              v-for="(item, index) in taskMap[key]"
              :key="item.index"
              style="width: 100%;"
            >
              <Divider v-show="dividerMap[item.index]">
                <Icon type="ios-arrow-down" />
                {{ dividerMap[item.index] }}
              </Divider>
              <Input
                class="input-block"
                :value="'# ' + (index + 1) + ' ' + item.content"
                readonly
                size="large"
                :style="themeStyle"
              >
                <Icon
                  class="icon"
                  :style="themeStyle"
                  :type="item.icon"
                  slot="prefix"
                  @mouseover.native="handleOver(item.index)"
                  @mouseout.native="handleOut(item.index)"
                  @click.native="handleStatusChange(item)"
                />
                <Rate slot="prefix" v-model="item.star" @on-change="(value) => handleStarChange(item, value)"/>
              </Input>
            </FormItem>
          </template>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TaskList',
    data () {
      return {
        addForm: {},
        taskList: [],
        taskMap: {},
        iconList: ['ios-radio-button-off', 'ios-checkmark-circle'],
        currentCategory: {
          type: '',
          info: {}
        },
        currentTheme: '',
        dividerMap: {}
      }
    },
    computed: {
      themeStyle () {
        let _t = this
        if (_t.currentTheme) {
          return {
            color: _t.currentTheme
          }
        }
        return {}
      }
    },
    methods: {
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
      async handleStatusChange (item) {
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
        // 获取列表
        _t.getTaskList()
      },
      async handleStarChange (item, value) {
        let _t = this
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/TODO/task/edit', {
          id: item.id,
          star: value
        })
        if (!res || res.code !== 200) {
          return
        }
        // 处理返回数据
        _t.$Message.success(res.msg)
        // 获取列表
        _t.getTaskList()
      },
      async handleThemeChange () {
        let _t = this
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/TODO/category/edit', {
          id: _t.currentCategory.info.id,
          theme: _t.currentTheme
        })
        if (!res || res.code !== 200) {
          return
        }
        // 处理返回数据
        _t.$Message.success(res.msg)
        // 广播事件，刷新侧边栏
        _t.$X.utils.bus.$emit('Apps/TODO/Sidebar/refresh')
      },
      async doAddTask () {
        let _t = this
        if (!_t.addForm.content) {
          return
        }
        let res = await _t.$store.dispatch('Apps/TODO/task/add', {
          content: _t.addForm.content,
          category_id: _t.currentCategory.info.id
        })
        if (!res || res.code !== 200) {
          return
        }
        // 处理返回数据
        _t.$Message.success(res.msg)
        // 初始化表单
        _t.initAddForm()
        // 获取列表
        _t.getTaskList()
      },
      // 获取任务列表
      async getTaskList () {
        let _t = this
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/TODO/task/list', {
          category_id: _t.currentCategory.info.id
        })
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
        let dividerMap = {}
        let taskMap = {}
        for (let i = 0, len = resList.length; i < len; i++) {
          // 存储索引
          resList[i].index = i
          // 处理icon
          resList[i].icon = _t.iconList[resList[i].status]
          let currentItemDate = _t.$X.moment(resList[i].create_time).format('YYYY-MM-DD')
          if (!Object.values(dividerMap).includes(currentItemDate)) {
            dividerMap[i] = currentItemDate
          }
          if (!taskMap[currentItemDate]) {
            taskMap[currentItemDate] = []
          }
          taskMap[currentItemDate].push(resList[i])
        }
        _t.taskList = resList
        _t.taskMap = taskMap
        _t.dividerMap = dividerMap
      },
      handleAction (name) {
        let _t = this
        switch (name) {
          case 'edit':
            _t.handleEditCategory()
            break
          case 'remove':
            _t.handleRemoveCategory()
            break
        }
      },
      handleEditCategory () {
        let _t = this
        // 广播事件
        _t.$X.utils.bus.$emit('Apps/TODO/Sidebar/category/edit', _t.currentCategory)
      },
      handleRemoveCategory () {
        let _t = this
        // 删除用户列表中所选用户
        _t.$Modal.confirm({
          title: _t.$t('L00141'),
          content: _t.$t('L00060'),
          onOk: async function () {
            let res = await _t.$store.dispatch('Apps/TODO/category/remove', {
              id: _t.currentCategory.info.id
            })
            if (!res || res.code !== 200) {
              return
            }
            _t.$Message.info(res.msg)
            // 广播事件，刷新侧边栏
            _t.$X.utils.bus.$emit('Apps/TODO/Sidebar/refresh')
          }
        })
      },
      handleCategoryTrigger (data) {
        let _t = this
        _t.currentCategory = data
        _t.currentTheme = data.info && data.info.theme ? data.info.theme : ''
        // 初始化表单
        _t.initAddForm()
        // 获取列表
        _t.getTaskList()
        _t.$nextTick(function () {
          if (_t.$refs.addTask && _t.$refs.addTask.autofocus) {
            _t.$refs.addTask.focus()
          }
        })
      }
    },
    created () {
      let _t = this
      // 监听事件
      _t.$X.utils.bus.$on('Apps/TODO/Sidebar/category/trigger', function (data) {
        _t.handleCategoryTrigger(data)
      })
    },
    beforeDestroy: function () {
      let _t = this
      // 销毁监听
      _t.$X.utils.bus.$off('Apps/TODO/Sidebar/category/trigger')
    }
  }
</script>

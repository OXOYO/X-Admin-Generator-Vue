/**
* Created by OXOYO on 2018/8/30.
*
*/

<style scoped lang="less" rel="stylesheet/less">
</style>

<template>
  <div class="search-panel">
    <Tabs class="tabs-box" v-model="currentTab" @on-click="handleTabChange">
      <Tab-pane label="模糊查询" name="fuzzyQuery">
        <Collapse v-model="currentActivePanel" class="search-form-collapse">
          <Panel name="searchForm">
            <span class="panel-header">查询条件</span>
            <Row slot="content">
              <Col :xs="24" :sm="24" :md="12" :lg="8">
                <Form
                  class="search-form"
                  :model="searchForm"
                  ref="fuzzyQuery"
                  :label-width="120"
                  style="width: 500px;"
                  @submit.native.prevent
                >
                  <FormItem label="日志类别">
                    <Select v-model="searchForm.logType" style="width: 200px;" placeholder="请选择日志类别">
                      <Option
                        v-for="item in logTypeList"
                        :value="item.name"
                        :key="item.name"
                        :label="item.name"
                      >
                        {{ item.name }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="日期">
                    <DatePicker v-model="searchForm.date" type="date" transfer placeholder="请选择日期" style="width: 300px"></DatePicker>
                  </FormItem>
                  <FormItem label="接口名称">
                    <Input type="text" v-model="searchForm.origin" placeholder="请输入接口名称"></Input>
                  </FormItem>
                  <FormItem label="请求方式">
                    <Select v-model="searchForm.method" multiple transfer style="width: 200px;" placeholder="请选择请求方式">
                      <Option
                        v-for="item in methodList"
                        :value="item.value"
                        :key="item.value"
                        :label="item.label"
                      >
                        {{ item.label }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="响应状态">
                    <Input type="text" v-model="searchForm.status" placeholder="请输入接口响应状态，多个请用英文逗号分隔"></Input>
                  </FormItem>
                  <FormItem label="报文过滤">
                    <Input
                      v-model="searchForm.filterKeywords"
                      placeholder="请输入关键词"
                      @on-enter.stop.prevent="doSearch"
                    >
                      <Select v-model="searchForm.filterType" slot="prepend" style="width: 120px">
                        <Option value="request">request 报文</Option>
                        <Option value="response">respons 报文</Option>
                      </Select>
                    </Input>
                  </FormItem>
                  <FormItem label="用户过滤">
                    <Input
                      v-model="searchForm.filterUserKeywords"
                      :placeholder="searchForm.filterUserType === 'account' ? '请输入OA账号' : '请输入姓名'"
                      @on-enter.stop.prevent="doSearch"
                    >
                      <Select v-model="searchForm.filterUserType" slot="prepend" style="width: 120px">
                        <Option value="account">OA账号</Option>
                        <Option value="name">姓名</Option>
                      </Select>
                    </Input>
                  </FormItem>
                  <FormItem label="用户级别">
                    <CheckboxGroup v-model="searchForm.userType">
                      <Checkbox :label="2">
                        <Icon :type="userClass[2]['icon']"></Icon>
                        <span>普通用户</span>
                      </Checkbox>
                      <Checkbox :label="1">
                        <Icon :type="userClass[1]['icon']"></Icon>
                        <span>管理员</span>
                      </Checkbox>
                      <Checkbox :label="0">
                        <Icon :type="userClass[0]['icon']"></Icon>
                        <span>超级管理员</span>
                      </Checkbox>
                    </CheckboxGroup>
                  </FormItem>
                  <FormItem>
                    <Button type="primary" @click="() => doSearch(true)" :loading="doSearchLoading">查询</Button>
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </Panel>
          <Panel name="searchResult">
            <span class="panel-header">查询结果</span>
            <div slot="content">
              <Table
                class="search-form-table"
                v-if="tableData.length"
                :data="tableData"
                :columns="tableColumns"
              ></Table>
            </div>
          </Panel>
        </Collapse>
      </Tab-pane>
      <Tab-pane label="精确查询" name="exactQuery">
        <Collapse v-model="currentActivePanel" class="search-form-collapse">
          <Panel name="searchForm">
            <span class="panel-header">查询条件</span>
            <Row slot="content">
              <Col :xs="24" :sm="24" :md="12" :lg="8">
                <Form
                  class="search-form"
                  ref="exactQuery"
                  :model="searchForm"
                  :rules="searchFormRules.exactQuery"
                  :label-width="120"
                  style="width: 500px;"
                  @submit.native.prevent
                >
                  <FormItem label="日志类别">
                    <Select v-model="searchForm.logType" style="width: 200px;" placeholder="请选择日志类别">
                      <Option
                        v-for="item in logTypeList"
                        :value="item.name"
                        :key="item.name"
                        :label="item.name"
                      >
                        {{ item.name }}
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem label="日期">
                    <DatePicker v-model="searchForm.date" type="date" transfer placeholder="请选择日期" style="width: 300px"></DatePicker>
                  </FormItem>
                  <FormItem label="请求ID" prop="requestId">
                    <Input type="text" v-model="searchForm.requestId" placeholder="请输入请求ID"></Input>
                  </FormItem>
                  <FormItem>
                    <Button type="primary" @click="() => doSearch(true)" :loading="doSearchLoading">查询</Button>
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </Panel>
          <Panel name="searchResult">
            <span class="panel-header">查询结果</span>
            <div slot="content">
              <Table
                class="search-form-table"
                v-if="tableData.length"
                :data="tableData"
                :columns="tableColumns"
              ></Table>
            </div>
          </Panel>
        </Collapse>
      </Tab-pane>
    </Tabs>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'SearchLogs',
    data () {
      let _t = this
      let methodList = [
        {
          label: 'GET',
          value: 'GET'
        },
        {
          label: 'POST',
          value: 'POST'
        },
        {
          label: 'PUT',
          value: 'PUT'
        },
        {
          label: 'DELETE',
          value: 'DELETE'
        },
        {
          label: 'OPTIONS',
          value: 'OPTIONS'
        }
      ]
      return {
        searchForm: {
          filterKeywords: '',
          filterType: 'request',
          filterUserKeywords: '',
          filterUserType: 'account',
          status: '',
          userType: [],
          logType: 'result',
          origin: '',
          method: ['GET'],
          date: new Date(),
          requestId: ''
        },
        doSearchLoading: false,
        searchFormRules: {
          exactQuery: {
            requestId: [
              {
                required: true,
                message: '请输入请求ID'
              }
            ]
          }
        },
        tableColumns: [
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: 'requestId',
            key: 'requestId'
          },
          {
            title: 'userInfo',
            key: 'userInfo',
            render: (h, params) => {
              let userInfo = params.row['userInfo']
              let text = '-'
              if (userInfo && Object.keys(userInfo).length) {
                text = userInfo.account + ' ' + userInfo.name
              }
              return h('span', text)
            }
          },
          {
            title: 'method',
            key: 'method',
            filters: methodList,
            // filterMultiple: false,
            filterMethod: (value, row) => {
              return row.method === value
            }
          },
          {
            title: 'api',
            key: 'origin',
            render: (h, params) => {
              let method = params.row['method'] || ''
              let origin = params.row['origin'] || '-'
              let text
              if (method && ['GET', 'OPTIONS'].includes(method.toUpperCase())) {
                text = origin.split('?')[0]
              } else {
                text = origin
              }
              return h('span', text)
            }
          },
          {
            title: 'responseStatus',
            key: 'responseStatus'
          },
          {
            title: 'responseTime',
            key: 'responseTime',
            sortable: true
          },
          {
            title: 'create_at',
            key: 'create_at',
            sortable: true,
            render: (h, params) => {
              return h('span', _t.$X.moment(params.row['create_time']).format('YYYY-MM-DD hh:mm:ss'))
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 80,
            render: (h, params) => {
              let btnArr = [
                h('Button', {
                  props: {
                    size: 'small'
                  },
                  style: {
                    margin: '2px'
                  },
                  on: {
                    click: () => {
                      _t.handleAction('detail', params.row)
                    }
                  }
                }, '详情')
              ]
              return h('div', btnArr)
            }
          }
        ],
        tableData: [],
        // 选中行信息
        selectedRowData: [],
        logTypeList: [
          {
            name: 'error'
          },
          {
            name: 'result'
          }
        ],
        methodList: methodList,
        // 当前激活的面板
        currentActivePanel: ['searchForm', 'searchResult'],
        currentTab: 'fuzzyQuery'
      }
    },
    computed: {
      ...mapState('Platform', {
        userClass: state => state.userClass
      })
    },
    methods: {
      // 执行查询
      doSearch: function (isShowResutl) {
        let _t = this
        if (_t.currentTab === 'exactQuery') {
          // 校验结果
          let validResult
          _t.$refs['exactQuery'].validate((valid) => {
            validResult = valid
          })
          if (validResult !== undefined && !validResult) {
            _t.$Message.error('表单验证失败！')
            return
          }
        }
        if (isShowResutl) {
          _t.currentActivePanel = ['searchResult']
        }
        // 查询列表
        _t.initList()
        return false
      },
      // 初始化列表，获取第一页数据
      initList: function (isResetSearchForm) {
        let _t = this
        // 处理查询条件
        if (isResetSearchForm) {
          _t.resetSearchForm()
        }
        // 调接口，初始化数据
        _t.getLogList()
      },
      getLogList: async function () {
        let _t = this
        // 分发action，调接口
        _t.doSearchLoading = true
        let res = await _t.$store.dispatch('Apps/SystemLog/list', {
          ..._t.searchForm,
          date: _t.$X.moment(_t.searchForm.date).format('YYYY-MM-DD')
        })
        _t.doSearchLoading = false
        if (!res || res.code !== 200) {
          return
        }
        // 处理返回数据
        if (res.data && res.data.list && res.data.list.length) {
          _t.$Message.success(res.msg || '查询日志列表成功！')
        } else {
          _t.$Message.info('暂无数据！')
        }
        // 更新表格数据
        _t.tableData = res.data.list || []
      },
      handleAction: function (action, item) {
        let _t = this
        let handleDetail = function () {
          // 广播事件
          _t.$X.utils.bus.$emit('Apps/SystemLog/detail', {
            action: 'detail',
            info: item
          })
        }
        switch (action) {
          case 'detail':
            handleDetail()
            break
        }
      },
      handleTabChange: function () {
        let _t = this
        // 清空结果
        _t.tableData = []
        // 重置面板
        _t.currentActivePanel = ['searchForm', 'searchResult']
        // 重置searchForm
        _t.resetSearchForm()
      },
      resetSearchForm: function () {
        let _t = this
        // 重置searchForm
        _t.searchForm = {
          filterKeywords: '',
          filterType: 'request',
          filterUserKeywords: '',
          filterUserType: 'account',
          status: '',
          userType: [],
          logType: 'result',
          origin: '',
          method: ['GET'],
          date: new Date(),
          requestId: ''
        }
      }
    },
    created: async function () {
      let _t = this
      // 监听
      _t.$X.utils.bus.$on('Apps/SystemLog/list/init', function () {
        // 初始化列表
        // _t.initList(true)
      })
      _t.$X.utils.bus.$on('Apps/SystemLog/list/refresh', function () {
        // 初始化列表
        _t.initList()
      })
    },
    beforeDestroy: function () {
      let _t = this
      // 销毁监听
      _t.$X.utils.bus.$off('Apps/SystemLog/list/init')
      _t.$X.utils.bus.$off('Apps/SystemLog/list/refresh')
    }
  }
</script>

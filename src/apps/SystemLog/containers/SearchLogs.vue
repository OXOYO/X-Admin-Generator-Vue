/**
* Created by OXOYO on 2018/8/30.
*
*/

<style scoped lang="less" rel="stylesheet/less">
</style>

<template>
  <div class="search-panel">
    <Tabs class="tabs-box" v-model="currentTab" @on-click="handleTabChange">
      <Tab-pane :label="$t('L00080')" name="fuzzyQuery">
        <Collapse v-model="currentActivePanel" class="search-form-collapse">
          <Panel name="searchForm">
            <span class="panel-header">{{ $t('L00082') }}</span>
            <Row slot="content">
              <Col :xs="24" :sm="24" :md="12" :lg="8">
                <Form
                  class="search-form"
                  ref="fuzzyQuery"
                  :model="searchForm"
                  :rules="formRules.fuzzyQuery"
                  :label-width="120"
                  style="width: 500px;"
                  @submit.native.prevent
                >
                  <FormItem :label="$t('L00084')">
                    <Select v-model="searchForm.logType" style="width: 200px;" :placeholder="$t('L00085')">
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
                  <FormItem :label="$t('L00086')" prop="date">
                    <DatePicker v-model="searchForm.date" type="date" transfer :placeholder="$t('L00087')" style="width: 300px"></DatePicker>
                  </FormItem>
                  <FormItem :label="$t('L00088')">
                    <Input type="text" v-model="searchForm.origin" :placeholder="$t('L00089')"></Input>
                  </FormItem>
                  <FormItem :label="$t('L00090')">
                    <Select v-model="searchForm.method" multiple transfer style="width: 200px;" :placeholder="$t('L00091')">
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
                  <FormItem :label="$t('L00092')">
                    <Input type="text" v-model="searchForm.status" :placeholder="$t('L00093')"></Input>
                  </FormItem>
                  <FormItem :label="$t('L00094')">
                    <Input
                      v-model="searchForm.filterKeywords"
                      :placeholder="$t('L00095')"
                      @on-enter.stop.prevent="doSearch"
                    >
                      <Select v-model="searchForm.filterType" slot="prepend" style="width: 120px">
                        <Option value="request">{{ $t('L00096') }}</Option>
                        <Option value="response">{{ $t('L00097') }}</Option>
                      </Select>
                    </Input>
                  </FormItem>
                  <FormItem :label="$t('L00098')">
                    <Input
                      v-model="searchForm.filterUserKeywords"
                      :placeholder="$t(placeholderMap[searchForm.filterUserType])"
                      @on-enter.stop.prevent="doSearch"
                    >
                      <Select v-model="searchForm.filterUserType" slot="prepend" style="width: 120px">
                        <Option value="account">{{ $t('L00049') }}</Option>
                        <Option value="name">{{ $t('L00050') }}</Option>
                      </Select>
                    </Input>
                  </FormItem>
                  <FormItem :label="$t('L00099')">
                    <CheckboxGroup v-model="searchForm.userType">
                      <Checkbox
                        v-for="(item, index) in userClass.filter(item => item.enable)"
                        :key="index"
                        :label="item.type"
                      >
                        <Icon :type="item.icon"></Icon>
                        <span>{{ $t(item.lang) }}</span>
                      </Checkbox>
                    </CheckboxGroup>
                  </FormItem>
                  <FormItem>
                    <Button type="primary" @click="() => doSearch(true)" :loading="doSearchLoading">{{ $t('L00120') }}</Button>
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </Panel>
          <Panel name="searchResult">
            <span class="panel-header">{{ $t('L00083') }}</span>
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
      <Tab-pane :label="$t('L00081')" name="exactQuery">
        <Collapse v-model="currentActivePanel" class="search-form-collapse">
          <Panel name="searchForm">
            <span class="panel-header">{{ $t('L00082') }}</span>
            <Row slot="content">
              <Col :xs="24" :sm="24" :md="12" :lg="8">
                <Form
                  class="search-form"
                  ref="exactQuery"
                  :model="searchForm"
                  :rules="formRules.exactQuery"
                  :label-width="120"
                  style="width: 500px;"
                  @submit.native.prevent
                >
                  <FormItem :label="$t('L00084')">
                    <Select v-model="searchForm.logType" style="width: 200px;" :placeholder="$t('L00085')">
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
                  <FormItem :label="$t('L00086')" prop="date">
                    <DatePicker v-model="searchForm.date" type="date" transfer :placeholder="$t('L00087')" style="width: 300px"></DatePicker>
                  </FormItem>
                  <FormItem :label="$t('L000100')" prop="requestId">
                    <Input type="text" v-model="searchForm.requestId" :placeholder="$t('L00142')"></Input>
                  </FormItem>
                  <FormItem>
                    <Button type="primary" @click="() => doSearch(true)" :loading="doSearchLoading">{{ $t('L00120') }}</Button>
                  </FormItem>
                </Form>
              </Col>
            </Row>
          </Panel>
          <Panel name="searchResult">
            <span class="panel-header">{{ $t('L00083') }}</span>
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
      return {
        placeholderMap: {
          account: 'L00045',
          name: 'L00046'
        },
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
        methodList: [
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
        ],
        // 当前激活的面板
        currentActivePanel: ['searchForm', 'searchResult'],
        currentTab: 'fuzzyQuery'
      }
    },
    computed: {
      ...mapState('Platform', {
        userClass: state => state.userClass
      }),
      formRules () {
        let _t = this
        return {
          fuzzyQuery: {
            date: [
              {
                required: true,
                message: _t.$t('L00087')
              }
            ]
          },
          exactQuery: {
            date: [
              {
                required: true,
                message: _t.$t('L00087')
              }
            ],
            requestId: [
              {
                required: true,
                message: _t.$t('L00142')
              }
            ]
          }
        }
      },
      tableColumns () {
        let _t = this
        return [
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
            filters: _t.methodList,
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
            title: _t.$t('L00092'),
            key: 'responseStatus'
          },
          {
            title: _t.$t('L00143'),
            key: 'responseTime',
            sortable: true
          },
          {
            title: _t.$t('L00043'),
            key: 'create_at',
            sortable: true,
            render: (h, params) => {
              return h('span', _t.$X.moment(params.row['create_time']).format('YYYY-MM-DD hh:mm:ss'))
            }
          },
          {
            title: _t.$t('L00129'),
            key: 'action',
            width: 100,
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
                }, _t.$t('L00017'))
              ]
              return h('div', btnArr)
            }
          }
        ]
      }
    },
    methods: {
      // 执行查询
      doSearch: function (isShowResutl) {
        let _t = this
        // 校验结果
        let validResult
        _t.$refs[_t.currentTab].validate((valid) => {
          validResult = valid
        })
        if (validResult !== undefined && !validResult) {
          _t.$Message.error(_t.$t('L00136'))
          return
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
          _t.$Message.success(res.msg)
        } else {
          _t.$Message.info(_t.$t('L00011'))
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
        // 清空校验
        _t.$refs[_t.currentTab].resetFields()
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
      _t.$X.utils.bus.$on('Apps/SystemLog/list/refresh', function () {
        // 初始化列表
        _t.initList()
      })
    },
    beforeDestroy: function () {
      let _t = this
      // 销毁监听
      _t.$X.utils.bus.$off('Apps/SystemLog/list/refresh')
    }
  }
</script>

/**
* Created by OXOYO on 2019/4/29.
*
* 查询用户
*/

<style scoped lang="less" rel="stylesheet/less">

</style>

<template>
  <div class="search-panel">
    <Form
      class="search-form"
      inline
      :model="searchForm"
      @submit.native.prevent
    >
      <FormItem>
        <Input
          v-model="searchForm.keywords"
          :placeholder="$t(placeholderMap[searchForm.filterType])"
          @on-enter.stop.prevent="doSearch"
          style="width: 400px;"
        >
          <Select v-model="searchForm.filterType" slot="prepend" style="width: 120px">
            <Option value="name">{{ $t('L00178') }}</Option>
          </Select>
        </Input>
      </FormItem>
      <FormItem>
        <CheckboxGroup v-model="searchForm.status">
          <Checkbox :label="1">
            <span>{{ $t('L00105') }}</span>
          </Checkbox>
          <Checkbox :label="0">
            <span>{{ $t('L00106') }}</span>
          </Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="doSearch">{{ $t('L00120') }}</Button>
      </FormItem>
    </Form>
    <div class="clear"></div>
    <Table
      class="search-form-table"
      v-if="tableData.length"
      :data="tableData"
      :columns="tableColumns"
    ></Table>
    <Page
      class="search-form-page"
      v-if="pageInfo.total"
      :total="pageInfo.total"
      :current="pageInfo.currentPage"
      :page-size="pageInfo.pageSize"
      placement="top"
      show-sizer
      show-elevator
      show-total
      @on-change="pageChange"
      @on-page-size-change="pageSizeChange"
    ></Page>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'SearchTag',
    data () {
      // let _t = this
      return {
        searchForm: {
          keywords: '',
          filterType: 'name',
          status: []
        },
        placeholderMap: {
          name: 'L00179'
        },
        tableData: [],
        // 分页信息
        pageInfo: {
          currentPage: 1,
          total: 0,
          pageSize: 10
        },
        // 选中行信息
        selectedRowData: [],
        // 用户组列表
        userGroupMap: {}
      }
    },
    computed: {
      ...mapGetters('Platform', [
        'userInfo',
        'userClass',
        'verifyPermission'
      ]),
      columnsMap () {
        let _t = this
        return {
          field: [
            {
              type: 'index',
              width: 60,
              align: 'center'
            },
            {
              title: 'ID',
              key: 'id',
              sortable: true
            },
            {
              title: _t.$t('L00178'),
              key: 'name',
              sortable: true
            }
          ],
          time: [
            {
              title: _t.$t('L00043'),
              key: 'create_time',
              sortable: true,
              render: (h, params) => {
                return h('span', _t.$X.moment(params.row['create_time']).format('YYYY-MM-DD hh:mm:ss'))
              }
            },
            {
              title: _t.$t('L00044'),
              key: 'update_time',
              sortable: true,
              render: (h, params) => {
                return h('span', _t.$X.moment(params.row['update_time']).format('YYYY-MM-DD hh:mm:ss'))
              }
            }
          ],
          createUser: [
            {
              title: _t.$t('L00057'),
              key: 'create_user_id',
              sortable: true,
              render: function (h, params) {
                let createUser = params.row.create_user || {}
                let text = params.row.create_user_id || '-'
                if (createUser.name && createUser.account) {
                  text = createUser.name + ' ' + createUser.account
                }
                return h('span', text)
              }
            }
          ],
          status: [
            {
              title: _t.$t('L00128'),
              key: 'status',
              render: function (h, params) {
                return h('XSwitch',
                  {
                    props: {
                      size: 'large',
                      callbackParams: params.index,
                      beforeToggle: _t.switchStatus,
                      value: !!params.row.status,
                      disabled: !_t.verifyPermission(_t.$route.name, 1)
                    }
                  },
                  [
                    h('span', {
                      slot: 'open'
                    }, _t.$t('L00105')),
                    h('span', {
                      slot: 'close'
                    }, _t.$t('L00106'))
                  ]
                )
              }
            }
          ],
          action: [
            {
              title: _t.$t('L00129'),
              key: 'action',
              width: 180,
              render: (h, params) => {
                let btnArr = [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      margin: '2px'
                    },
                    on: {
                      click: () => {
                        _t.handleAction('edit', params.row)
                      }
                    }
                  }, _t.$t('L00123')),
                  h('Button', {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    style: {
                      margin: '2px'
                    },
                    on: {
                      click: () => {
                        _t.handleAction('remove', params.row)
                      }
                    }
                  }, _t.$t('L00124'))
                ]
                return h('div', btnArr)
              }
            }
          ]
        }
      },
      tableColumns () {
        let _t = this
        let tableColumns = [
          ..._t.columnsMap.field,
          // ..._t.columnsMap.createUser,
          ..._t.columnsMap.status,
          ..._t.columnsMap.time
        ]
        if (_t.verifyPermission(_t.$route.name, 1)) {
          tableColumns = [
            ...tableColumns,
            ..._t.columnsMap.action
          ]
        }
        return tableColumns
      }
    },
    methods: {
      // 执行查询
      doSearch: function (event) {
        let _t = this
        // 查询列表
        _t.initList()
        return false
      },
      // 初始化列表，获取第一页数据
      initList: function (isResetSearchForm) {
        let _t = this
        // 初始化分页
        _t.pageInfo = {
          currentPage: 1,
          total: 0,
          pageSize: 10
        }
        // 处理查询条件
        if (isResetSearchForm) {
          _t.searchForm = {
            keywords: '',
            filterType: 'name',
            status: []
          }
        }
        // 调接口，初始化数据
        _t.getList()
      },
      getList: async function () {
        let _t = this
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/AdminBlogTag/list', {
          currentPage: _t.pageInfo.currentPage,
          pageSize: _t.pageInfo.pageSize,
          ..._t.searchForm
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
        // 更新表格数据
        _t.tableData = res.data.list || []
        // 更新分页信息
        _t.pageInfo.total = res.data.count || 0
      },
      // 切换状态
      switchStatus: async function (index, oldStatus) {
        let _t = this
        // 处理参数
        if (index !== null) {
          let item = _t.tableData[index]
          // 准备参数执行状态更新
          let res = await _t.$store.dispatch('Apps/AdminBlogTag/edit', {
            id: item.id,
            // 0 停用 1 启用
            status: oldStatus ? 0 : 1
          })
          if (!res || res.code !== 200) {
            _t.$Message.error(oldStatus ? _t.$t('L00137') : _t.$t('L00138'))
            return true
          }
          // 处理返回数据
          _t.$Message.success(oldStatus ? _t.$t('L00139') : _t.$t('L00140'))
          return false
        } else {
          return true
        }
      },
      pageChange (pageNum) {
        let _t = this
        // 更新当前页
        _t.pageInfo.currentPage = pageNum
        // 调接口，初始化数据
        _t.getList()
      },
      pageSizeChange: function (pageSize) {
        let _t = this
        // 更新分页量
        _t.pageInfo.pageSize = pageSize
        // 调接口，初始化数据
        _t.getList()
      },
      doRemove: function (item) {
        let _t = this
        // 删除列表中所选数据
        _t.$Modal.confirm({
          title: _t.$t('L00141'),
          content: _t.$t('L00060'),
          onOk: async function () {
            let res = await _t.$store.dispatch('Apps/AdminBlogTag/remove', [
              item.id
            ])
            if (!res || res.code !== 200) {
              return
            }
            _t.$Message.info(res.msg)
            // 更新列表
            _t.initList()
          }
        })
      },
      doEdit: async function (item) {
        let _t = this
        // 广播事件
        _t.$X.utils.bus.$emit('Apps/AdminBlogTag/edit', {
          action: 'edit',
          info: item
        })
      },
      // 处理操作
      handleAction: function (action, item) {
        let _t = this
        // 无选中项直接返回
        if (!item) {
          return
        }
        switch (action) {
          case 'edit':
            _t.doEdit(item)
            break
          case 'remove':
            _t.doRemove(item)
            break
        }
      }
    },
    created: async function () {
      let _t = this
      // 监听
      _t.$X.utils.bus.$on('Apps/AdminBlogTag/list/init', function () {
        // 初始化列表
        _t.initList(true)
      })
      _t.$X.utils.bus.$on('Apps/AdminBlogTag/list/refresh', function () {
        // 初始化列表
        _t.initList()
      })
    },
    beforeDestroy: function () {
      let _t = this
      // 销毁监听
      _t.$X.utils.bus.$off('Apps/AdminBlogTag/list/init')
      _t.$X.utils.bus.$off('Apps/AdminBlogTag/list/refresh')
    }
  }
</script>

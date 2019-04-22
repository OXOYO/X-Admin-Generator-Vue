/**
* Created by OXOYO on 2017/12/7.
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
            <Option value="account">{{ $t('L00049') }}</Option>
            <Option value="name">{{ $t('L00050') }}</Option>
            <!-- FIXME 只有超级管理员可以按创建人查询 -->
            <Option v-if="userInfo.type === 0" value="createUserAccount">{{ $t('L00051') }}</Option>
            <Option v-if="userInfo.type === 0" value="createUserName">{{ $t('L00052') }}</Option>
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
        <CheckboxGroup v-model="searchForm.type">
          <Checkbox
            v-for="(item, index) in userClass.filter(item => item.enable && item.type >= userInfo.type)"
            :key="index"
            :label="item.type"
          >
            <Icon :type="item.icon"></Icon>
            <span>{{ $t(item.lang) }}</span>
          </Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem
        prop="group_id"
        v-show="Object.keys(userGroupMap).length && (userInfo.type === 0 || (userInfo.type === 1 && !hasUserGroup))"
      >
        <Select v-model="searchForm.group_id" clearable style="width: 200px;" :placeholder="$t('L00053')">
          <OptionGroup
            v-for="item in userGroupMap"
            :label="item.createUser.name + ' ' + item.createUser.account"
            :key="'crate_user_id_' + item.createUser.id"
          >
            <Option
              v-for="groupItem in item.list"
              :value="groupItem.id"
              :key="groupItem.id"
              :label="groupItem.name + ' ' + item.createUser.name + ' ' + item.createUser.account"
            >
              {{ groupItem.lang ? $t(groupItem.lang) : groupItem.name }}
            </Option>
          </OptionGroup>
        </Select>
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
    name: 'SearchUsers',
    data () {
      // let _t = this
      return {
        searchForm: {
          keywords: '',
          filterType: 'account',
          status: [],
          type: [],
          group_id: ''
        },
        placeholderMap: {
          account: 'L00045',
          name: 'L00046',
          createUserAccount: 'L00047',
          createUserName: 'L00048'
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
        userGroupMap: [],
        // 当前管理员是否有自己创建的角色
        hasUserGroup: false
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
              title: _t.$t('L00049'),
              key: 'account',
              sortable: true
            },
            {
              title: _t.$t('L00054'),
              key: 'name',
              sortable: true
            },
            {
              title: _t.$t('L00055'),
              key: 'type',
              sortable: true,
              render: (h, params) => {
                let userClass = _t.userClass[params.row.type]
                let content = userClass['title'] || '-'
                let iconType = userClass['icon'] || '-'
                return h('div',
                  [
                    h('Icon', {
                      props: {
                        type: iconType
                      },
                      style: {
                        fontSize: '20px',
                        marginRight: '10px',
                        verticalAlign: 'middle'
                      }
                    }),
                    h('span', {
                      style: {
                        verticalAlign: 'middle'
                      }
                    }, content)
                  ]
                )
              }
            },
            {
              title: _t.$t('L00056'),
              key: 'user_groups',
              render: (h, params) => {
                let userGroupArr = params['row']['user_groups']
                let content = '-'
                if (userGroupArr && userGroupArr.length) {
                  let tmpArr = []
                  userGroupArr.map(item => {
                    tmpArr.push({
                      closable: false,
                      name: '',
                      content: item.name
                    })
                  })
                  content = h('TagList', {
                    props: {
                      list: tmpArr
                    }
                  })
                }
                return h(
                  'div',
                  {},
                  [content]
                )
              }
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
                      beforeToggle: _t.switchAccountStatus,
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
          ..._t.columnsMap.createUser,
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
      async init () {
        let _t = this
        // 获取用户角色列表
        await _t.getUserGroupList()
      },
      // 执行查询
      doSearch: function (event) {
        let _t = this
        // 查询用户列表
        _t.initAccountList()
        return false
      },
      // 初始化列表，获取第一页数据
      // FIXME 【BUG】searchForm.type须根据当前用户级别降级
      initAccountList: function (isResetSearchForm) {
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
            filterType: 'account',
            status: [],
            type: [],
            group_id: ''
          }
          // 根据用户type优雅降级
          // _t.handlerType(_t.userInfo)
        }
        // 调接口，初始化数据
        _t.getAccountList()
      },
      getAccountList: async function () {
        let _t = this
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/Users/list', {
          currentPage: _t.pageInfo.currentPage,
          pageSize: _t.pageInfo.pageSize,
          keywords: _t.searchForm.keywords,
          filterType: _t.searchForm.filterType,
          status: _t.searchForm.status,
          type: _t.searchForm.type,
          group_id: _t.searchForm.group_id
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
      // 切换账号状态
      switchAccountStatus: async function (index, oldStatus) {
        let _t = this
        // 处理参数
        if (index !== null) {
          let item = _t.tableData[index]
          // 准备参数执行状态更新
          let res = await _t.$store.dispatch('Apps/Users/edit', {
            ...item,
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
        _t.getAccountList()
      },
      pageSizeChange: function (pageSize) {
        let _t = this
        // 更新分页量
        _t.pageInfo.pageSize = pageSize
        // 调接口，初始化数据
        _t.getAccountList()
      },
      doRemove: function (item) {
        let _t = this
        // 删除用户列表中所选用户
        _t.$Modal.confirm({
          title: _t.$t('L00141'),
          content: '确认删除所选账号吗？',
          onOk: async function () {
            let res = await _t.$store.dispatch('Apps/Users/remove', [
              item.id
            ])
            if (!res || res.code !== 200) {
              return
            }
            _t.$Message.info(res.msg)
            // 更新账号列表
            _t.initAccountList()
          }
        })
      },
      doEdit: async function (item) {
        let _t = this
        // 广播事件
        _t.$X.utils.bus.$emit('Apps/Users/edit', {
          action: 'edit',
          info: item
        })
      },
      // 根据用户type优雅降级
      handlerType: function (userInfo) {
        let _t = this
        // 根据用户级别降级
        let type = [-1]
        if (userInfo) {
          if (userInfo.type === 0) {
            type = [0, 1, 2]
          } else if (userInfo.type === 1) {
            type = [2]
          }
        }
        _t.searchForm.type = type
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
      },
      // 获取用户组列表
      getUserGroupList: async function () {
        let _t = this
        // 分发action，调接口
        let res = await _t.$store.dispatch('Apps/Users/role/list/all', {
          status: [1]
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
        // 更新数据
        let resList = res.data.list || []
        // 按创建人划分
        let userGroupMap = {}
        for (let i = 0, len = resList.length; i < len; i++) {
          let item = resList[i]
          if (!userGroupMap.hasOwnProperty(item.create_user_id)) {
            userGroupMap[item.create_user_id] = {
              createUser: item.create_user,
              list: []
            }
          }
          userGroupMap[item.create_user_id].list.push(item)
        }
        _t.userGroupMap = userGroupMap
        // 判断用户类别
        if (_t.userInfo.type === 1) {
          _t.hasUserGroup = _t.userGroupMap.hasOwnProperty(_t.userInfo.id)
        }
      }
    },
    created: async function () {
      let _t = this
      // 初始化
      _t.init()
      // 监听
      _t.$X.utils.bus.$on('Apps/Users/list/init', function () {
        // 初始化列表
        _t.initAccountList(true)
      })
      _t.$X.utils.bus.$on('Apps/Users/list/refresh', function () {
        // 初始化列表
        _t.initAccountList()
      })
    },
    beforeDestroy: function () {
      let _t = this
      // 销毁监听
      _t.$X.utils.bus.$off('Apps/Users/list/init')
      _t.$X.utils.bus.$off('Apps/Users/list/refresh')
    }
  }
</script>

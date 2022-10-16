<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户管理" name="first">
          <el-row :gutter="10">
            <el-button type="primary" size="small" icon="el-icon-plus" style="margin-left:10px;" @click="addRolue">新增角色</el-button>
          </el-row>
          <el-table v-loading="loading" border="" :data="roleList">
            <el-table-column
              label="序号"
              width="120"
              type="index"
            />
            <el-table-column
              label="角色名称"
              width="240"
              prop="name"
            />
            <el-table-column
              label="描述"
              prop="description"
            />
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <el-button size="small" type="success">分配权限</el-button>
                <el-button size="small" type="primary" @click="editRole(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="delRow(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row type="flex" justify="center" align="middle" style="height:60px;">
            <el-pagination
              v-if="total>0"
              background
              layout="prev,pager,next,sizes"
              :total="total"
              :current-page.sync="page.page"
              :page-size.sync="page.pagesize"
              :page-sizes="[2,5,10,15]"
              @current-change="RoleList"
              @size-change="RoleList"
            />
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="second">
          <el-alert
            title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            type="info"
            show-icon
            :closable="false"
          />
          <el-form label-width="120px" :model="companyInfo" style="margin-top:50px">
            <el-form-item label="公司名称">
              <el-input v-model="companyInfo.name" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="公司地址">
              <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <add-rolue ref="addRole" :di-visible.sync="diVisible" @refreshList="RoleList" />
  </div>
</template>

<script>
import { getRoleList, deleteRole, getCompanyInfo } from '@/api/setting'
import addRolue from './compoents/addRolue.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'HrsaasIndex',
  components: {
    addRolue
  },
  data() {
    return {
      activeName: 'first',
      page: {
        page: 1,
        pagesize: 10
      },
      total: 0,
      roleList: [],
      loading: false,
      diVisible: false,
      companyInfo: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  created() {
    this.RoleList()
    this.getCompanyId()
  },
  methods: {
    async RoleList() {
      try {
        this.loading = true
        const { rows, total } = await getRoleList(this.page)
        this.total = total
        this.roleList = rows
        // console.log(this.roleList)
        // total大于0并且rows的length === 0 这种情况并不是正在的没有数据，是有的，要重新发起请求
        if (total > 0 && rows.length === 0) {
          this.page.page = this.page.page - 1
          this.getRoleList()
        }
        this.loading = false
      } catch (error) {
        console.log(error)
      }
    },
    addRolue() {
      this.diVisible = true
    },
    // 绑定点击事件
    // 拿到当前行这条数据
    // 回显再新增角色的组件上
    editRole(row) {
      // console.log(row)
      // row直接赋值给 addRole 的formData
      // 地址一样，指的是同一个对象
      this.$refs.addRole.formData = row
      this.diVisible = true
      // 优化 数据是引入类型带来的问题
    },
    // 删除角色
    // 删除角色给删除俺就绑定点击事件
    // 删除按钮需要二次确定
    async delRow(id) {
      try {
        await this.$confirm('确定要删除吗？', '提示', {
          cancelButtonText: '取消',
          confirmButtonText: '确定',
          type: 'warning'
        })
        // 删除接口封装
        // 调用删除接口
        await deleteRole(id)
        // 刷新列表
        this.RoleList()
      } catch (error) {
        console.log(error)
      }
    },
    // 获取公司的接口封装好
    // 拿到companyId
    // this.$store.state.user,userInfo.compantId
    // this.$store.getters.companyId
    // 调用 获取公司接口
    // 渲染页面
    async getCompanyId() {
      this.companyInfo = await getCompanyInfo(this.companyId)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

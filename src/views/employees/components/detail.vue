<template>
  <div>
    <div class="dashboard-container">
      <div class="app-container">
        <el-card>
          <el-tabs v-model="activeName" @tab-click="tabClick">
            <el-tab-pane lazy label="登录账户设置" name="first">
              <el-form ref="form" label-width="80px" :model="accountInfo" :rules="accountInfoRules">
                <el-form-item label="姓名" prop="username">
                  <el-input v-model="accountInfo.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="accountInfo.password" type="password" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="save">更新</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane lazy label="个人详情" name="second">
              <userInfo />
            </el-tab-pane>
            <el-tab-pane lazy label="岗位信息" name="third">
              <JobInfo />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { getUserFateilById, saveUserFateilById } from '@/api/user'
import userInfo from './user-info.vue'
import JobInfo from './job-info.vue'
import Cookies from 'js-cookie'
export default {
  components: { userInfo, JobInfo },
  data() {
    return {
      // 获取cookies数据
      activeName: Cookies.get('activeName') || 'first',
      accountInfo: {},
      accountInfoRules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 10, message: '格式错误', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 6, message: '最少6位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.loadEmployeesInfo()
  },
  methods: {
    async loadEmployeesInfo() {
      // 用params传参，路由上是'/',query传参，路由上是'?'
      const res = await getUserFateilById(this.$route.params.id)
      this.accountInfo = res
    },
    async save() {
      try {
        await this.$refs.form.validate()
        await saveUserFateilById(this.accountInfo)
        this.$message.success('更新成功')
      } catch (error) {
        console.log(error)
      }
    },
    tabClick() {
      Cookies.set('activeName', this.activeName)
    }
  }
}
</script>

<style>

</style>

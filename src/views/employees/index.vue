<template>
  <div class="app-container">
    <PageTools>
      <span slot="before">共166条记录</span>
      <template slot="after">
        <el-button
          size="small"
          type="warning"
          @click="$router.push('import')"
        >导入</el-button>
        <el-button
          size="small"
          type="danger"
          @click="exportExcle"
        >导出</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handleAdd"
        >新增员工</el-button>
      </template>
    </PageTools>
    <!-- 放置表格和分页 -->
    <el-card>
      <el-table v-loading="loading" border :data="list">
        <el-table-column label="序号" sortable="" width="80" type="index" />
        <el-table-column label="头像">
          <template slot-scope="{row}">
            <img :src="row.staffPhoto" style="width:100%;height:100%" alt="" @click="ImgLook">
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="工号" prop="workNumber" />
        <el-table-column
          :formatter="formatterFn"
          label="聘用形式"
          prop="formOfEmployment"
        >
          <!-- <span>{{ row.formOfEmployment }}</span> -->
        </el-table-column>
        <el-table-column label="部门" prop="departmentName" />
        <el-table-column label="入职时间" sortable="">
          <template slot-scope="{ row }">{{
            row.timeOfEntry | formatDate
          }}</template>
        </el-table-column>
        <el-table-column label="账户状态" prop="enableState">
          <template slot-scope="{ row }">
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              @click="lookDetail(row)"
            >查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small">角色</el-button>
            <el-button
              type="text"
              size="small"
              @click="delBtn(row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next,sizes,total"
          :total="total"
          :page-sizes="[2, 5, 10]"
          :page-size.sync="pages.size"
          :current-page.sync="pages.page"
          @current-change="getEmployeeList"
          @size-change="getEmployeeList"
        />
      </el-row>
      <!-- 点开页面，dialog会加载，而里面的内容那个不加载 -->
      <el-dialog
        title="图片预览"
        :visible.sync="dialogVisibleCode"
        width="50%"
      >
        <!-- 懒渲染：内容默认没有创建，弹层显示的时候才创建 -->
        <canvas ref="canvas" />
      </el-dialog>
    </el-card>
    <add-employees :dialog-visible.sync="dialogVisible" />
  </div>
</template>

<script>
// import PageTools from '@/components/PageTools/index.vue'
// 把结构复制进来  slot的旧语法换新语法
// 把接口封装复制进来
// 引入接口
// 调用接口
import EnumHireType from '@/api/constant/employees'
import { getEmployeeList, delEmployee } from '@/api/employees'
import AddEmployees from '@/views/employees/components/add-employees.vue'
import Qrcode from 'qrcode'
export default {
  name: 'HrsaasIndex',
  components: { AddEmployees },
  data() {
    return {
      pages: {
        page: 1,
        size: 10
      },
      list: [],
      total: 0,
      loading: false,
      hireType: EnumHireType.hireType,
      dialogVisible: false,
      dialogVisibleCode: false
    }
  },
  mounted() {
    this.getEmployeeList()
  },
  methods: {
    async getEmployeeList() {
      this.loading = true
      const { rows, total } = await getEmployeeList(this.pages)
      this.list = rows
      // console.log(this.list)
      this.total = total
      this.loading = false
    },
    formatterFn(row, column, cellValue) {
      const res = this.hireType.find(ele => ele.id === cellValue)
      return res && res.value || '非正式'
    },
    ImgLook(staffPhoto) {
      // 点击的时候，数据发生变化了，但是视图并未发生变化
      // Vue：数据驱动/组件系统
      // 数据驱动：数据变化 =》视图变化
      // 数据变化同步 => vue背后 将视图更新（异步的）
      // 为什么 如果是同步的 数据变 视图立即变 太消耗性能
      // 等所有的数据变化了
      if (!staffPhoto) {
        return this.$message.error('暂无头像')
      }
      this.dialogVisibleCode = true
      // 方法：等视图更新后触发，获取到最新的视图 nextTick
      this.$nextTick(() => {
        Qrcode.toCanvas(this.$refs.canvas, 'sample text', function(error) {
          if (error) console.log(error)
          console.log('success')
        })
      })
    },
    handleAdd() {
      // 点击的时候，需要弹窗显示
      this.dialogVisible = true
    },
    async delBtn(id) {
      this.$confirm('确认删除给员工吗？', '提示', {
        type: 'warning'
      })
      // 调用删除接口
      await delEmployee(id)
      // 重新刷新页面
      this.getEmployeeList()
    },
    async exportExcle() {
      // 文件懒加载
      const { export_json_to_excel } = await import('@/vendor/Export2Excel.js')
      const { rows } = await getEmployeeList(this.pages)
      // console.log(rows)
      const exportExcelMapPath = {
        '手机号': 'mobile',
        '姓名': 'username',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      const header = Object.keys(exportExcelMapPath)
      const data = rows.map(item => {
        return header.map(h => {
          // 循环表头是手机号
          // return h
          if (h === '聘用形式') {
            const find = this.hireType.find(hire => {
              return hire.id === item[exportExcelMapPath[h]]
            })
            return find ? find.value : '未知'
          }
          return item[exportExcelMapPath[h]]
        })
      })
      // console.log(export_json_to_excel)
      export_json_to_excel({
        header, // 表头 必填
        // data里面的二维数组，每一个数组是一行的数据
        data, // 具体数据 必填
        filename: '黑马员工列表', // 非必填
        autoWidth: true, // 宽度自适应
        bookType: 'xlsx' // 类型 非必填
      })
    },
    lookDetail(row) {
      this.$router.push('/employees/detail/' + row.id)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

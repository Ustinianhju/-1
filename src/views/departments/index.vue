<template>
  <div class="departments-container">
    <el-card>
      <tree-tools :tree-node="company" :is-root="false" @addDept="handleAddDept" />
    </el-card>
    <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
      <tree-tools slot-scope="{data}" :tree-node="data" @refreshList="getDepartments" @addDept="handleAddDept" @editDept="editDept" />
    </el-tree>
    <add-dept ref="addDept" :dialog-visible.sync="dialogVisible" :tree-node="currentNode" />
  </div>
</template>

<script>
import addDept from './components/add-dept.vue'
import treeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
export default {
  name: 'HrsaasIndex',
  components: { treeTools, addDept },
  data() {
    return {
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      dialogVisible: false,
      currentNode: {},
      loading: false
    }
  },

  mounted() {
    this.getDepartments()
  },
  // created() {
  //   this.Departments()
  // },
  methods: {
    // 拿组织架构中的数据
    async getDepartments() {
      try {
        this.loading = true
        const { depts, companyManage, companyName } = await getDepartments()
        // console.log(depts)
        this.departs = tranListToTreeData(depts, '')
        // console.log(this.departs)
        this.company = { name: companyName, manager: companyManage }
        this.company = { name: companyName, manager: '负责人', id: '' }
      } finally {
        this.loading = false
      }
    },
    handleAddDept(node) {
      // 显示组件 adddept
      this.dialogVisible = true
      this.currentNode = node
    },
    editDept(node) {
      // currentNode 存放的当前操作的节点
      // console.log(node)
      this.dialogVisble = true
      this.currentNode = { ...node }
      // 回显数据
      // node 复制 给addDept FormData
      this.$refs.addDept.formData = { ...node }
    }
  }
}
</script>

<style lang="scss" scoped>
.departments-container {
  width: 900px;
  margin: 20px auto;
  .el-tree {
    .el-tree-node__content {
      // padding-right: 20px;
    }
  }
}
</style>

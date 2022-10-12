<template>
  <el-row type="flex" justify="space-between" align="middle" style="width: 100%">
    <el-col>
      <!-- 左侧内容 -->
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 放置下拉菜单 -->
          <el-dropdown @command="handleCommand">
            <!-- 内容 -->
            <span>操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 具名插槽 -->
            <el-dropdown-menu slot="dropdown">
              <!-- 下拉选项 -->
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="isRoot" command="del">删除部门</el-dropdown-item>

            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>

      <!-- 右侧内容 -->
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  name: 'HrsaasTreeTools',
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    // 组件 下拉选项两种使用情况
    isRoot: {
      // 加变量控制
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleCommand(type) {
      // console.log(type)
      if (type === 'add') {
        // 新增
        // 现在treeTools 和 addDept 是兄弟组件 再treeTools里控制 addDept 的显示隐藏不方便
        this.$emit('addDept', this.treeNode)
      } else if (type === 'edit') {
        // edit编辑 写编辑相关的逻辑
        // 现在 treeTools 和addDept是兄弟组件，再treeTools里控制，addDept的显示隐藏不方便
        this.$emit('editDept', this.treeNode)
      } else {
        // del
        // 实现删除逻辑
        // 二次确定
        this.$confirm('是否确认删除该部门', '提示', {
          type: 'warning'
        }).then(async res => {
          // console.log(res)
          // 调用删除接口
          return delDepartments(this.treeNode.id)
        }).then(res => {
          this.$message.success('删除成功')
          // 父组件 getDepartments
          this.$emit('refreshList')
        })
      }
    }
  }
}
</script>

<style>

</style>

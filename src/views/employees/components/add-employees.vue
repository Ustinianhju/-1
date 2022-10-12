<template>
  <el-dialog title="新增员工" :visible="dialogVisible" @close="hndleClose">
    <!-- 表单 -->
    <el-form ref="addEmploy" :rules="rules" label-width="120px" :model="formData">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:80%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:80%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="formOfEmployment">
        <el-date-picker v-model="formData.formOfEmployment" style="width:80%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="workNumber">
        <el-select v-model="formData.workNumber" style="width:80%" placeholder="请选择">
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:80%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="timeOfEntry">
        <el-input v-model="formData.timeOfEntry" style="width:80%" placeholder="请选择部门" @focus="getDepartments" />
        <el-tree
          v-show="isShow"
          v-loading="loading"
          style="width:80%"
          :data="treeData"
          :props="{label:'name'}"
          default-expand-all
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:80%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="hndleClose">取消</el-button>
          <el-button type="primary" size="small" @click="btnOk">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
// 实现弹窗组件的显示和隐藏 其实就是el-dialog 组件显示 隐藏 visible  父到子 props
//  点击关闭按钮 close $emit 去改父组件里的值 (upate:dialogVisible)
//  handleClose 完善 // 1. 表单重置 2.表单绑定的值从新赋值
import employeesEnum from '@/api/constant/employees'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import { addEmployee } from '@/api/employees'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      treeData: [],
      hireType: employeesEnum.hireType,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 4, message: '名称字段为1~4', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      isShow: false,
      loading: false
    }
  },
  methods: {
    hndleClose() {
      // 表单重置
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.isShow = false
      this.$refs.addEmploy.resetFields()
      this.$emit('update:dialogVisible', false)
    },
    async getDepartments() {
      this.isShow = true
      this.loading = true
      const { depts } = await getDepartments()
      this.treeData = depts
      // 将数据结构成树状结构
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    selectNode(node) {
      // 选中树的节点，把节点对应的数据给 departmentName这个字段
      this.formData.timeOfEntry = node.name
      // 细节优化，弹窗关闭时，节点删除
      this.isShow = false
    },
    // 点击确定待用接口 完成新增功能
    async btnOk() {
      try {
        await this.$refs.addEmploy.validate()
        // 调用接口
        await addEmployee(this.formData)
        this.hndleClose()
        // 关闭弹窗
        // 需要调用父组件里，获取列表的方法
        this.$parent.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style>

</style>

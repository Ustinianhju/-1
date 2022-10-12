<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="title" :visible="dialogVisible" @close="handleClise">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="addDeptForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" style="width:80%" placeholder="1-300个字符" type="textarea" :rows="3" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button v-loading="loading" type="primary" size="small" @click="submit">确定</el-button>
        <el-button size="small" @click="handleClise">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  name: 'HrsaasAddDept',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: () => ({})
    }
  },
  // 通过属性控制组件显示
  // 父子 父到子用.sync 关闭弹窗的时候 update:dialogVisible

  data() {
    // 部门名称 同级部门中禁止出现重复部门
    // 部门编码 在整个模块中都不允许重复
    // 通过自定义校验函数validator来实现

    const codeCheck = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // console.log('depts', depts)
      let isRepeat = true
      // 编辑模式下，让我自己和自己校验了
      // 解决方案 对比的过程中，把自己排除掉，然后再去对比
      if (this.isRepeat.id) {
        isRepeat = depts.some(ele => ele.code === value)
      } else {
        isRepeat = depts.some(ele => ele.code === value)
      }
      isRepeat ? callback(new Error(`模块下已经存在${value}编码`)) : callback()
    }

    // 部门名称 同级部门中禁止出现重复部门
    // 重点 是同级部门 如何从所有部门中 把同级部门数据筛选出来
    // 先确定 父id
    // 先从 tree - tools拿到数据 再把数据 送到父组件 父组件再把数据给addDept
    // 先拿到所有 同级部门的数据 一个个的比较过去 如果出现重复 那校验不通过 否则校验通过

    const nameCheck = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // console.log('depts', depts)
      let isRepeat = true
      if (this.formData.id) { // 编辑
        // 找对同级部门
        // console.log(this.formData.id)
        // depts ==> 找对真正的同级部门 pid
        // depts [{},{},{}.....]
        // 排除自己 再判断名称是否重复
        const deptstj1 = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id)
        isRepeat = deptstj1.some(ele => ele.name === value)
        // console.log(deptstj1)
      } else { // 新增子部门
        const deptstj = depts.filter(item => item.pid === this.treeNode.id)
        //   console.log(deptstj)
        isRepeat = deptstj.some(ele => ele.name === value)
      }
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    // 部门名称（name）：必填 1-50个字符 / 同级部门中禁止出现重复部门
    // 部门编码（code）：必填 1-50个字符 / 部门编码在整个模块中都不允许重复
    // 部门负责人（manager）：必填
    // 部门介绍 ( introduce)：必填 1-300个字符
    return {
      peoples: [],
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          { required: true, message: '部门名称必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称1-50个字符', trigger: 'blur' },
          { validator: nameCheck, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门便那必填', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码1-50个字符', trigger: 'blur' },
          { validator: codeCheck, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门管理者必填' }
        ],
        introduce: [
          { required: true, message: '部门介绍必填', trigger: 'blur' },
          { min: 1, max: 300, message: '部门介绍1-50个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  computed: {
    title() {
      return this.formData.id ? '编辑模式' : '新增模式'
    }
  },
  methods: {
    handleClise() {
      this.$emit('update:dialogVisible', false)
      this.$refs.addDeptForm.resetFields()
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
    },
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
      console.log(this.peoples)
    },
    async submit() {
      // 表单校验通过，validate()
      try {
        await this.$refs.addDeptForm.validate()
        // 调用接口
        this.loading = true
        if (this.formData.id) {
          await updateDepartments(this.formData)
        } else {
          await addDepartments({ ...this.formData, pid: this.treeNode.id })
        }
        // 因为是添加子部门，所以我们需要将新增的部门pid设置成当前的id，新增的部门就成了自己的子部门
        // 确定按钮的loading状态
        // 接口新增成功之后，消息提示成功
        this.$message.success(`${this.formData.id ? '编辑' : '新增'}成功`)
        // 刷新父组件的组织架构列表
        this.$parent.getDepartments()
        // 关闭弹窗
        this.handleClise()
        // 刷新父组件的组织架构列表 思考$parent 是否合适
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>

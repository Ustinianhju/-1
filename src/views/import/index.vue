<template>
  <div>
    <UploadExcel :on-success="handleSuccess" />
  </div>
</template>

<script>
import UploadExcel from '@/components/UploadExcel/index.vue'
import { importEmployee } from '@/api/import'
export default {
  components: { UploadExcel },
  // 实现批量新增员工
  methods: {
    async handleSuccess({ header, results }) {
      // console.log(results)
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      const arr = []
      results.forEach(item => {
        // console.log(item)
        const userInfo = {}
        Object.keys(item).forEach(key => {
          // console.log(key)
          userInfo[userRelations[key]] = item[key]
        })
        arr.push(userInfo)
      })
      await importEmployee(arr)
      this.$router.back()
    }
  }
}
</script>

<style>

</style>

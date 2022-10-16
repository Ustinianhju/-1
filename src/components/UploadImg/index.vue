<template>
  <div>
    <el-upload
      v-loading="loading"
      class="UploadImg"
      action="#"
      list-type="picture-card"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="onChange"
      :before-upload="beforeUpload"
      :http-request="onHttpRequest"
      :limit="1"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <el-dialog
      title="图片预览"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <img :src="previewImgUrl" style="width:100%">
    </el-dialog>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
const cos = new COS({
  SecretId: 'AKIDEG7qT0MVWSDnBRVN1NXTBmJivwpaAar0',
  SecretKey: 'tb4JTQJ1WwlRs8GBwWt40kGdqukNnzw4'
})
export default {
  name: 'UploadImg',
  props: {
    defaultUrl: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      fileList: [
        // { name: 'default', url: '' }
      ],
      dialogVisible: false,
      previewImgUrl: '',
      loading: false
    }
  },
  // 组件创建的时候，this.defaultUrl这个异步获取还未完成,因此需要在watch里进行监视，数据一更新就渲染
  watch: {
    defaultUrl() {
      this.fileList.push({
        name: 'default',
        url: this.defaultUrl
      })
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true
      this.previewImgUrl = file.url
    },
    // 1.本地选择上传 原来有一个数据+选择的数据
    // 2.上传成功/失败都会发送一次请求
    onChange(file, fileList) {
      this.fileList = fileList
    },
    onHttpRequest({ file }) {
      this.loading = true
      cos.putObject({
        Bucket: 'jason-33-1314348438', /* 填入您自己的存储桶，必须字段 */
        Region: 'ap-nanjing', /* 存储桶所在地域，例如ap-beijing，必须字段 */
        Key: file.name, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
        Body: file, /* 必须，上传文件对象，可以是input[type="file"]标签选择本地文件后得到的file对象 */
        onProgress: function(progressData) {
          console.log(JSON.stringify(progressData))
        }
      }, (err, data) => {
        // console.log(err || data)
        if (err) return this.$message.error('上传图片失败')
        // console.log(data)
        // console.log('http://' + data.Location)
        this.loading = false
        this.$emit('on-success', {
          imgUrl: 'http://' + data.Location
        })
      })
    },
    // 上传之前
    beforeUpload(file) {
      // 文件类型
      const allowTypes = ['image/jpeg', 'image/gif']
      const isHas = allowTypes.includes(file.type)
      if (!isHas) {
        this.$message.error('亲,只能上传' + allowTypes.join(',') + '类型文件')
        return false
      }
      // 循环 查找每一个数据是否在数组中
      // 1.some() 某一个数据 是否在数组中
      // 2.find 查找，返回找到的哪一项
      // 3.findIndex 查找， 找到的哪一项的索引 可用于复杂类型的查找
      // 4.indexOf 查找， 返回的索引 只能用于简单数据类型的查找
      // 5.includes 查找，返回的事布尔值 简单类型数组

      // 上传图片大小
      const maxSize = 1 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片不能超过1MB')
        return false
      }
    }
  }
}
</script>

<style>
.UploadImg{
  width: 146px;
  height: 136px;
  overflow:hidden ;
}
</style>

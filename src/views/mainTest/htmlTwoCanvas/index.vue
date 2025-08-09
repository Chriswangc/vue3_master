<!--
 * @Author: Chris-wang chriswang64@foxmail.com
 * @Date: 2024-01-27 14:27:33
 * @LastEditors: Chris-wang chriswang64@foxmail.com
 * @LastEditTime: 2025-08-09 06:30:50
 * @FilePath: \vue3-master-houtaiguanliDemo\vue3-master\src\views\mainTest\htmlTwoCanvas\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup>
/**
 * @file html转canvas演示页面
 * @description 演示如何将HTML内容转为图片并下载
 */
import html2canvas from "html2canvas";
import { ref, reactive, onMounted } from "vue";

let picture = ref();
const setup = reactive({
  useCORS: true,
});

/**
 * @lifecycle onMounted
 * @description 组件挂载完成时，初始化html2canvas
 */
onMounted(() => {
  html2canvas(picture.value, setup).then((canvas) => {
    // document.body.appendChild(canvas); // 自动在下方显示绘制的canvas图片
  });
});

/**
 * @function creatImg
 * @description 生成图片函数，将DOM元素转换为canvas并导出为图片
 * @returns {void}
 * @example
 * // 点击下载按钮时调用
 * creatImg()
 */
function creatImg() {
  const setup = {
    useCORS: true, // 使用跨域
  };
  html2canvas(picture.value, setup).then((canvas) => {
    const link = canvas.toDataURL("image/jpg");
    exportPicture(link, "文件名");
  });
}

/**
 * @function exportPicture
 * @description 导出图片函数，创建临时链接并触发下载
 * @param {string} link - 图片的DataURL
 * @param {string} name - 导出的文件名，默认为"未命名文件"
 * @returns {void}
 */
function exportPicture(link, name = "未命名文件") {
  const file = document.createElement("a");
  file.style.display = "none";
  file.href = link;
  file.download = decodeURI(name);
  document.body.appendChild(file);
  file.click();
  document.body.removeChild(file);
}
</script>
<template>

   <el-button @click="creatImg" type="primary">下载</el-button>
  <div ref="picture">
    <h4>Hello World!</h4>
  </div>
</template>
<style scoped>
</style>
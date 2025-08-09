# 开发记录
##  img 的 src属性 value 使用'@/assets/..' 
* 问题: 使用别名路径 404
* 原因:<img> 标签的 src 属性不会被解析为别名路径
* 解决方案:src="../assets/img/cover.png" 简单的一种

##  组件使用v-model 控制弹窗组件的显示与隐藏 数据双向流
* 问题: <myCompoent v-model="visible">
        组件内部: defineProps({visible:{type:Boolean}})   使用visible接收 修改值不生效
* 原因: 组件使用v-model="modelValue"  默认prop传参为 modelValue
        组件使用v-model:visible="modelValue"  prop传参为visible 同样子组件接收可以改为 defineProps({visible:{type:Boolean}})
* 解决方案: 子组件prop接收参数key修改 如果组件v-model为简写 则用  modelValue  不为简写，根据自定义key 选择接收

##  el-dialog 组件 样式穿透不生效
* 问题:el-dialog
* 原因:el-dialog 所在组件 style需要加上scoped 并且 el-dialog需要自定义class名
* 解决方案: :deep(.el-dialog.defineClassName) 可以选中同时具有.el-dialog和拥有该类名的dom 修改样式

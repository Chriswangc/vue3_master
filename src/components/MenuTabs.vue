<script setup>
import { ref, onMounted } from "vue";
import { RouterView, useRoute } from "vue-router";
import menuTab from "@/util/menuTab.js";
const route = useRoute();
// 当前活动菜单
const activeRoute = ref("/homeShow");
onMounted(() => {
  // 获取路由路径赋值
  activeRoute.value = route.fullPath;
});
</script>

<template>
  <h1 class="title">Test System</h1>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    :default-active="activeRoute"
    text-color="#fff"
    :unique-opened="true"
    :router="true"
  >
    <template v-for="menu in menuTab" :key="menu.path">
      <!-- 单菜单 -->
      <template v-if="menu.type === 'menuItem'">
        <el-menu-item :index="menu.path" :key="menu.path">
     <!-- <el-icon><location /></el-icon> -->
       
        <el-icon>  <component :is="menu.icon"></component></el-icon>
          <span>{{ menu.name }}</span>
        </el-menu-item>
      </template>
      <!-- 多级菜单 -->
      <template v-else>
        <el-sub-menu :index="menu.path" :key="menu.path">
          <template #title>
              <el-icon>  <component :is="menu.icon"></component></el-icon>
            <span>{{ menu.name }}</span>
          </template>
          <template v-for="menuItem in menu.children" :key="menuItem.path">
            <el-menu-item :index="menuItem.path">
                <el-icon>  <component :is="menuItem.icon"></component></el-icon>
              <span>{{ menuItem.name }}</span>
            </el-menu-item>
          </template>
        </el-sub-menu>
      </template>
    </template>
  </el-menu>
</template>

<style scoped lang="scss">
.el-menu {
  height: calc(100% - 51px);
  border-right: 0px;
}
.title {
  color: #fff;
  font-size: 2rem;
  height: 50px;
  text-align: center;
  background-color: #545c64;
  border-bottom: 0.1px solid #ccc;
}
.menu-icon {
  margin-right: 10px;
}
</style>
<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { ArrowRight } from "@element-plus/icons-vue";
import { ElMessage } from 'element-plus'
import menuTab from "@/util/menuTab.js";
const router = useRouter();
const route = useRoute();
// 面包屑
const breadcrumbList = ref([]);

// 监听路由
watch(route, (newValue, oldValue) => {
  // 面包屑置空
  breadcrumbList.value = [];
  // 存在父级
  if (newValue.meta.parent) {
    breadcrumbList.value.push({
      name: newValue.meta.parent,
      path:newValue.path
    });
  }
       breadcrumbList.value.push({
      path: newValue.path,
      name: newValue.name,
    });
 
},{immediate:true});
/**
 * @description 处理用户退出系统的方法，显示退出成功消息并跳转到登录页
 * @returns {void}
 */
function handleExit() {
  // 使用 API 接口进行退出登录
  import('../api/user').then(({ logout }) => {
    logout().then(res => {
      if (res.code === 200) {
        ElMessage({
          message: res.message || '退出成功!',
          type: 'success'
        })
        router.push({
          path: "/login",
        });
      }
    }).catch(error => {
      console.error('退出失败:', error);
      // 即使 API 调用失败，也尝试退出
      localStorage.removeItem('token');
      router.push({
        path: "/login",
      });
    });
  });
}


</script>
<template>
  <div class="navigate">
    <el-breadcrumb :separator-icon="ArrowRight" class="breadcrumb">
      <el-breadcrumb-item
        v-for="item in breadcrumbList"
        :key="item.name"
        :to="{ path: item.path }"
        >{{ item.name }}</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-dropdown trigger="click" class="dropdown">
      <span class="el-dropdown-link">
        <el-icon><User /></el-icon>
        admin<el-icon class="el-icon--right"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="handleExit">退出系统</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<style scoped lang="scss">
.navigate {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  background-color: #545c64;
  :deep(.breadcrumb) {
    margin-left: 20px;
    .el-breadcrumb__item {
      .el-breadcrumb__inner {
        color: #fff;
      }
      .el-breadcrumb__inner:hover {
        cursor: pointer;
      }
    }
  }

  .dropdown {
    margin-right: 20px;
    span {
      color: #fff;
    }
  }

  .dropdown:hover {
    cursor: pointer;
  }
}
</style>
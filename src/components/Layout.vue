<script setup>
import { ref } from "vue";
import { RouterView } from "vue-router";
import MenuTabs from "./MenuTabs.vue";
import Navigation from "./Navigation.vue"
</script>
<template>

    <el-row class="container">
      <el-col :span="3">
        <MenuTabs></MenuTabs>
      </el-col>
      <el-col :span="21">
        <Navigation></Navigation>
        <RouterView></RouterView>
      </el-col>
    </el-row>

</template>
<style scoped lang="scss">
.container{
  height: 100%;
}
</style>
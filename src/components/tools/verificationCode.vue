<script setup>
import { ref, computed, watchEffect, onMounted,watch } from "vue";

const props = defineProps({visible:{type:Boolean,default:false}})

const visible = computed(()=> props.visible || false)

watch(visible,(newValue,oldValue)=>{
     handleFresh()
})

let codeInfo = ref({
  firstCode: "",
  operator: "",
  secondCode: "",
});

let result = ref(0)


let operatorList = ref(["+", "-", "x"]);

function handleFresh() {
  codeInfo.value.firstCode = Math.floor(Math.random() * 10) + 1;
  codeInfo.value.secondCode = Math.floor(Math.random() * 10) + 1;
  codeInfo.value.operator = operatorList.value[Math.floor(Math.random() * 3)];
  switch (codeInfo.value.operator) {
    case "+":
      result.value =
        Number(codeInfo.value.firstCode) + Number(codeInfo.value.secondCode);
      break;
    case "-":
      result.value =
        Number(codeInfo.value.firstCode) - Number(codeInfo.value.secondCode);
      break;
    case "x":
      result.value =
        Number(codeInfo.value.firstCode) * Number(codeInfo.value.secondCode);
      break;
  }
}

onMounted(() => {
  handleFresh();
});

defineExpose({
    result
})
</script>
<template>
  <div class="main">
    <div class="code_div">
    <span class="firstCode">{{ codeInfo.firstCode }}</span>
    <span class="operator">{{ codeInfo.operator }}</span>
    <span class="secondCode">{{ codeInfo.secondCode }}</span>
      
  </div>
   <span class="fresh" @click="handleFresh">刷新</span>

  </div>
</template>

<style scoped lang="scss">
.main{
  display: flex;
  align-items: center;
  width: 50%;
}
.code_div {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 60px;
  height: 32px;
  border: 1px solid #ccc;
  margin-left: 20px;
  border-radius: 5px;
}
.fresh {
  font-size: 12px;
  margin-top: 12px;
  margin-left: 5px;
}
.fresh:hover {
  cursor: pointer;
  color: skyblue;
}
</style>

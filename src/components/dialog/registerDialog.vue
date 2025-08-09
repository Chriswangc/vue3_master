<script setup>
import { ref, computed, watchEffect } from "vue";
import verificationCode from "../tools/verificationCode.vue";
import { ElMessage } from "element-plus";
// props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
// emits
const emits = defineEmits(["update:modelValue"]);

// computed 生成可修改的visible
const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emits("update:modelValue", value);
  },
});

// 表单信息
let formData = ref({
  user: "",
  password: "",
  surePassWord: "",
  verificationCode: "",
});

// 表单DOM引用
let form = ref();

// 密码校验
const validatePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入密码"));
  } else {
    if (formData.value.password !== "") {
      if (!form.value) return;
      form.value.validateField("surePassWord", () => null);
    }
    callback();
  }
};
// 确认密码校验
const validateSurePassWord = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请二次确认密码"));
  } else if (value !== formData.value.password) {
    callback(new Error("两次密码不一致!"));
  } else {
    callback();
  }
};

// 校验
let rules = ref({
  user: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ validator: validatePassword, trigger: "blur" }],
  surePassWord: [{ validator: validateSurePassWord, trigger: "blur" }],
  verificationCode: [
    { required: true, message: "请输入验证码", trigger: "blur" },
  ],
});
// 关闭
function handleShut() {
  visible.value = false;
  initDialog();
}

/**
 * @description 处理用户注册，包含表单验证、验证码校验和注册成功后的操作
 * @returns {void}
 */
function handleRegister() {
  form.value.validate((validate) => {
    if (!validate) return;
    if (handleVerificationCode()) return;
    
    // 使用 API 接口进行注册
    import('../../api/user').then(({ register }) => {
      // 构造注册参数
      const registerData = {
        user: formData.value.user,
        password: formData.value.password
      };
      
      register(registerData).then(res => {
        if (res.code === 200) {
          ElMessage({
            message: res.message || "注册成功!",
            type: "success",
          });
          handleShut();
        }
      }).catch(error => {
        console.error('注册失败:', error);
      });
    });
  });
}

// 验证码DOM引用
let verification = ref();
// 验证码错误提示
let isError = ref("none");

// 初始化弹窗
function initDialog() {
  formData.value.user = "";
  formData.value.password = "";
  formData.value.surePassWord = "";
  formData.value.verificationCode = "";
  form.value.clearValidate();
  isError.value = "none";
}

function handleVerificationCode(code) {
  let isTrue = ref(false);
  if (formData.value.verificationCode != verification.value.result) {
    isTrue.value = true;
    isError.value = "block";
  } else {
    isError.value = "none";
  }
  if (!formData.value.verificationCode) {
    isError.value = "none";
  }
  return isTrue.value;
}
</script>
<template>
  <div class="dialog_div">
    <el-dialog
      v-model="visible"
      title="用户注册"
      width="30%"
      :before-close="handleShut"
      :close-on-click-modal="false"
      class="myDialog"
    >
      <el-form
        :model="formData"
        label-width="auto"
        label-position="left"
        :rules="rules"
        status-icon
        ref="form"
      >
        <el-form-item label="用户名" prop="user">
          <el-input v-model="formData.user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="surePassWord">
          <el-input v-model="formData.surePassWord"></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="verificationCode">
          <el-input
            v-model="formData.verificationCode"
            @blur="handleVerificationCode"
          ></el-input>
          <span class="verificationCode">验证码错误!</span>
          <verificationCode
            ref="verification"
            :needRefresh="visible"
          ></verificationCode>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleRegister">注册</el-button>
          <el-button type="warning" @click="handleShut">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-dialog.myDialog) {
  .el-form {
    .el-form-item {
      .el-form-item__label-wrap {
        label::before {
          content: "";
        }
      }
    }

    .el-form-item:nth-child(4) {
      .el-form-item__content {
        display: flex;

        .el-input {
          width: 60px;
          .el-input__wrapper {
            padding: 1px 5px;
          }
          input {
            width: 60px;
          }
          .el-input__suffix {
            display: none;
          }
        }
      }

      .verificationCode {
        display: v-bind(isError);
        font-size: 12px;
        color: var(--el-color-danger);
        line-height: 1;
        padding-top: 2px;
        position: absolute;
        top: 100%;
        left: 0;
      }
    }
  }
}
</style>

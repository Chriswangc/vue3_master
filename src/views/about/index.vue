<!--
 * @Author: Chris-wang chriswang64@foxmail.com
 * @Date: 2024-01-27 14:27:33
 * @LastEditors: Chris-wang chriswang64@foxmail.com
 * @LastEditTime: 2025-08-09 08:15:58
 * @FilePath: \vue3-master-houtaiguanliDemo\vue3-master\src\views\about\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @file deepseekAI页面
 * @description DeepSeek AI聊天界面和API密钥配置
-->
<script setup>
/**
 * @file DeepSeek AI页面
 * @description 提供DeepSeek AI聊天功能和API密钥配置
 */
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { Setting, Delete } from '@element-plus/icons-vue'
import { sendMessage, validateApiKey } from '@/api/deepseek'

// 状态变量
const loading = reactive({
  sending: false,
  validating: false
})

// API密钥相关
const apiKeyDialogVisible = ref(false)
const apiKeyForm = reactive({
  apiKey: localStorage.getItem('deepseekApiKey') || ''
})
const apiKeyRules = {
  apiKey: [
    { required: true, message: '请输入DeepSeek API密钥', trigger: 'blur' },
    { min: 10, message: 'API密钥长度不正确', trigger: 'blur' }
  ]
}
const apiKeyFormRef = ref(null)

// 聊天相关
const chatInput = ref('')
const chatMessages = ref([])
const chatContainerRef = ref(null)

// 计算属性
const hasApiKey = computed(() => {
  return apiKeyForm.apiKey && apiKeyForm.apiKey.trim() !== ''
})

/**
 * @function saveApiKey
 * @description 保存API密钥
 */
const saveApiKey = async () => {
  if (!apiKeyFormRef.value) return
  
  await apiKeyFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.validating = true
      try {
        const res = await validateApiKey(apiKeyForm.apiKey)
        if (res.code === 200 && res.data.valid) {
          localStorage.setItem('deepseekApiKey', apiKeyForm.apiKey)
          ElMessage.success('API密钥保存成功')
          apiKeyDialogVisible.value = false
        } else {
          ElMessage.error(res.message || 'API密钥无效')
        }
      } catch (error) {
        console.error('验证API密钥失败:', error)
        ElMessage.error('验证API密钥失败')
      } finally {
        loading.validating = false
      }
    }
  })
}

/**
 * @function sendChatMessage
 * @description 发送聊天消息
 */
const sendChatMessage = async () => {
  if (!chatInput.value || chatInput.value.trim() === '') {
    ElMessage.warning('请输入消息内容')
    return
  }
  
  if (!hasApiKey.value) {
    ElMessage.warning('请先配置DeepSeek API密钥')
    apiKeyDialogVisible.value = true
    return
  }
  
  // 添加用户消息
  const userMessage = {
    id: Date.now(),
    role: 'user',
    content: chatInput.value,
    timestamp: new Date().toLocaleTimeString()
  }
  chatMessages.value.push(userMessage)
  
  // 清空输入框
  const userInput = chatInput.value
  chatInput.value = ''
  
  // 滚动到底部
  scrollToBottom()
  
  // 发送请求
  loading.sending = true
  try {
    const res = await sendMessage({
      message: userInput,
      apiKey: apiKeyForm.apiKey
    })
    
    if (res.code === 200) {
      // 添加AI响应
      chatMessages.value.push({
        id: Date.now(),
        role: 'assistant',
        content: res.data.response,
        model: res.data.model,
        timestamp: new Date().toLocaleTimeString()
      })
      
      // 滚动到底部
      scrollToBottom()
    } else {
      ElMessage.error(res.message || '请求失败')
    }
  } catch (error) {
    console.error('发送消息失败:', error)
    ElMessage.error('发送消息失败')
  } finally {
    loading.sending = false
  }
}

/**
 * @function scrollToBottom
 * @description 滚动聊天容器到底部
 */
const scrollToBottom = () => {
  setTimeout(() => {
    if (chatContainerRef.value) {
      chatContainerRef.value.scrollTop = chatContainerRef.value.scrollHeight
    }
  }, 100)
}

/**
 * @function clearChat
 * @description 清空聊天记录
 */
const clearChat = () => {
  chatMessages.value = []
}

/**
 * @lifecycle onMounted
 * @description 组件挂载完成时，检查API密钥
 */
onMounted(() => {
  // 如果没有API密钥，显示配置对话框
  if (!hasApiKey.value) {
    apiKeyDialogVisible.value = true
  }
})
</script>

<template>
  <div class="deepseek-container">
    <!-- 头部 -->
    <div class="deepseek-header">
      <h2>DeepSeek AI 聊天</h2>
      <div class="header-actions">
        <el-button type="primary" size="small" @click="apiKeyDialogVisible = true">
          <el-icon><Setting /></el-icon>
          配置API密钥
        </el-button>
        <el-button type="danger" size="small" @click="clearChat">
          <el-icon><Delete /></el-icon>
          清空聊天
        </el-button>
      </div>
    </div>
    
    <!-- 聊天区域 -->
    <div class="chat-container" ref="chatContainerRef">
      <div v-if="chatMessages.length === 0" class="empty-chat">
        <el-empty description="暂无聊天记录，开始发送消息吧！" />
      </div>
      <div v-else class="chat-messages">
        <div 
          v-for="message in chatMessages" 
          :key="message.id"
          :class="['message', message.role === 'user' ? 'user-message' : 'assistant-message']"
        >
          <div class="message-header">
            <span class="role">{{ message.role === 'user' ? '用户' : 'DeepSeek AI' }}</span>
            <span class="timestamp">{{ message.timestamp }}</span>
          </div>
          <div class="message-content">{{ message.content }}</div>
          <div v-if="message.model" class="message-footer">
            <span class="model">模型: {{ message.model }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 输入区域 -->
    <div class="input-container">
      <el-input
        v-model="chatInput"
        type="textarea"
        :rows="3"
        placeholder="输入您的问题..."
        :disabled="loading.sending"
        @keyup.ctrl.enter="sendChatMessage"
      />
      <el-button 
        type="primary" 
        :loading="loading.sending"
        @click="sendChatMessage"
      >
        发送
      </el-button>
    </div>
    
    <!-- API密钥配置对话框 -->
    <el-dialog
      v-model="apiKeyDialogVisible"
      title="配置DeepSeek API密钥"
      width="500px"
    >
      <el-form 
        ref="apiKeyFormRef"
        :model="apiKeyForm"
        :rules="apiKeyRules"
        label-width="100px"
      >
        <el-form-item label="API密钥" prop="apiKey">
          <el-input 
            v-model="apiKeyForm.apiKey"
            placeholder="请输入DeepSeek API密钥"
            show-password
          />
        </el-form-item>
        <div class="api-key-tips">
          <p>提示：</p>
          <ul>
            <li>您可以从DeepSeek官网获取API密钥</li>
            <li>API密钥将安全地存储在您的浏览器本地存储中</li>
            <li>本应用不会将您的API密钥发送到除DeepSeek API之外的任何地方</li>
          </ul>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="apiKeyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveApiKey" :loading="loading.validating">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.deepseek-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.deepseek-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.chat-container {
  flex: 1;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
}

.empty-chat {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.chat-messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  padding: 12px;
  border-radius: 8px;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  background-color: #e1f3ff;
}

.assistant-message {
  align-self: flex-start;
  background-color: #f0f0f0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
}

.message-content {
  white-space: pre-wrap;
  word-break: break-word;
}

.message-footer {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
  text-align: right;
}

.input-container {
  display: flex;
  gap: 10px;
}

.input-container .el-input {
  flex: 1;
}

.api-key-tips {
  margin-top: 20px;
  padding: 10px;
  background-color: #f8f8f8;
  border-radius: 4px;
  font-size: 14px;
}

.api-key-tips p {
  margin: 0 0 8px 0;
  font-weight: bold;
}

.api-key-tips ul {
  margin: 0;
  padding-left: 20px;
}

.api-key-tips li {
  margin-bottom: 4px;
}
</style>


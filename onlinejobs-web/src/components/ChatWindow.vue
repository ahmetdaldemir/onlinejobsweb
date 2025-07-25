<template>
  <div v-if="isOpen" class="chat-window">
    <!-- Chat Header -->
    <div class="chat-header">
      <div class="chat-user-info">
        <div class="chat-avatar">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
        </div>
        <div class="chat-user-details">
          <h3 class="chat-user-name">{{ worker.firstName }} {{ worker.lastName }}</h3>
          <span class="chat-user-status">Çevrimiçi</span>
        </div>
      </div>
      <button @click="closeChat" class="close-btn">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Chat Messages -->
    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="message in messages" 
        :key="message.id"
        class="message"
        :class="{ 'message-sent': message.sent, 'message-received': !message.sent }"
      >
        <div class="message-content">
          <p class="message-text">{{ message.text }}</p>
          <span class="message-time">{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="chat-input-container">
      <div class="chat-input-wrapper">
        <input 
          v-model="newMessage" 
          @keyup.enter="sendMessage"
          type="text" 
          placeholder="Mesajınızı yazın..."
          class="chat-input"
        />
        <button @click="sendMessage" class="send-btn" :disabled="!newMessage.trim()">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onUnmounted } from 'vue'
import { socketService } from '@/services/socket'

interface Worker {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
}

interface Message {
  id: string
  text: string
  timestamp: Date
  sent: boolean
  senderId?: string
}

interface Props {
  isOpen: boolean
  worker: Worker | null
}

interface Emits {
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const messages = ref<Message[]>([])
const newMessage = ref('')
const messagesContainer = ref<HTMLElement>()
const isTyping = ref(false)

// Initialize with a welcome message and WebSocket connection
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen && props.worker) {
    // Notify App.vue about current chat worker
    window.dispatchEvent(new CustomEvent('chat-opened', {
      detail: { worker: props.worker }
    }))
    
    // Initialize messages
    messages.value = [
      {
        id: '1',
        text: `Merhaba! ${props.worker.firstName} ile mesajlaşmaya başlayabilirsiniz.`,
        timestamp: new Date(),
        sent: false
      }
    ]
    
    // Establish socket connection
    console.log('Chat açılıyor, socket bağlantısı kuruluyor...')
    
    try {
      // Ensure socket is connected
      if (!socketService.isSocketConnected()) {
        const socket = socketService.connect()
        if (!socket) {
          console.error('❌ Socket bağlantısı kurulamadı')
          return
        }
        
        // Wait for connection to establish
        await new Promise((resolve) => {
          const checkConnection = () => {
            if (socketService.isSocketConnected()) {
              resolve(true)
            } else {
              setTimeout(checkConnection, 100)
            }
          }
          checkConnection()
        })
      }
      
      console.log('✅ Socket bağlantısı başarılı, konuşmaya katılım yapılıyor...')
      
      // Join conversation with the worker
      socketService.joinConversation(props.worker.id)
      
      // Listen for sent message confirmation
      socketService.onMessageSent((data) => {
        console.log('✅ Mesaj başarıyla gönderildi:', data.id)
        // Update the last sent message with server ID if needed
      })
      
      // Listen for incoming messages
      socketService.onNewMessage((data) => {
        console.log('📨 Yeni mesaj alındı:', data)
        const message: Message = {
          id: data.id || Date.now().toString(),
          text: data.content,
          timestamp: new Date(data.timestamp || Date.now()),
          sent: false,
          senderId: data.senderId
        }
        messages.value.push(message)
        scrollToBottom()
      })
      
      // Listen for typing indicators
      socketService.onUserTyping((data) => {
        if (data.userId === props.worker?.id) {
          isTyping.value = true
        }
      })
      
      socketService.onUserStoppedTyping((data) => {
        if (data.userId === props.worker?.id) {
          isTyping.value = false
        }
      })
      
    } catch (error) {
      console.error('❌ Socket bağlantısı kurulurken hata:', error)
    }
    
    scrollToBottom()
  } else if (!isOpen) {
    // Notify App.vue that chat is closed
    window.dispatchEvent(new CustomEvent('chat-closed'))
    
    // Disconnect when chat closes
    socketService.disconnect()
  }
})

const sendMessage = async () => {
  if (!newMessage.value.trim() || !props.worker) return

  const messageText = newMessage.value.trim()
  
  console.log('=== Send Message Triggered ===')
  console.log('Message text:', messageText)
  console.log('Worker ID:', props.worker.id)
  
  // Ensure socket connection is ready
  if (!socketService.isSocketConnected()) {
    console.log('Socket not connected, attempting to connect...')
    const socket = socketService.connect()
    if (!socket) {
      console.error('❌ Socket bağlantısı kurulamadı')
      alert('Bağlantı hatası! Lütfen sayfayı yenileyin.')
      return
    }
    
    // Wait a bit for connection to establish
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (!socketService.isSocketConnected()) {
      console.error('❌ Socket bağlantısı kurulamadı')
      alert('Bağlantı hatası! Lütfen sayfayı yenileyin.')
      return
    }
  }
  
  // Add message to local state immediately
  const message: Message = {
    id: Date.now().toString(),
    text: messageText,
    timestamp: new Date(),
    sent: true
  }

  messages.value.push(message)
  newMessage.value = ''
  
  await nextTick()
  scrollToBottom()

  // Send message via WebSocket
  try {
    console.log('📤 Sending message via socket...')
    await socketService.sendMessage(messageText, props.worker.id, 'text')
    console.log('✅ Mesaj socket üzerinden başarıyla gönderildi')
  } catch (error) {
    console.error('❌ Mesaj gönderilirken hata oluştu:', error)
    alert('Mesaj gönderilemedi! Lütfen tekrar deneyin.')
  }
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('tr-TR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const closeChat = () => {
  socketService.disconnect()
  emit('close')
}



// Cleanup on component unmount
onUnmounted(() => {
  socketService.disconnect()
})
</script>

<style scoped>
.chat-window {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  border: 1px solid #e5e7eb;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 1rem 1rem 0 0;
}

.chat-user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.chat-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.chat-user-details {
  display: flex;
  flex-direction: column;
}

.chat-user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.25;
}

.chat-user-status {
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

.chat-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.message {
  display: flex;
  margin-bottom: 0.5rem;
}

.message-sent {
  justify-content: flex-end;
}

.message-received {
  justify-content: flex-start;
}

.message-content {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  position: relative;
}

.message-sent .message-content {
  background: #10b981;
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.message-received .message-content {
  background: #f3f4f6;
  color: #1f2937;
  border-bottom-left-radius: 0.25rem;
}

.message-text {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  line-height: 1.25;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
}

.chat-input-container {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.chat-input-wrapper {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.chat-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 1.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.3s;
}

.chat-input:focus {
  border-color: #10b981;
}

.send-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:hover:not(:disabled) {
  background: #059669;
  transform: scale(1.05);
}

.send-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
}

/* Scrollbar styling */
.chat-messages::-webkit-scrollbar {
  width: 4px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  .chat-window {
    width: calc(100vw - 2rem);
    height: calc(100vh - 4rem);
    bottom: 1rem;
    right: 1rem;
  }
}
</style> 
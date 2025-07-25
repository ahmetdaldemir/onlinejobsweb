<template>
  <div v-if="isOpen" class="message-list-container">
    <!-- Header -->
    <div class="message-list-header">
      <div class="header-content">
        <h3 class="header-title">Mesajlar</h3>
        <button @click="closeMessageList" class="close-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Message List -->
    <div class="message-list-content">
      <div v-if="conversations.length === 0" class="empty-state">
        <div class="empty-icon">💬</div>
        <p class="empty-text">Henüz mesajınız yok</p>
        <p class="empty-subtext">İşçilerle mesajlaşmaya başlayın</p>
      </div>
      
      <div v-else class="conversations-list">
        <div 
          v-for="conversation in conversations" 
          :key="conversation.id"
          @click="openChat(conversation)"
          class="conversation-item"
          :class="{ 'active': activeConversationId === conversation.id }"
        >
          <div class="conversation-avatar">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          
          <div class="conversation-content">
            <div class="conversation-header">
              <h4 class="conversation-name">{{ conversation.name }}</h4>
              <span class="conversation-time">{{ formatTime(conversation.lastMessageTime) }}</span>
            </div>
            
            <div class="conversation-preview">
              <p class="conversation-message">{{ conversation.lastMessage }}</p>
              <div v-if="conversation.unreadCount > 0" class="unread-badge">
                {{ conversation.unreadCount }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Conversation {
  id: string
  name: string
  lastMessage: string
  lastMessageTime: Date
  unreadCount: number
  worker: any
}

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'open-chat', worker: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const conversations = ref<Conversation[]>([])
const activeConversationId = ref<string | null>(null)

// Format time for display
const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Şimdi'
  if (minutes < 60) return `${minutes} dk`
  if (hours < 24) return `${hours} sa`
  if (days < 7) return `${days} gün`
  return date.toLocaleDateString('tr-TR')
}

// Add new message to conversation
const addMessageToConversation = (messageData: any) => {
  const { senderId, content, createdAt } = messageData
  
  // Find existing conversation
  const existingIndex = conversations.value.findIndex(c => c.id === senderId)
  
  if (existingIndex >= 0) {
    // Update existing conversation
    const conversation = conversations.value[existingIndex]
    conversation.lastMessage = content
    conversation.lastMessageTime = new Date(createdAt)
    conversation.unreadCount++
    
    // Move to top
    conversations.value.splice(existingIndex, 1)
    conversations.value.unshift(conversation)
  } else {
    // Create new conversation
    const newConversation: Conversation = {
      id: senderId,
      name: `Kullanıcı ${senderId.slice(0, 8)}`, // Temporary name
      lastMessage: content,
      lastMessageTime: new Date(createdAt),
      unreadCount: 1,
      worker: { id: senderId } // Temporary worker object
    }
    
    conversations.value.unshift(newConversation)
  }
}

// Open chat with worker
const openChat = (conversation: Conversation) => {
  activeConversationId.value = conversation.id
  conversation.unreadCount = 0 // Mark as read
  emit('open-chat', conversation.worker)
}

// Close message list
const closeMessageList = () => {
  emit('close')
}

// Listen for new messages
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    // Listen for new message events
    const handleNewMessage = (event: CustomEvent) => {
      const messageData = event.detail
      addMessageToConversation(messageData)
    }
    
    window.addEventListener('new-message-received', handleNewMessage as EventListener)
    
    // Cleanup on close
    return () => {
      window.removeEventListener('new-message-received', handleNewMessage as EventListener)
    }
  }
})

// Expose method to add conversation manually
const addConversation = (worker: any, lastMessage: string = '') => {
  const existingIndex = conversations.value.findIndex(c => c.id === worker.id)
  
  if (existingIndex < 0) {
    const newConversation: Conversation = {
      id: worker.id,
      name: `${worker.firstName} ${worker.lastName}`,
      lastMessage: lastMessage || 'Mesajlaşmaya başlayın',
      lastMessageTime: new Date(),
      unreadCount: 0,
      worker: worker
    }
    
    conversations.value.unshift(newConversation)
  }
}

// Expose method to mark conversation as read
const markAsRead = (conversationId: string) => {
  const conversation = conversations.value.find(c => c.id === conversationId)
  if (conversation) {
    conversation.unreadCount = 0
  }
}

// Expose methods
defineExpose({
  addConversation,
  markAsRead
})
</script>

<style scoped>
.message-list-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;
  height: 100vh;
  background: white;
  border-left: 1px solid #e5e7eb;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.message-list-header {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
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

.message-list-content {
  flex: 1;
  overflow-y: auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.5rem 0;
}

.empty-subtext {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.conversations-list {
  padding: 0;
}

.conversation-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: all 0.3s;
}

.conversation-item:hover {
  background: #f9fafb;
}

.conversation-item.active {
  background: #eff6ff;
  border-left: 3px solid #3b82f6;
}

.conversation-avatar {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.conversation-content {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.conversation-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-time {
  font-size: 0.75rem;
  color: #6b7280;
  flex-shrink: 0;
}

.conversation-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.conversation-message {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.unread-badge {
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 10px;
  min-width: 1.25rem;
  text-align: center;
  flex-shrink: 0;
}

/* Scrollbar styling */
.message-list-content::-webkit-scrollbar {
  width: 4px;
}

.message-list-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.message-list-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.message-list-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  .message-list-container {
    width: 100vw;
  }
}
</style> 
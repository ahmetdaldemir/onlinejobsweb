<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { socketService } from '@/services/socket'
import Swal from 'sweetalert2'

const authStore = useAuthStore()
const currentChatWorker = ref<any>(null)

// Listen for chat events
const handleChatOpened = (event: CustomEvent) => {
  currentChatWorker.value = event.detail.worker
  console.log('💬 Chat açıldı:', currentChatWorker.value)
}

const handleChatClosed = () => {
  currentChatWorker.value = null
  console.log('💬 Chat kapatıldı')
}

// Listen for new message events from worker mode
const handleNewMessageReceived = (event: CustomEvent) => {
  const data = event.detail
  console.log('📨 Worker modu - Yeni mesaj alındı:', data)
  
  // Check if user is not in a chat or chatting with different user
  if (!currentChatWorker.value || currentChatWorker.value.id !== data.senderId) {
    showNewMessageNotification(data)
  }
  
  // Update unread count for message list
  window.dispatchEvent(new CustomEvent('update-unread-count', {
    detail: { senderId: data.senderId }
  }))
  
  // Notify message list to refresh conversations
  window.dispatchEvent(new CustomEvent('refresh-conversations'))
}

onMounted(() => {
  authStore.initializeAuth()
})

// Global message listener for new messages
const setupGlobalMessageListener = () => {
  if (!authStore.isAuthenticated) return

  // Wait for socket to be connected before setting up listener
  const waitForSocket = () => {
    if (socketService.isSocketConnected()) {
      socketService.setupGlobalMessageListener((data) => {
        console.log('📨 Global message listener - Yeni mesaj:', data)
        
        // Check if user is not in a chat or chatting with different user
        if (!currentChatWorker.value || currentChatWorker.value.id !== data.senderId) {
          showNewMessageNotification(data)
        }
      })
    } else {
      // Wait a bit and try again
      setTimeout(waitForSocket, 500)
    }
  }
  
  waitForSocket()
}

// Show notification for new message
const showNewMessageNotification = (messageData: any) => {
  // Create notification sound
  const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
  
  // Show browser notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Yeni Mesaj', {
      body: `${messageData.content}`,
      icon: '/favicon.ico',
      tag: 'new-message'
    })
  }

  // Show SweetAlert notification
  Swal.fire({
    title: 'Yeni Mesaj!',
    text: messageData.content.length > 50 ? `${messageData.content.substring(0, 50)}...` : messageData.content,
    icon: 'info',
    confirmButtonText: 'Mesajı Görüntüle',
    cancelButtonText: 'Kapat',
    confirmButtonColor: '#10b981',
    cancelButtonColor: '#6b7280',
    timer: 10000,
    timerProgressBar: true,
    toast: true,
    position: 'top-end',
    showConfirmButton: true,
    showCancelButton: true
  }).then((result) => {
    if (result.isConfirmed) {
      // Emit event to open chat with sender
      window.dispatchEvent(new CustomEvent('open-chat', {
        detail: { workerId: messageData.senderId }
      }))
    }
  })

  // Play notification sound
  audio.play().catch(() => {
    // Ignore audio play errors
  })
}

// Watch for authentication changes and manage socket connection for workers
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated) {
    console.log('🔐 Kullanıcı giriş yaptı...')
    
    // For workers, enable worker mode first
    if (authStore.isWorker) {
      console.log('👷 Worker kullanıcısı tespit edildi, socket bağlantısı başlatılıyor...')
      socketService.enableWorkerMode()
      
      // Wait for worker mode to establish connection, then setup global listener
      setTimeout(() => {
        console.log('🔐 Global message listener kuruluyor...')
        setupGlobalMessageListener()
      }, 1000)
    } else {
      // For non-workers, setup global listener immediately
      console.log('🔐 Global message listener kuruluyor...')
      setupGlobalMessageListener()
    }
  } else {
    console.log('🚪 Kullanıcı çıkış yaptı, socket bağlantısı kapatılıyor...')
    socketService.disconnect()
  }
}, { immediate: true })

// Watch for user type changes
watch(() => authStore.userType, (userType) => {
  if (authStore.isAuthenticated) {
    if (userType === 'worker') {
      console.log('👷 Worker modu etkinleştiriliyor...')
      socketService.enableWorkerMode()
    } else {
      console.log('👔 Employer modu, worker bağlantısı devre dışı...')
      socketService.disableWorkerMode()
    }
  }
})

// Request notification permission on mount
onMounted(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
  
  // Add chat event listeners
  window.addEventListener('chat-opened', handleChatOpened as EventListener)
  window.addEventListener('chat-closed', handleChatClosed as EventListener)
  window.addEventListener('new-message-received', handleNewMessageReceived as EventListener)
})

onUnmounted(() => {
  // Remove chat event listeners
  window.removeEventListener('chat-opened', handleChatOpened as EventListener)
  window.removeEventListener('chat-closed', handleChatClosed as EventListener)
  window.removeEventListener('new-message-received', handleNewMessageReceived as EventListener)
})
</script>

<style>
#app {
  font-family: 'Inter', sans-serif;
}
</style> 
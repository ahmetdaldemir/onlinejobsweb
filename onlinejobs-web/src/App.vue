<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { socketService } from '@/services/socket'

const authStore = useAuthStore()

onMounted(() => {
  authStore.initializeAuth()
})

// Watch for authentication changes and manage socket connection for workers
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
  if (isAuthenticated && authStore.isWorker) {
    console.log('👷 Worker kullanıcısı tespit edildi, socket bağlantısı başlatılıyor...')
    socketService.enableWorkerMode()
  } else if (!isAuthenticated) {
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
</script>

<style>
#app {
  font-family: 'Inter', sans-serif;
}
</style> 
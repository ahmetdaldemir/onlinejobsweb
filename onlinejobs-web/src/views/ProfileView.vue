<template>
  <div class="profile-container">
    <!-- Header -->
    <header class="profile-header">
      <div class="header-content">
        <h1 class="header-title">Profil</h1>
        <button @click="handleLogout" class="logout-btn">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Çıkış Yap
        </button>
      </div>
    </header>

    <!-- Profile Content -->
    <div class="profile-content">
      <!-- User Info Card -->
      <div class="profile-card">
        <div class="card-header">
          <div class="user-avatar">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div class="user-info">
            <h2 class="user-name">{{ user?.firstName }} {{ user?.lastName }}</h2>
            <p class="user-type">{{ userTypeText }}</p>
            <p class="user-phone">{{ formatPhone(user?.phone) }}</p>
          </div>
        </div>
      </div>

      <!-- Profile Details -->
      <div class="profile-details">
        <div class="detail-card">
          <h3 class="detail-title">Kişisel Bilgiler</h3>
          <div class="detail-list">
            <div class="detail-item">
              <span class="detail-label">Ad:</span>
              <span class="detail-value">{{ user?.firstName || 'Belirtilmemiş' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Soyad:</span>
              <span class="detail-value">{{ user?.lastName || 'Belirtilmemiş' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Telefon:</span>
              <span class="detail-value">{{ formatPhone(user?.phone) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">E-posta:</span>
              <span class="detail-value">{{ user?.email || 'Belirtilmemiş' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Hesap Türü:</span>
              <span class="detail-value">{{ userTypeText }}</span>
            </div>
          </div>
        </div>

        <!-- Account Actions -->
        <div class="account-actions">
          <h3 class="detail-title">Hesap İşlemleri</h3>
          <div class="action-buttons">
            <button class="action-btn primary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Profili Düzenle
            </button>
            <button class="action-btn secondary">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Şifre Değiştir
            </button>
            <button class="action-btn danger" @click="handleLogout">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user)

const userTypeText = computed(() => {
  if (!user.value?.userType) return 'Belirtilmemiş'
  return user.value.userType === 'worker' ? 'İş Arayan' : 'İş Veren'
})

const formatPhone = (phone: string) => {
  if (!phone) return 'Belirtilmemiş'
  // Format phone number as 5XX XXX XX XX
  const clean = phone.replace(/\D/g, '')
  if (clean.length === 11) {
    return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 8)} ${clean.slice(8)}`
  }
  return phone
}

const handleLogout = () => {
  Swal.fire({
    title: 'Çıkış Yap',
    text: 'Çıkış yapmak istediğinizden emin misiniz?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Evet, Çıkış Yap',
    cancelButtonText: 'İptal',
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      authStore.logout()
      router.push('/')
      Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Başarıyla çıkış yapıldı',
        confirmButtonText: 'Tamam',
        confirmButtonColor: '#10b981'
      })
    }
  })
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
}

.profile-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-info {
  flex: 1;
}

.user-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.user-type {
  font-size: 1rem;
  color: #10b981;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
}

.user-phone {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.profile-details {
  display: grid;
  gap: 2rem;
}

.detail-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.detail-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f3f4f6;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #374151;
  min-width: 120px;
}

.detail-value {
  color: #6b7280;
  text-align: right;
  flex: 1;
}

.account-actions {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.2rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-size: 0.8rem;
}

.action-btn svg {
  width: 1rem;
  height: 1rem;
}

.action-btn.primary {
  background: #10b981;
  color: white;
}

.action-btn.primary:hover {
  background: #059669;
  transform: translateY(-2px);
}

.action-btn.secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.action-btn.secondary:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

.action-btn.danger {
  background: #ef4444;
  color: white;
}

.action-btn.danger:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .profile-content {
    padding: 1rem;
  }
  
  .header-content {
    padding: 0 1rem;
  }
  
  .card-header {
    flex-direction: column;
    text-align: center;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .detail-value {
    text-align: left;
  }
}
</style> 
<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">Giriş Yap</h2>
        <button @click="closeModal" class="modal-close">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- User Type Selection -->
        <div class="user-type-selection">
          <h3 class="section-title">Hesap Türü Seçin</h3>
          <div class="user-type-buttons">
            <button 
              @click="selectedType = 'worker'"
              :class="['user-type-btn', { active: selectedType === 'worker' }]"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>İş Arayan</span>
            </button>
            <button 
              @click="selectedType = 'employer'"
              :class="['user-type-btn', { active: selectedType === 'employer' }]"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"></path>
              </svg>
              <span>İş Veren</span>
            </button>
          </div>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="login-form" novalidate>
          <div class="form-group">
            <label class="form-label">Telefon Numarası</label>
            <input 
              v-model="form.phone"
              type="tel"
              placeholder="5XX XXX XX XX"
              class="form-input"
              @input="formatPhoneNumber"
              maxlength="13"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Şifre</label>
            <div class="password-input">
              <input 
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Şifrenizi girin"
                class="form-input"
                required
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="password-toggle"
              >
                <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="loading-spinner"></span>
              {{ loading ? 'Giriş Yapılıyor...' : 'Giriş Yap' }}
            </button>
          </div>

          <div class="form-footer">
            <p class="text-center">
              Hesabınız yok mu? 
              <button type="button" @click="switchToRegister" class="link-btn">
                Kayıt Ol
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  switchToRegister: []
}>()

const authStore = useAuthStore()
const selectedType = ref<'worker' | 'employer'>('worker')
const showPassword = ref(false)
const loading = ref(false)

const form = ref({
  phone: '',
  password: ''
})

const closeModal = () => {
  emit('close')
}

const switchToRegister = () => {
  emit('switchToRegister')
}

const formatPhoneNumber = (event: Event) => {
  const input = event.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '') // Remove non-digits
  
  // Limit to 11 digits
  if (value.length > 11) {
    value = value.slice(0, 11)
  }
  
  // Format as 5XX XXX XX XX
  if (value.length >= 3) {
    value = value.slice(0, 3) + ' ' + value.slice(3)
  }
  if (value.length >= 7) {
    value = value.slice(0, 7) + ' ' + value.slice(7)
  }
  if (value.length >= 10) {
    value = value.slice(0, 10) + ' ' + value.slice(10)
  }
  
  form.value.phone = value.trim()
}

const handleLogin = async (event?: Event) => {
  // Prevent form submission if event is provided
  if (event) {
    event.preventDefault()
  }

  if (!form.value.phone || !form.value.password) {
    Swal.fire({
      icon: 'warning',
      title: 'Uyarı',
      text: 'Lütfen tüm alanları doldurun',
      confirmButtonText: 'Tamam',
      confirmButtonColor: '#10b981',
      allowOutsideClick: false,
      allowEscapeKey: false
    })
    return
  }

  // Remove formatting for API call
  const cleanPhone = form.value.phone.replace(/\s/g, '')

  loading.value = true
  try {
    await authStore.login(cleanPhone, selectedType.value, form.value.password)
    await Swal.fire({
      icon: 'success',
      title: 'Başarılı!',
      text: 'Giriş başarılı!',
      confirmButtonText: 'Tamam',
      confirmButtonColor: '#10b981',
      allowOutsideClick: false,
      allowEscapeKey: false
    })
    closeModal()
    // Redirect to profile page after successful login
    window.location.href = '/profile'
  } catch (error: any) {
    await Swal.fire({
      icon: 'error',
      title: 'Hata',
      text: 'Giriş başarısız: ' + (error.response?.data?.message || error.message || 'Bilinmeyen hata'),
      confirmButtonText: 'Tamam',
      confirmButtonColor: '#ef4444',
      allowOutsideClick: false,
      allowEscapeKey: false
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.3s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #374151;
}

.modal-body {
  padding: 1.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.user-type-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.user-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
  color: #6b7280;
}

.user-type-btn:hover {
  border-color: #10b981;
  color: #10b981;
}

.user-type-btn.active {
  border-color: #10b981;
  background: #f0fdf4;
  color: #10b981;
}

.user-type-btn svg {
  width: 2rem;
  height: 2rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
}

.password-toggle:hover {
  color: #374151;
}

.form-actions {
  margin-top: 1rem;
}

.btn {
  width: 100%;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #10b981;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #059669;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.form-footer {
  text-align: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.link-btn {
  background: none;
  border: none;
  color: #10b981;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.link-btn:hover {
  color: #059669;
}
</style> 
<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">{{ isPhoneVerified ? 'Kayıt Ol' : 'Telefon Doğrulama' }}</h2>
        <button @click="closeModal" class="modal-close">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <!-- Phone Verification Step -->
        <div v-if="!isPhoneVerified" class="phone-verification">
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

          <form @submit.prevent="checkPhone" class="phone-form" novalidate>
            <div class="form-group">
              <label class="form-label">Telefon Numarası</label>
              <input 
                v-model="phoneNumber"
                type="tel"
                placeholder="5XX XXX XX XX"
                class="form-input"
                @input="formatPhoneNumber"
                maxlength="14"
                required
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="loading-spinner"></span>
                {{ loading ? 'Kontrol Ediliyor...' : 'Telefon Numarasını Kontrol Et' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Registration Form -->
        <div v-else class="registration-form">
          <div class="verified-phone">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Telefon doğrulandı: {{ phoneNumber }}</span>
          </div>

          <form @submit.prevent="handleRegister" class="register-form" novalidate>
            <div class="form-group">
              <label class="form-label">Ad</label>
              <input 
                v-model="form.firstName"
                type="text"
                placeholder="Adınız"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Soyad</label>
              <input 
                v-model="form.lastName"
                type="text"
                placeholder="Soyadınız"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">E-posta</label>
              <input 
                v-model="form.email"
                type="email"
                placeholder="ornek@email.com"
                class="form-input"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Şifre</label>
              <div class="password-input">
                <input 
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Şifrenizi oluşturun"
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

            <div class="form-group">
              <label class="form-label">Şifre Tekrar</label>
              <div class="password-input">
                <input 
                  v-model="form.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Şifrenizi tekrar girin"
                  class="form-input"
                  required
                />
                <button 
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="password-toggle"
                >
                  <svg v-if="showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                {{ loading ? 'Kayıt Oluşturuluyor...' : 'Kayıt Ol' }}
              </button>
            </div>

            <div class="form-footer">
              <p class="text-center">
                Zaten hesabınız var mı? 
                <button type="button" @click="switchToLogin" class="link-btn">
                  Giriş Yap
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import Swal from 'sweetalert2'
import { API_CONFIG } from '@/config'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
  switchToLogin: []
}>()

const selectedType = ref<'worker' | 'employer'>('worker')
const phoneNumber = ref('')
const isPhoneVerified = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const closeModal = () => {
  emit('close')
  // Reset form when closing
  isPhoneVerified.value = false
  phoneNumber.value = ''
  form.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
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
  
  phoneNumber.value = value.trim()
}

const switchToLogin = () => {
  emit('switchToLogin')
}

const checkPhone = async (event?: Event) => {
  // Prevent form submission if event is provided
  if (event) {
    event.preventDefault()
  }

  if (!phoneNumber.value) {
    await Swal.fire({
      icon: 'warning',
      title: 'Uyarı',
      text: 'Lütfen telefon numarasını girin',
      confirmButtonText: 'Tamam',
      confirmButtonColor: '#10b981',
      allowOutsideClick: false,
      allowEscapeKey: false
    })
    return
  }

  // Remove formatting for API call
  const cleanPhone = phoneNumber.value.replace(/\s/g, '')

  loading.value = true
  try {
    // API call to check phone
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CHECK_PHONE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone: cleanPhone })
    })

    const data = await response.json()
    
    if (data.success) {
      isPhoneVerified.value = true
      await Swal.fire({
        icon: 'success',
        title: 'Başarılı!',
        text: 'Telefon numarası doğrulandı!',
        confirmButtonText: 'Devam Et',
        confirmButtonColor: '#10b981',
        allowOutsideClick: false,
        allowEscapeKey: false
      })
    } else {
      await Swal.fire({
        icon: 'error',
        title: 'Hata',
        text: 'Bu telefon numarası zaten kayıtlı!',
        confirmButtonText: 'Tamam',
        confirmButtonColor: '#ef4444',
        allowOutsideClick: false,
        allowEscapeKey: false
      })
    }
  } catch (error) {
    console.error('Phone check error:', error)
    await Swal.fire({
      icon: 'error',
      title: 'Hata',
      text: 'Telefon kontrolü sırasında hata oluştu',
      confirmButtonText: 'Tamam',
      confirmButtonColor: '#ef4444',
      allowOutsideClick: false,
      allowEscapeKey: false
    })
  } finally {
    loading.value = false
  }
}

const handleRegister = async (event?: Event) => {
  // Prevent form submission if event is provided
  if (event) {
    event.preventDefault()
  }

  if (!form.value.firstName || !form.value.lastName || !form.value.email || !form.value.password || !form.value.confirmPassword) {
    await Swal.fire({
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

  if (form.value.password !== form.value.confirmPassword) {
    await Swal.fire({
      icon: 'error',
      title: 'Hata',
      text: 'Şifreler eşleşmiyor',
      confirmButtonText: 'Tamam',
      confirmButtonColor: '#ef4444',
      allowOutsideClick: false,
      allowEscapeKey: false
    })
    return
  }

  loading.value = true
  try {
    // API call for registration
    const cleanPhone = phoneNumber.value.replace(/\s/g, '')
    const registrationData = {
      type: selectedType.value,
      phone: cleanPhone,
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password
    }

    console.log('Registration data:', registrationData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    await Swal.fire({
      icon: 'success',
      title: 'Başarılı!',
      text: 'Kayıt başarılı!',
      confirmButtonText: 'Tamam',
      confirmButtonColor: '#10b981',
      allowOutsideClick: false,
      allowEscapeKey: false
    })
    closeModal()
  } catch (error) {
    await Swal.fire({
      icon: 'error',
      title: 'Hata',
      text: 'Kayıt başarısız: ' + error,
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

.phone-form,
.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.verified-phone {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f0fdf4;
  border: 1px solid #10b981;
  border-radius: 8px;
  color: #065f46;
  margin-bottom: 1.5rem;
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
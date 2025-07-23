<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-secondary-900 mb-2">OnlineJobs</h1>
        <h2 class="text-2xl font-semibold text-secondary-700 mb-8">Hesap Oluşturun</h2>
      </div>
      
      <div class="card">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-secondary-700 mb-2">
                Ad
              </label>
              <input
                id="firstName"
                v-model="form.firstName"
                type="text"
                required
                class="input-field"
                placeholder="Adınız"
              />
            </div>
            
            <div>
              <label for="lastName" class="block text-sm font-medium text-secondary-700 mb-2">
                Soyad
              </label>
              <input
                id="lastName"
                v-model="form.lastName"
                type="text"
                required
                class="input-field"
                placeholder="Soyadınız"
              />
            </div>
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-secondary-700 mb-2">
              E-posta Adresi
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="ornek@email.com"
            />
          </div>
          
          <div>
            <label for="password" class="block text-sm font-medium text-secondary-700 mb-2">
              Şifre
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              class="input-field"
              placeholder="En az 6 karakter"
            />
          </div>
          
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-secondary-700 mb-2">
              Şifre Tekrar
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              type="password"
              required
              class="input-field"
              placeholder="Şifrenizi tekrar girin"
            />
          </div>
          
          <div>
            <label for="userType" class="block text-sm font-medium text-secondary-700 mb-2">
              Hesap Türü
            </label>
            <select
              id="userType"
              v-model="form.userType"
              required
              class="input-field"
            >
              <option value="">Seçiniz</option>
              <option value="jobseeker">İş Arayan</option>
              <option value="employer">İş Veren</option>
            </select>
          </div>
          
          <div class="flex items-center">
            <input
              id="terms"
              v-model="form.agreeToTerms"
              type="checkbox"
              required
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
            />
            <label for="terms" class="ml-2 block text-sm text-secondary-700">
              <a href="#" class="text-primary-600 hover:text-primary-500">Kullanım Şartları</a> ve 
              <a href="#" class="text-primary-600 hover:text-primary-500">Gizlilik Politikası</a>'nı kabul ediyorum
            </label>
          </div>
          
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-red-600 text-sm">{{ error }}</p>
          </div>
          
          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary py-3 text-lg font-medium"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Kayıt olunuyor...
            </span>
            <span v-else>Hesap Oluştur</span>
          </button>
        </form>
        
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-secondary-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-secondary-500">Veya</span>
            </div>
          </div>
          
          <div class="mt-6">
            <button
              type="button"
              class="w-full flex justify-center items-center px-4 py-2 border border-secondary-300 rounded-lg shadow-sm bg-white text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
            >
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google ile Kayıt Ol
            </button>
          </div>
        </div>
        
        <div class="mt-6 text-center">
          <p class="text-sm text-secondary-600">
            Zaten hesabınız var mı?
            <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
              Giriş yapın
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Swal from 'sweetalert2'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  userType: '',
  agreeToTerms: false
})

const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  if (form.password !== form.confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Hata',
      text: 'Şifreler eşleşmiyor',
      confirmButtonText: 'Tamam',
      confirmButtonColor: '#ef4444'
    })
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    await authStore.register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      userType: form.userType
    })
    Swal.fire({
      icon: 'success',
      title: 'Başarılı!',
      text: 'Kayıt başarılı!',
      confirmButtonText: 'Tamam',
      confirmButtonColor: '#10b981'
    }).then(() => {
      router.push('/profile')
    })
  } catch (err: any) {
    Swal.fire({
      icon: 'error',
      title: 'Hata',
      text: err.response?.data?.message || 'Kayıt olurken bir hata oluştu',
      confirmButtonText: 'Tamam',
      confirmButtonColor: '#ef4444'
    })
  } finally {
    loading.value = false
  }
}
</script> 
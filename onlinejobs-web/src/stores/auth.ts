import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const token = ref<string | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value)
  const userType = computed(() => user.value?.userType)
  const isWorker = computed(() => userType.value === 'worker')

  const login = async (phone: string, userType: string, password: string) => {
    loading.value = true
    try {
      const response = await authService.login(phone, userType, password)
      user.value = response.user
      token.value = response.accessToken
      localStorage.setItem('token', response.accessToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: any) => {
    loading.value = true
    try {
      const response = await authService.register(userData)
      user.value = response.user
      token.value = response.token
      localStorage.setItem('token', response.token)
      localStorage.setItem('user', JSON.stringify(response.user))
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    authService.logout()
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const initializeAuth = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      token.value = storedToken
      user.value = JSON.parse(storedUser)
    }
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    userType,
    isWorker,
    login,
    register,
    logout,
    initializeAuth
  }
}) 
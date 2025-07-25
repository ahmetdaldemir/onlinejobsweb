import axios from 'axios'
import { API_CONFIG } from '@/config'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - token ekleme
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.token || localStorage.getItem('token')
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only logout for auth-related endpoints
    if (error.response?.status === 401 && 
        (error.config.url?.includes('/auth/') || 
         error.config.url?.includes('/profile'))) {
      const authStore = useAuthStore()
      authStore.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authService = {
  login: async (phone: string, userType: string, password: string) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.LOGIN, { phone, userType, password })
    return response.data
  },
  
  register: async (userData: any) => {
    const response = await api.post(API_CONFIG.ENDPOINTS.REGISTER, userData)
    return response.data
  },
  
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }
}

export const categoryService = {
  getCategories: async () => {
    const response = await api.get(API_CONFIG.ENDPOINTS.CATEGORIES)
    return response.data
  },
  
  getCategoriesByParent: async (parentId: string | null = null) => {
    const params = parentId ? { parent_id: parentId } : {}
    const response = await api.get(API_CONFIG.ENDPOINTS.CATEGORIES, { params })
    return response.data
  }
}

export const workerService = {
  getOnlineWorkers: async (latitude: number, longitude: number, radius: number = 200, categoryId?: string) => {
    const params: any = {
      latitude,
      longitude,
      radius
    }
    
    if (categoryId) {
      params.categoryId = categoryId
    }
    
    // Use the authenticated API instance for online workers
    const response = await api.get(API_CONFIG.ENDPOINTS.ONLINE_WORKERS, { params })
    return response.data
  }
}

export const messageService = {
  getConversationHistory: async (userId: string) => {
    const response = await api.get(`${API_CONFIG.ENDPOINTS.CONVERSATION_HISTORY}/${userId}`)
    return response.data
  },
  
  getConversationMessages: async (conversationId: string) => {
    const response = await api.get(`/messages/conversation/${conversationId}`)
    return response.data
  },
  
  sendMessage: async (receiverId: string, content: string, type: string = 'text') => {
    const response = await api.post(API_CONFIG.ENDPOINTS.MESSAGES, {
      receiverId,
      content,
      type
    })
    return response.data
  }
}

export default api 
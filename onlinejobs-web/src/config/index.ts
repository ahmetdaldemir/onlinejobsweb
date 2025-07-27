// Environment configuration
const isDevelopment = import.meta.env.MODE === 'development'

// API Configuration
export const API_CONFIG = {
  // Use environment variable or fallback to development/production URLs
  BASE_URL: import.meta.env.VITE_API_BASE_URL || (
    isDevelopment 
      ? 'http://localhost:3000' 
      : 'https://onlinejobs.onrender.com'
  ),
  
  // API Endpoints
  ENDPOINTS: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    CHECK_PHONE: '/check-phone',
    CATEGORIES: '/categories',
    CATEGORIES_BY_PARENT: '/categories/parent',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
    ONLINE_WORKERS: '/users/online-workers',
    MESSAGES: '/messages',
    CONVERSATION_HISTORY: '/messages/conversation'
  }
}

// App Configuration
export const APP_CONFIG = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Online Jobs',
  VERSION: '1.0.0',
  DEBUG: import.meta.env.VITE_DEBUG === 'true' || isDevelopment
}

// Log configuration for debugging
if (APP_CONFIG.DEBUG) {
  console.log('🔧 API Configuration:', API_CONFIG)
  console.log('🔧 App Configuration:', APP_CONFIG)
} 
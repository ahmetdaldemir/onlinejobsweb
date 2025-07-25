import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/stores/auth'
import { API_CONFIG } from '@/config'

class SocketService {
  private socket: Socket | null = null
  private isConnected = false
  private isWorkerMode = false
  private connectionInterval: NodeJS.Timeout | null = null

  connect() {
    const authStore = useAuthStore()
    const token = authStore.token

    console.log('=== Socket Connect Attempt ===')
    console.log('Auth store token:', token ? 'Mevcut' : 'Yok')
    console.log('Current socket:', this.socket ? 'Mevcut' : 'Yok')
    console.log('Current connection status:', this.isConnected)

    if (!token) {
      console.error('No authentication token available')
      return null
    }

    // Validate token format
    if (typeof token !== 'string' || token.length < 10) {
      console.error('Invalid token format:', token)
      return null
    }

    // Use the same base URL as the API configuration
    const socketUrl = API_CONFIG.BASE_URL
    console.log('Socket bağlantısı başlatılıyor... URL:', socketUrl)
    console.log('Token length:', token.length)
    console.log('Token preview:', token.substring(0, 20) + '...')

    // Disconnect existing connection if any
    if (this.socket) {
      console.log('Mevcut bağlantı kapatılıyor...')
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }

    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        token: token
      },
      extraHeaders: {
        'Authorization': `Bearer ${token}`
      },
      query: {
        token: token
      }
    })

    this.socket.on('connect', () => {
      console.log('✅ Bağlandı! Socket ID:', this.socket?.id)
      this.isConnected = true
    })

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Bağlantı kesildi. Sebep:', reason)
      this.isConnected = false
    })

    this.socket.on('connect_error', (error) => {
      console.error('❌ Bağlantı hatası:', error)
      this.isConnected = false
    })

    this.socket.on('error', (error) => {
      console.error('❌ Socket hatası:', error)
    })

    this.socket.on('auth_error', (error) => {
      console.error('❌ Kimlik doğrulama hatası:', error)
      this.isConnected = false
    })

    this.socket.on('unauthorized', (error) => {
      console.error('❌ Yetkisiz erişim:', error)
      this.isConnected = false
    })

    // Add more detailed event listeners
    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Yeniden bağlanıyor... Deneme:', attemptNumber)
    })

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ Yeniden bağlanma hatası:', error)
    })

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Yeniden bağlanma başarısız')
    })

    this.socket.on('ping', () => {
      console.log('🏓 Ping gönderildi')
    })

    this.socket.on('pong', (latency) => {
      console.log('🏓 Pong alındı, gecikme:', latency)
    })

    console.log('Socket instance oluşturuldu, bağlantı bekleniyor...')
    return this.socket
  }

  isAuthenticated() {
    const authStore = useAuthStore()
    return !!authStore.token
  }

  joinConversation(otherUserId: string) {
    if (!this.socket || !this.isConnected) {
      console.error('Socket bağlantısı yok')
      return
    }

    this.socket.emit('join_conversation', {
      otherUserId: otherUserId
    })

    console.log(`${otherUserId} ile konuşmaya katılındı`)
  }

  sendMessage(content: string, receiverId: string, type: string = 'text'): Promise<boolean> | void {
    console.log('=== Send Message Attempt ===')
    console.log('Socket instance:', this.socket ? 'Mevcut' : 'Yok')
    console.log('Connection status:', this.isConnected)
    console.log('Message content:', content)
    console.log('Receiver ID:', receiverId)
    console.log('Message type:', type)
    
    // Ensure socket is connected
    if (!this.socket || !this.isConnected) {
      console.log('🔄 Socket not connected, attempting to connect...')
      const socket = this.connect()
      if (!socket) {
        console.error('❌ Socket bağlantısı kurulamadı')
        throw new Error('Socket bağlantısı kurulamadı')
      }
      
      // Wait for connection to establish
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Socket bağlantısı zaman aşımı'))
        }, 5000)
        
        const checkConnection = () => {
          if (this.isConnected) {
            clearTimeout(timeout)
            this.emitMessage(content, receiverId, type)
            resolve(true)
          } else {
            setTimeout(checkConnection, 100)
          }
        }
        checkConnection()
      })
    }
    
    // Socket is connected, send message immediately
    this.emitMessage(content, receiverId, type)
  }

  private emitMessage(content: string, receiverId: string, type: string = 'text') {
    try {
      const messageData = {
        receiverId: receiverId,
        content: content,
        type: type
      }
      
      console.log('📤 Mesaj gönderiliyor:', messageData)
      this.socket!.emit('send_message', messageData)
      console.log('✅ Mesaj emit edildi')
    } catch (error) {
      console.error('❌ Mesaj gönderirken hata oluştu:', error)
      throw error
    }
  }

  onMessageSent(callback: (data: any) => void) {
    if (!this.socket) return

    this.socket.on('message_sent', (data) => {
      console.log('Mesaj gönderildi:', data.id)
      callback(data)
    })
  }

  onNewMessage(callback: (data: any) => void) {
    if (!this.socket) return

    this.socket.on('new_message', (data) => {
      console.log('Yeni mesaj:', data.content)
      callback(data)
    })
  }

  onUserTyping(callback: (data: any) => void) {
    if (!this.socket) return

    this.socket.on('user_typing', callback)
  }

  onUserStoppedTyping(callback: (data: any) => void) {
    if (!this.socket) return

    this.socket.on('user_stopped_typing', callback)
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
    
    // Stop worker mode if active
    if (this.isWorkerMode) {
      this.disableWorkerMode()
    }
  }

  getSocket() {
    return this.socket
  }

  isSocketConnected() {
    return this.isConnected
  }

  // Worker mode management
  enableWorkerMode() {
    console.log('🔧 Worker modu etkinleştiriliyor...')
    this.isWorkerMode = true
    this.startWorkerConnection()
  }

  disableWorkerMode() {
    console.log('🔧 Worker modu devre dışı bırakılıyor...')
    this.isWorkerMode = false
    this.stopWorkerConnection()
  }

  private startWorkerConnection() {
    if (this.connectionInterval) {
      clearInterval(this.connectionInterval)
    }

    // Initial connection
    this.connect()

    // Keep connection alive for workers
    this.connectionInterval = setInterval(() => {
      if (this.isWorkerMode && (!this.socket || !this.isConnected)) {
        console.log('🔄 Worker bağlantısı yeniden kuruluyor...')
        this.connect()
      }
    }, 30000) // Check every 30 seconds

    console.log('✅ Worker bağlantı yönetimi başlatıldı')
  }

  private stopWorkerConnection() {
    if (this.connectionInterval) {
      clearInterval(this.connectionInterval)
      this.connectionInterval = null
    }
    console.log('🛑 Worker bağlantı yönetimi durduruldu')
  }

  isWorkerModeActive() {
    return this.isWorkerMode
  }

  // Global message listener for all authenticated users
  setupGlobalMessageListener(callback: (data: any) => void) {
    if (!this.socket) {
      console.error('Socket bağlantısı yok, global message listener kurulamadı')
      return
    }

    this.socket.on('new_message', (data) => {
      console.log('📨 Yeni mesaj geldi:', data)
      callback(data)
    })

    console.log('✅ Global message listener kuruldu')
  }

  removeGlobalMessageListener() {
    if (this.socket) {
      this.socket.off('new_message')
      console.log('🛑 Global message listener kaldırıldı')
    }
  }

  debugConnection() {
    const authStore = useAuthStore()
    console.log('=== Socket Debug Info ===')
    console.log('Socket instance:', this.socket ? 'Mevcut' : 'Yok')
    console.log('Connection status:', this.isConnected)
    console.log('Authentication token:', authStore.token ? 'Mevcut' : 'Yok')
    console.log('User authenticated:', this.isAuthenticated())
    console.log('API Base URL:', API_CONFIG.BASE_URL)
    if (this.socket) {
      console.log('Socket ID:', this.socket.id)
      console.log('Socket connected:', this.socket.connected)
    }
    console.log('========================')
  }

  testConnection() {
    console.log('=== Testing Socket Connection ===')
    this.debugConnection()
    
    // First test without authentication
    this.testConnectionWithoutAuth()
    
    if (!this.isAuthenticated()) {
      console.error('❌ User not authenticated')
      return false
    }
    
    // Check if server is reachable
    this.checkServerReachability()
    
    if (!this.socket) {
      console.log('🔄 Attempting to connect...')
      const socket = this.connect()
      if (!socket) {
        console.error('❌ Failed to create socket instance')
        return false
      }
      // Wait a bit for connection to establish
      setTimeout(() => {
        if (this.isConnected) {
          console.log('✅ Connection established after delay')
        } else {
          console.error('❌ Connection failed after delay')
        }
      }, 2000)
      return false
    }
    
    if (!this.isConnected) {
      console.log('🔄 Socket exists but not connected, attempting to reconnect...')
      this.connect()
      return false
    }
    
    console.log('✅ Socket connection is ready')
    return true
  }

  checkServerReachability() {
    const socketUrl = API_CONFIG.BASE_URL
    console.log('🔍 Checking server reachability:', socketUrl)
    
    // Try to fetch a simple endpoint to check if server is reachable
    fetch(`${socketUrl}/health`, { 
      method: 'GET',
      mode: 'no-cors' // This will fail but we can see if the server responds
    }).then(() => {
      console.log('✅ Server is reachable')
    }).catch((error) => {
      console.warn('⚠️ Server reachability check failed:', error)
      console.log('This might be normal if the server doesn\'t have a /health endpoint')
    })

    // Test socket.io endpoint specifically
    this.testSocketEndpoint(socketUrl)
    
    // Check if server is running on localhost
    if (socketUrl.includes('localhost')) {
      this.checkLocalhostServer()
    }
  }

  checkLocalhostServer() {
    console.log('🔍 Checking localhost server...')
    
    // Only test the configured port (3000) as requested
    const testUrl = 'http://localhost:3000'
    console.log(`🔍 Testing configured port 3000...`)
    
    const testSocket = io(testUrl, {
      timeout: 3000,
      forceNew: true
    })

    testSocket.on('connect', () => {
      console.log(`✅ Socket server found on port 3000`)
      testSocket.disconnect()
    })

    testSocket.on('connect_error', (error) => {
      console.log(`❌ No socket server on port 3000:`, error.message)
    })

    setTimeout(() => {
      if (testSocket.connected) {
        console.log(`✅ Port 3000 is working`)
        testSocket.disconnect()
      }
    }, 3000)
  }

  testSocketEndpoint(baseUrl: string) {
    console.log('🔍 Testing Socket.IO endpoint...')
    
    // Create a temporary socket to test connection
    const testSocket = io(baseUrl, {
      timeout: 5000,
      forceNew: true
    })

    testSocket.on('connect', () => {
      console.log('✅ Socket.IO server is reachable')
      testSocket.disconnect()
    })

    testSocket.on('connect_error', (error) => {
      console.error('❌ Socket.IO server is not reachable:', error)
    })

    // Timeout after 5 seconds
    setTimeout(() => {
      if (testSocket.connected) {
        console.log('✅ Socket.IO connection test successful')
        testSocket.disconnect()
      } else {
        console.error('❌ Socket.IO connection test failed - timeout')
      }
    }, 5000)
  }

  testConnectionWithoutAuth() {
    const socketUrl = API_CONFIG.BASE_URL
    console.log('🔍 Testing connection without authentication...')
    
    const testSocket = io(socketUrl, {
      timeout: 10000,
      forceNew: true
    })

    testSocket.on('connect', () => {
      console.log('✅ Connection successful without auth - server is reachable')
      testSocket.disconnect()
    })

    testSocket.on('connect_error', (error) => {
      console.error('❌ Connection failed without auth:', error)
    })

    setTimeout(() => {
      if (testSocket.connected) {
        console.log('✅ Unauthenticated connection test successful')
        testSocket.disconnect()
      } else {
        console.error('❌ Unauthenticated connection test failed')
      }
    }, 10000)
  }

  testDifferentAuthMethods() {
    const socketUrl = API_CONFIG.BASE_URL
    const authStore = useAuthStore()
    const token = authStore.token
    
    if (!token) {
      console.error('No token available for auth testing')
      return
    }

    console.log('🔍 Testing different authentication methods...')
    
    // Method 1: Token in auth object
    const socket1 = io(socketUrl, {
      auth: { token: token },
      timeout: 5000,
      forceNew: true
    })

    socket1.on('connect', () => {
      console.log('✅ Method 1 (auth.token) successful')
      socket1.disconnect()
    })

    socket1.on('connect_error', (error) => {
      console.log('❌ Method 1 failed:', error.message)
    })

    // Method 2: Token in query string
    const socket2 = io(socketUrl, {
      query: { token: token },
      timeout: 5000,
      forceNew: true
    })

    socket2.on('connect', () => {
      console.log('✅ Method 2 (query.token) successful')
      socket2.disconnect()
    })

    socket2.on('connect_error', (error) => {
      console.log('❌ Method 2 failed:', error.message)
    })

    // Method 3: Bearer token in headers
    const socket3 = io(socketUrl, {
      extraHeaders: { 'Authorization': `Bearer ${token}` },
      timeout: 5000,
      forceNew: true
    })

    socket3.on('connect', () => {
      console.log('✅ Method 3 (Bearer header) successful')
      socket3.disconnect()
    })

    socket3.on('connect_error', (error) => {
      console.log('❌ Method 3 failed:', error.message)
    })

    // Cleanup after 6 seconds
    setTimeout(() => {
      socket1.disconnect()
      socket2.disconnect()
      socket3.disconnect()
    }, 6000)
  }

  testLocalhostSocket() {
    console.log('🔍 Testing localhost:3000 socket server specifically...')
    
    const testSocket = io('http://localhost:3000', {
      timeout: 10000,
      forceNew: true
    })

    testSocket.on('connect', () => {
      console.log('✅ Localhost:3000 socket server is reachable')
      console.log('Socket ID:', testSocket.id)
      testSocket.disconnect()
    })

    testSocket.on('connect_error', (error) => {
      console.error('❌ Localhost:3000 socket server error:', error)
    })

    testSocket.on('disconnect', (reason) => {
      console.log('❌ Localhost:3000 disconnected. Reason:', reason)
    })

    setTimeout(() => {
      if (testSocket.connected) {
        console.log('✅ Localhost:3000 connection test successful')
        testSocket.disconnect()
      } else {
        console.error('❌ Localhost:3000 connection test failed')
      }
    }, 10000)
  }

  testAuthenticatedLocalhost() {
    const authStore = useAuthStore()
    const token = authStore.token
    
    if (!token) {
      console.error('No token available for authenticated test')
      return
    }

    console.log('🔍 Testing authenticated connection to localhost:3000...')
    console.log('Token length:', token.length)
    
    const testSocket = io('http://localhost:3000', {
      auth: { token: token },
      extraHeaders: { 'Authorization': `Bearer ${token}` },
      query: { token: token },
      timeout: 10000,
      forceNew: true
    })

    testSocket.on('connect', () => {
      console.log('✅ Authenticated connection to localhost:3000 successful')
      console.log('Socket ID:', testSocket.id)
      
      // Try to emit a test event
      testSocket.emit('test_auth', { message: 'Authentication test' })
      console.log('Test event emitted')
      
      testSocket.disconnect()
    })

    testSocket.on('connect_error', (error) => {
      console.error('❌ Authenticated connection failed:', error)
      console.log('Error details:', error.message)
    })

    testSocket.on('disconnect', (reason) => {
      console.log('❌ Authenticated connection disconnected. Reason:', reason)
    })

    testSocket.on('auth_error', (error) => {
      console.error('❌ Authentication error:', error)
    })

    setTimeout(() => {
      if (testSocket.connected) {
        console.log('✅ Authenticated localhost:3000 test successful')
        testSocket.disconnect()
      } else {
        console.error('❌ Authenticated localhost:3000 test failed')
      }
    }, 10000)
  }

  testServerAuthMethods() {
    const authStore = useAuthStore()
    const token = authStore.token
    
    if (!token) {
      console.error('No token available for server auth testing')
      return
    }

    console.log('🔍 Testing different server authentication methods...')
    
    // Test 1: Only auth.token
    const socket1 = io('http://localhost:3000', {
      auth: { token: token },
      timeout: 5000,
      forceNew: true
    })

    socket1.on('connect', () => {
      console.log('✅ Method 1 (auth.token only) - SUCCESS')
      socket1.disconnect()
    })

    socket1.on('connect_error', (error) => {
      console.log('❌ Method 1 failed:', error.message)
    })

    // Test 2: Only query.token
    const socket2 = io('http://localhost:3000', {
      query: { token: token },
      timeout: 5000,
      forceNew: true
    })

    socket2.on('connect', () => {
      console.log('✅ Method 2 (query.token only) - SUCCESS')
      socket2.disconnect()
    })

    socket2.on('connect_error', (error) => {
      console.log('❌ Method 2 failed:', error.message)
    })

    // Test 3: Only Authorization header
    const socket3 = io('http://localhost:3000', {
      extraHeaders: { 'Authorization': `Bearer ${token}` },
      timeout: 5000,
      forceNew: true
    })

    socket3.on('connect', () => {
      console.log('✅ Method 3 (Authorization header only) - SUCCESS')
      socket3.disconnect()
    })

    socket3.on('connect_error', (error) => {
      console.log('❌ Method 3 failed:', error.message)
    })

    // Test 4: No authentication
    const socket4 = io('http://localhost:3000', {
      timeout: 5000,
      forceNew: true
    })

    socket4.on('connect', () => {
      console.log('✅ Method 4 (no auth) - SUCCESS - Server accepts unauthenticated connections')
      socket4.disconnect()
    })

    socket4.on('connect_error', (error) => {
      console.log('❌ Method 4 failed:', error.message)
    })

    // Cleanup after 6 seconds
    setTimeout(() => {
      socket1.disconnect()
      socket2.disconnect()
      socket3.disconnect()
      socket4.disconnect()
    }, 6000)
  }
}

export const socketService = new SocketService() 
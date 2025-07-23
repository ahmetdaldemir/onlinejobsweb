<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="flex items-center">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-green-600">WorkUp</h1>
            <div class="w-4 h-4 bg-green-500 rounded-full ml-2"></div>
          </div>
        </div>
        <nav class="nav">
          <a href="#" class="nav-link">Home</a>
          <a href="#" class="nav-link">Candidates</a>
          <a href="#" class="nav-link">Employers</a>
          <a href="#" class="nav-link">Jobs</a>
          <a href="#" class="nav-link">Blog</a>
          <a href="#" class="nav-link">Pages</a>
        </nav>
        <div class="flex items-center gap-4">
          <!-- Show user info when authenticated -->
          <div v-if="isAuthenticated" class="flex items-center gap-3">
            <div class="dropdown-container">
              <button @click="toggleDropdown" class="user-profile-btn">
                <div class="user-avatar">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div class="user-info">
                  <span class="user-name">{{ user?.firstName }} {{ user?.lastName }}</span>
                  <span class="user-type">{{ user?.userType === 'worker' ? 'İş Arayan' : 'İş Veren' }}</span>
                </div>
               
              </button>
              
              <!-- Dropdown Menu -->
              <div v-if="showDropdown" class="dropdown-menu">
                <div class="dropdown-header">
                  <div class="dropdown-user-info">
                    <div class="dropdown-avatar">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <div class="dropdown-user-details">
                      <span class="dropdown-user-name">{{ user?.firstName }} {{ user?.lastName }}</span>
                      <span class="dropdown-user-email">{{ user?.email }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="dropdown-divider"></div>
                
                <div class="dropdown-items">
                  <button @click="goToProfile" class="dropdown-item">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>Profilim</span>
                  </button>
                  
                  <button @click="goToSettings" class="dropdown-item">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>Ayarlar</span>
                  </button>
                  
                  <div class="dropdown-divider"></div>
                  
                  <button @click="handleLogout" class="dropdown-item logout-item">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <span>Çıkış Yap</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Show login/register buttons when not authenticated -->
          <div v-else class="flex items-center gap-4">
            <button @click="openLoginModal" class="btn btn-secondary">Login</button>
            <button @click="openRegisterModal" class="btn btn-primary">Register</button>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Searching for a job?
          </h1>
          <h2 class="hero-subtitle">
            Find the job that fit your life
          </h2>
          
          <!-- Search Bar -->
          <div class="search-container">
            <div class="search-bar">
              <input 
                type="text" 
                placeholder="Job Title or Keywords" 
                class="search-input"
              />
              <input 
                type="text" 
                placeholder="Location" 
                class="search-input"
              />
              <button class="search-button">
                FIND JOBS
              </button>
            </div>
          </div>

          <!-- Featured Employers -->
          <div class="featured-employers">
            <h3 class="featured-title">Featured Employers</h3>
            <div class="employers-grid">
              <div class="employer-item">
                <div class="employer-logo">CG</div>
                <div class="employer-info">
                  <h4>CoderGold ALT</h4>
                  <p>1 Open Job</p>
                </div>
              </div>
              <div class="employer-item">
                <div class="employer-logo">AB</div>
                <div class="employer-info">
                  <h4>AB Solutions</h4>
                  <p>3 Open Jobs</p>
                </div>
              </div>
              <div class="employer-item">
                <div class="employer-logo">DG</div>
                <div class="employer-info">
                  <h4>DG Company</h4>
                  <p>2 Open Jobs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="hero-image">
          <div class="image-placeholder">
            <div class="person-icon">👨‍💼</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section">
      <div class="section-content">
        <div class="section-header">
          <h2 class="section-title">{{ currentParentCategory ? currentParentCategory.name : 'İş Kategorileri' }}</h2>
          <p class="section-subtitle">{{ currentParentCategory ? `${currentParentCategory.name} kategorisindeki alt kategoriler` : 'Ana kategorileri keşfedin' }}</p>
        </div>
        
        <!-- Breadcrumb -->
        <div v-if="categoryPath.length > 0" class="breadcrumb">
          <button @click="goToRoot" class="breadcrumb-item">Ana Kategoriler</button>
          <span v-for="(category, index) in categoryPath" :key="category.id" class="breadcrumb-separator">/</span>
          <button 
            v-for="(category, index) in categoryPath" 
            :key="category.id"
            @click="goToCategory(category, index)"
            class="breadcrumb-item"
            :class="{ 'active': index === categoryPath.length - 1 }"
          >
            {{ category.name }}
          </button>
        </div>
        
        <!-- Categories Grid -->
        <div class="categories-grid">
          <div 
            v-for="category in categories" 
            :key="category.id"
            @click="selectCategory(category)"
            class="category-card"
          >
            <div class="category-icon">{{ category.icon || '📁' }}</div>
            <h3 class="category-title">{{ category.name }}</h3>
            <p class="category-description">{{ category.description || 'Kategori açıklaması' }}</p>
            <div class="category-meta">
              <span class="category-count">{{ category.jobCount || 0 }} iş</span>
              <span class="category-arrow">→</span>
            </div>
          </div>
        </div>
        
        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Kategoriler yükleniyor...</p>
        </div>
        
        <!-- Error State -->
        <div v-if="error" class="error-state">
          <p>{{ error }}</p>
          <button @click="loadCategories" class="retry-button">Tekrar Dene</button>
        </div>
      </div>
    </section>

    <!-- Online Workers Section -->
    <section v-if="isAuthenticated && onlineWorkers.length > 0" class="online-workers-section">
      <div class="section-content">
        <div class="section-header">
          <div class="section-header-content">
            <div>
              <h2 class="section-title">{{ currentParentCategory?.name }} - Çevrimiçi İşçiler</h2>
              <p class="section-subtitle">{{ onlineWorkers.length }} kişi bu kategoride çevrimiçi ve yakınınızda</p>
            </div>
            <button @click="goToRoot" class="back-btn">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Kategorilere Dön
            </button>
          </div>
        </div>
        
        <!-- Workers Loading State -->
        <div v-if="workersLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Çevrimiçi işçiler aranıyor...</p>
        </div>
        
        <!-- Workers Grid -->
        <div v-else class="workers-grid">
          <div 
            v-for="worker in onlineWorkers" 
            :key="worker.id"
            class="worker-card"
          >
            <div class="worker-avatar">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div class="worker-info">
              <h3 class="worker-name">{{ worker.firstName }} {{ worker.lastName }}</h3>
              <p class="worker-phone">{{ worker.phone }}</p>
              <p class="worker-email">{{ worker.email }}</p>
              <div class="worker-location" v-if="worker.userInfos && worker.userInfos.length > 0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>{{ worker.userInfos[0].address }}</span>
              </div>
              <div class="worker-meta">
                <div class="worker-status">
                  <span class="status-dot online"></span>
                  <span class="status-text">Çevrimiçi</span>
                </div>
                <div class="worker-distance" v-if="worker.distance">
                  <span class="distance-text">{{ worker.distance.toFixed(1) }} km uzaklıkta</span>
                </div>
              </div>
            </div>
            <div class="worker-actions">
              <button 
                class="contact-btn"
                @click="contactWorker(worker)"
              >
                İletişim
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Top Employers Section -->
    <section class="employers-section">
      <div class="section-content">
        <div class="section-header">
          <h2 class="section-title">Top Employers Of The Month</h2>
          <p class="section-subtitle">World top agency & employer with 7000+ jobs</p>
        </div>
        
        <div class="employers-logos">
          <div class="employer-logo-item" v-for="logo in employerLogos" :key="logo.id">
            <div class="logo-placeholder">{{ logo.symbol }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-grid">
          <div class="footer-section">
            <div class="footer-logo">
              <h3>WorkUp</h3>
              <div class="footer-logo-dot"></div>
            </div>
            <p class="footer-description">
              İş arayanlar ve iş verenlerin güvenli buluşma noktası. 
              Modern teknoloji ile hızlı ve etkili iş eşleştirme platformu.
            </p>
            <div class="social-links">
              <a href="#" class="social-link">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="social-link">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="#" class="social-link">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" class="social-link">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">Platform</h4>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">Nasıl Çalışır</a></li>
              <li><a href="#" class="footer-link">İş Kategorileri</a></li>
              <li><a href="#" class="footer-link">Güvenlik</a></li>
              <li><a href="#" class="footer-link">Ödeme Sistemi</a></li>
              <li><a href="#" class="footer-link">API Dokümantasyonu</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">Şirket</h4>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">Hakkımızda</a></li>
              <li><a href="#" class="footer-link">Kariyer</a></li>
              <li><a href="#" class="footer-link">Basın</a></li>
              <li><a href="#" class="footer-link">Blog</a></li>
              <li><a href="#" class="footer-link">İletişim</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">Destek</h4>
            <ul class="footer-links">
              <li><a href="#" class="footer-link">Yardım Merkezi</a></li>
              <li><a href="#" class="footer-link">Güvenlik</a></li>
              <li><a href="#" class="footer-link">Gizlilik Politikası</a></li>
              <li><a href="#" class="footer-link">Kullanım Şartları</a></li>
              <li><a href="#" class="footer-link">Çerez Politikası</a></li>
            </ul>
          </div>

          <div class="footer-section">
            <h4 class="footer-title">İletişim</h4>
            <div class="contact-info">
              <div class="contact-item">
                <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>info@workup.com</span>
              </div>
              <div class="contact-item">
                <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span>+90 212 555 0123</span>
              </div>
              <div class="contact-item">
                <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span>İstanbul, Türkiye</span>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <p class="copyright">&copy; 2024 WorkUp. Tüm hakları saklıdır.</p>
            <div class="footer-bottom-links">
              <a href="#" class="footer-bottom-link">Gizlilik</a>
              <a href="#" class="footer-bottom-link">Şartlar</a>
              <a href="#" class="footer-bottom-link">Çerezler</a>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- Modals -->
    <LoginModal 
      :is-open="showLoginModal" 
      @close="closeLoginModal"
      @switch-to-register="switchToRegister"
    />
    <RegisterModal 
      :is-open="showRegisterModal" 
      @close="closeRegisterModal"
      @switch-to-login="switchToLogin"
    />
    
    <!-- Chat Window -->
    <ChatWindow 
      :is-open="isChatOpen"
      :worker="selectedWorker"
      @close="closeChat"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { categoryService, workerService } from '@/services/api'
import LoginModal from '@/components/LoginModal.vue'
import RegisterModal from '@/components/RegisterModal.vue'
import ChatWindow from '@/components/ChatWindow.vue'
import Swal from 'sweetalert2'

const jobs = ref([
  { id: 1, type: 'INTERNSHIP', icon: '💧', title: 'Product Design', location: '802 Nash St Brooklyn, NY' },
  { id: 2, type: 'CONTRACT BASE', icon: '🔺', title: 'Product Mockup', location: '802 Nash St Brooklyn, NY' },
  { id: 3, type: 'FULL-TIME', icon: '9️⃣', title: 'Php Developer', location: '802 Nash St Brooklyn, NY' },
  { id: 4, type: 'APPRENTISHIP', icon: '🍊', title: 'WordPress Developer', location: '802 Nash St Brooklyn, NY' },
  { id: 5, type: 'PART-TIME', icon: '⚙️', title: 'Web Maintenance', location: '802 Nash St Brooklyn, NY' },
  { id: 6, type: 'FREELANCE', icon: '🔥', title: 'Photoshop Designer', location: '802 Nash St Brooklyn, NY' },
  { id: 7, type: 'INTERNSHIP', icon: '💧', title: 'HTML5 & CSS3 Coder', location: '802 Nash St Brooklyn, NY' },
  { id: 8, type: 'CONTRACT BASE', icon: '🟢', title: '.Net Developer', location: '802 Nash St Brooklyn, NY' }
])

const employerLogos = ref([
  { id: 1, symbol: '🏢' },
  { id: 2, symbol: '💼' },
  { id: 3, symbol: '🏭' },
  { id: 4, symbol: '🏪' },
  { id: 5, symbol: '🏨' },
  { id: 6, symbol: '🏢' },
  { id: 7, symbol: '💼' },
  { id: 8, symbol: '🏭' }
])

// Auth store
const authStore = useAuthStore()

// User information
const user = computed(() => authStore.user)
const isAuthenticated = computed(() => authStore.isAuthenticated)

// Modal state
const showLoginModal = ref(false)
const showRegisterModal = ref(false)

// Dropdown state
const showDropdown = ref(false)

// Categories state
const categories = ref([])
const loading = ref(false)
const error = ref('')
const currentParentCategory = ref(null)
const categoryPath = ref([])
const onlineWorkers = ref([])
const workersLoading = ref(false)

// Chat state
const isChatOpen = ref(false)
const selectedWorker = ref(null)

// Modal functions
const openLoginModal = () => {
  showLoginModal.value = true
}

const closeLoginModal = () => {
  showLoginModal.value = false
}

const openRegisterModal = () => {
  showRegisterModal.value = true
}

const closeRegisterModal = () => {
  showRegisterModal.value = false
}

const switchToRegister = () => {
  showLoginModal.value = false
  showRegisterModal.value = true
}

const switchToLogin = () => {
  showRegisterModal.value = false
  showLoginModal.value = true
}

// Logout function
const handleLogout = () => {
  authStore.logout()
  // Redirect to home page after logout
  window.location.href = '/'
}

// Go to profile function
const goToProfile = () => {
  window.location.href = '/profile'
}

// Toggle dropdown function
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// Go to settings function
const goToSettings = () => {
  // For now, just close dropdown
  showDropdown.value = false
  // TODO: Implement settings page
}

// Click outside handler
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.dropdown-container')) {
    showDropdown.value = false
  }
}

// Add click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Categories functions
const loadCategories = async (parentId = null) => {
  loading.value = true
  error.value = ''
  try {
    const response = await categoryService.getCategoriesByParent(parentId)
    categories.value = response.data || response
  } catch (err) {
    error.value = 'Kategoriler yüklenirken hata oluştu'
    console.error('Categories error:', err)
  } finally {
    loading.value = false
  }
}

const selectCategory = async (category) => {
  // Add to path
  categoryPath.value.push(category)
  currentParentCategory.value = category
  
  // If user is authenticated, fetch online workers for this category
  if (isAuthenticated.value && user.value) {
    await fetchOnlineWorkers(category.id)
  } else {
    // If not authenticated, show login prompt
    Swal.fire({
      title: 'Giriş Gerekli',
      text: 'Çevrimiçi işçileri görmek için giriş yapın',
      icon: 'info',
      confirmButtonText: 'Giriş Yap',
      showCancelButton: true,
      cancelButtonText: 'İptal'
    }).then((result) => {
      if (result.isConfirmed) {
        openLoginModal()
      }
    })
  }
}

const fetchOnlineWorkers = async (categoryId) => {
  workersLoading.value = true
  
  try {
    // Get user's current location
    const position = await getCurrentPosition()
    
    if (position) {
      const { latitude, longitude } = position.coords
      const response = await workerService.getOnlineWorkers(latitude, longitude, 200, categoryId)
      onlineWorkers.value = response.data || response
      
      if (onlineWorkers.value.length > 0) {
        Swal.fire({
          title: 'Çevrimiçi İşçiler Bulundu!',
          text: `${onlineWorkers.value.length} kişi bu kategoride çevrimiçi`,
          icon: 'success',
          confirmButtonText: 'Tamam'
        })
      } else {
        Swal.fire({
          title: 'Çevrimiçi İşçi Yok',
          text: 'Bu kategoride şu anda çevrimiçi işçi bulunmuyor',
          icon: 'info',
          confirmButtonText: 'Tamam'
        })
      }
    }
  } catch (err) {
    console.error('Error fetching online workers:', err)
    Swal.fire({
      title: 'Hata',
      text: 'Çevrimiçi işçiler yüklenirken hata oluştu',
      icon: 'error',
      confirmButtonText: 'Tamam'
    })
  } finally {
    workersLoading.value = false
  }
}

const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => {
        console.error('Geolocation error:', error)
        Swal.fire({
          title: 'Konum Erişimi',
          text: 'Çevrimiçi işçileri görmek için konum erişimine izin verin',
          icon: 'warning',
          confirmButtonText: 'Tamam'
        })
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  })
}

const contactWorker = (worker) => {
  selectedWorker.value = worker
  isChatOpen.value = true
}

const closeChat = () => {
  isChatOpen.value = false
  selectedWorker.value = null
}



const goToRoot = () => {
  categoryPath.value = []
  currentParentCategory.value = null
  onlineWorkers.value = []
  loadCategories()
  
  // Scroll to top of categories section
  const categoriesSection = document.querySelector('.categories-section')
  if (categoriesSection) {
    categoriesSection.scrollIntoView({ behavior: 'smooth' })
  }
}

const goToCategory = (category, index) => {
  // Remove everything after this index
  categoryPath.value = categoryPath.value.slice(0, index + 1)
  currentParentCategory.value = category
  onlineWorkers.value = []
  
  // Load categories for this level
  loadCategories(category.id)
}

// Load categories on mount
onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
/* Header Styles */
.header {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-link:hover {
  color: #10b981;
}

/* User profile styles */
.user-profile-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.user-profile-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
}

.user-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.user-type {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: capitalize;
  line-height: 1rem;
}

.dropdown-icon {
  color: #6b7280;
  transition: transform 0.3s;
}

.user-profile-btn:hover .dropdown-icon {
  transform: rotate(180deg);
}

.user-actions {
  display: flex;
  align-items: center;
}

.logout-btn {
  width: 2.5rem;
  height: 2.5rem;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logout-btn:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

/* Dropdown styles */
.dropdown-container {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 30px;
  z-index: 1000;
  overflow: hidden;
}

.dropdown-header {
  padding: 0.75rem;
  background: #f9fafb;
  border-bottom: 1px solid #f3f4f6;
}

.dropdown-user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dropdown-avatar {
  width: 1rem;
  height: 1rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.dropdown-user-details {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.dropdown-user-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.875rem;
}

.dropdown-user-email {
  font-size: 0.75rem;
  color: #6b7280;
}

.dropdown-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 0.5rem 0;
}

.dropdown-items {
  padding: 0.25rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: 0.375rem;
  transition: all 0.3s;
  text-align: left;
}

.dropdown-item:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.dropdown-item svg {
  color: #6b7280;
  transition: color 0.3s;
  width: 1rem;
}

.dropdown-item:hover svg {
  color: #10b981;
}

.logout-item {
  color: #ef4444;
}

.logout-item:hover {
  background: #fef2f2;
  color: #dc2626;
}

.logout-item svg {
  color: #ef4444;
}

.logout-item:hover svg {
  color: #dc2626;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  padding: 8rem 2rem 4rem;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.hero-title span {
  color: #10b981;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: #374151;
  margin-bottom: 3rem;
}

/* Search Bar */
.search-container {
  margin-bottom: 3rem;
}

.search-bar {
  display: flex;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  overflow: hidden;
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  border: none;
  outline: none;
  font-size: 1rem;
}

.search-input:first-child {
  border-right: 1px solid #e5e7eb;
}

.search-button {
  background: #10b981;
  color: white;
  padding: 1rem 2rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.search-button:hover {
  background: #059669;
}

/* Featured Employers */
.featured-employers {
  margin-top: 2rem;
}

.featured-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.employers-grid {
  display: flex;
  gap: 2rem;
}

.employer-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.employer-logo {
  width: 40px;
  height: 40px;
  background: #10b981;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.employer-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.employer-info p {
  font-size: 0.75rem;
  color: #6b7280;
}

/* Hero Image */
.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.image-placeholder {
  width: 300px;
  height: 400px;
  background: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.image-placeholder::before {
  content: '';
  position: absolute;
  bottom: -50px;
  left: -50px;
  right: -50px;
  height: 100px;
  background: #f3f4f6;
  border-radius: 50%;
}

.person-icon {
  font-size: 4rem;
  z-index: 1;
  position: relative;
}

/* Categories Section */
.categories-section {
  padding: 4rem 2rem;
  background: white;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.breadcrumb-item {
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  transition: all 0.3s;
}

.breadcrumb-item:hover {
  color: #10b981;
  background: #f0fdf4;
}

.breadcrumb-item.active {
  color: #10b981;
  font-weight: 600;
}

.breadcrumb-separator {
  color: #d1d5db;
  font-size: 0.875rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.category-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.category-card:hover {
  border-color: #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
  transform: translateY(-2px);
}

.category-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  display: block;
}

.category-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.category-description {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.category-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.category-count {
  font-size: 0.875rem;
  color: #10b981;
  font-weight: 500;
}

.category-arrow {
  color: #6b7280;
  font-size: 1.125rem;
  transition: transform 0.3s;
}

.category-card:hover .category-arrow {
  transform: translateX(4px);
  color: #10b981;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 0;
  color: #6b7280;
}

.loading-spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid #e5e7eb;
  border-top: 2px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-state {
  text-align: center;
  padding: 3rem 0;
  color: #ef4444;
}

.retry-button {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.3s;
}

.retry-button:hover {
  background: #059669;
}

.section-content {
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e40af;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.job-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.job-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.job-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.job-heart {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.25rem;
  cursor: pointer;
}

.job-icon {
  font-size: 3rem;
  text-align: center;
  margin: 2rem 0 1rem;
}

.job-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
  margin-bottom: 0.5rem;
}

.job-location {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 1rem;
}

.job-button {
  width: 100%;
  background: #10b981;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.job-button:hover {
  background: #059669;
}

/* Employers Section */
.employers-section {
  padding: 4rem 2rem;
  background: #f9fafb;
}

.employers-logos {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.employer-logo-item {
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.employer-logo-item:hover {
  transform: scale(1.1);
}

.logo-placeholder {
  font-size: 2rem;
}

/* Footer Styles */
.footer {
  background: #1f2937;
  color: white;
  padding: 4rem 2rem 2rem;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;
}

.footer-section {
  color: #d1d5db;
}

.footer-logo {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.footer-logo h3 {
  color: white;
  margin-right: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
}

.footer-logo-dot {
  width: 12px;
  height: 12px;
  background: #10b981;
  border-radius: 50%;
  margin-top: 0.25rem;
}

.footer-description {
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  color: #d1d5db;
  transition: color 0.3s;
}

.social-link:hover {
  color: #10b981;
}

.footer-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-link {
  color: #d1d5db;
  text-decoration: none;
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.75rem;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #10b981;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #d1d5db;
  font-size: 0.9rem;
}

.contact-icon {
  width: 16px;
  height: 16px;
  color: #9ca3af;
}

.footer-bottom {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.footer-bottom-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  font-size: 0.875rem;
  color: #9ca3af;
}

.footer-bottom-links {
  display: flex;
  gap: 1.5rem;
}

.footer-bottom-link {
  color: #d1d5db;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.3s;
}

.footer-bottom-link:hover {
  color: #10b981;
}

/* Online Workers Section Styles */
.online-workers-section {
  padding: 4rem 0;
  background: #f8fafc;
}

.section-header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #10b981;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.back-btn:hover {
  background: #059669;
  transform: translateY(-1px);
}

.auth-notice {
  font-size: 0.875rem;
  color: #f59e0b;
  margin-top: 0.5rem;
  font-weight: 500;
}

.workers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.worker-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.worker-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.worker-avatar {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.worker-info {
  flex: 1;
  min-width: 0;
}

.worker-name {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  line-height: 1.25;
}

.worker-phone {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.25rem 0;
}

.worker-email {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.worker-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.worker-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 0.5rem;
}

.worker-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.worker-distance {
  display: flex;
  align-items: center;
}

.distance-text {
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 500;
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.status-dot.online {
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
}

.status-text {
  font-size: 0.75rem;
  color: #10b981;
  font-weight: 500;
}

.worker-actions {
  flex-shrink: 0;
}

.contact-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.contact-btn:hover {
  background: #059669;
  transform: translateY(-1px);
}



/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .search-bar {
    flex-direction: column;
  }
  
  .search-input:first-child {
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .employers-grid {
    flex-direction: column;
    align-items: center;
  }
  
  .jobs-grid {
    grid-template-columns: 1fr;
  }
  
  .nav {
    display: none;
  }
  
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }
}

/* Button Styles */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background: #10b981;
  color: white;
}

.btn-primary:hover {
  background: #059669;
}

.btn-secondary {
  background: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f9fafb;
}
</style> 
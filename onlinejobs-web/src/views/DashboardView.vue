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
          <a href="#" class="nav-link">Anasayfa</a>
          <a href="#" class="nav-link">Kurumsal</a>
          <a href="#" class="nav-link">Blog</a>
          <a href="#" class="nav-link">İletişim</a>
        </nav>
        <div class="flex items-center gap-4">
          <button class="btn btn-secondary">Login</button>
          <button class="btn btn-primary">Register</button>
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

    <!-- Browse Hot Jobs Section -->
    <section class="jobs-section">
      <div class="section-content">
        <div class="section-header">
          <h2 class="section-title">Browse Hot Jobs</h2>
          <p class="section-subtitle">Browse 200+ top jobs in your local city</p>
        </div>
        
        <div class="jobs-grid">
          <div class="job-card" v-for="job in jobs" :key="job.id">
            <div class="job-badge">{{ job.type }}</div>
            <div class="job-heart">❤️</div>
            <div class="job-icon">{{ job.icon }}</div>
            <h3 class="job-title">{{ job.title }}</h3>
            <p class="job-location">{{ job.location }}</p>
            <button class="job-button">BROWSE JOB</button>
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

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

/* Jobs Section */
.jobs-section {
  padding: 4rem 2rem;
  background: white;
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
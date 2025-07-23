# API Configuration Guide

## Overview
The application now uses a centralized configuration system for API URLs. This allows you to easily switch between development (localhost:3000) and production (onlinejobs.onrender.com) environments.

## Configuration Files

### 1. Main Configuration (`src/config/index.ts`)
This file contains all API endpoints and environment settings:
- Automatically detects development vs production mode
- Uses environment variables when available
- Falls back to default URLs based on environment

### 2. Environment Files
- `env.development` - Copy to `.env.development` for development
- `env.production` - Copy to `.env.production` for production

## How to Use

### For Development (localhost:3000):
1. Copy `env.development` to `.env.development`
2. Run `npm run dev`
3. API will automatically connect to `http://localhost:3000`

### For Production (onlinejobs.onrender.com):
1. Copy `env.production` to `.env.production`
2. Run `npm run build`
3. API will automatically connect to `https://onlinejobs.onrender.com`

### Manual Configuration:
You can also manually set the API URL by creating a `.env.local` file:
```
VITE_API_BASE_URL=http://localhost:3000
```

## Current API Endpoints

All endpoints are now centralized in `src/config/index.ts`:

```typescript
ENDPOINTS: {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register', 
  CHECK_PHONE: '/check-phone',
  CATEGORIES: '/categories',
  PROFILE: '/auth/profile',
  LOGOUT: '/auth/logout'
}
```

## Benefits

1. **Single Point of Change**: All API URLs in one place
2. **Environment Detection**: Automatic switching between dev/prod
3. **Easy Testing**: Can quickly switch between different API servers
4. **Type Safety**: All endpoints are typed and centralized
5. **Debug Logging**: Configuration is logged in development mode

## Debug Information

In development mode, you'll see configuration logs in the browser console:
```
🔧 API Configuration: { BASE_URL: "http://localhost:3000", ... }
🔧 App Configuration: { APP_NAME: "Online Jobs (Dev)", ... }
``` 
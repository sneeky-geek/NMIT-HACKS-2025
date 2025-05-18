/**
 * Application configuration
 * Central place to manage environment-specific settings
 */

// Backend API configuration
export const API_CONFIG = {
  // Base URL for the backend API
  //BASE_URL: 'http://localhost:3000',
  BASE_URL: 'https://civix-backend.onrender.com',
  
  // Fake News Analyzer API URL
  FACT_CHECK_API_URL: 'https://fake-news-analyzer.onrender.com',
  
  // OpenStreetMap API URL
  OPENSTREETMAP_API_URL: 'https://nominatim.openstreetmap.org',
  
  // API endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      REGISTER_NGO: '/api/auth/register-ngo',
      VERIFY_OTP: '/api/auth/verify-otp',
    },
    
    // Token endpoints
    TOKENS: {
      BALANCE: '/api/tokens/balance',
      ADD: '/api/tokens/add',
      REDEEM: '/api/tokens/redeem',
    },
  }
};

// Function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Export default config object
export default {
  API_CONFIG,
  getApiUrl,
};

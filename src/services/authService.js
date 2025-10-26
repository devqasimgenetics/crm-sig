import axios from 'axios';

/**
 * Auth Service
 * Handles all authentication related API calls including:
 * - Login
 * - Refresh Token
 * - OTP Verification
 */

const API_BASE_URL = 'https://api.crm.saveingold.app/api/v1';

/**
 * Login user with email/phone and password
 * @param {string} login - User's email address or phone number
 * @param {string} password - User's password
 * @returns {Promise} - Returns user info and access token
 */
export const loginUser = async (login, password) => {
  try {
    console.log('🔵 Attempting login...');
    
    const response = await axios.post(
      `${API_BASE_URL}/auth/login/en`,
      {
        login,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    console.log('✅ Login response received:', response.data);

    const data = response.data;

    if (data.status === 'success' && data.payload) {
      const { accessToken, ...userInfo } = data.payload.userInfo;
      
      if (accessToken) {
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        console.log('✅ Token stored, refreshing token...');
        
        // Immediately refresh the token after login
        await refreshToken(accessToken);
      }

      return {
        success: true,
        data: data.payload,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Login failed',
      };
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'Invalid credentials. Please try again.',
        error: error.response.data,
      };
    } else if (error.request) {
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    } else {
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
      };
    }
  }
};

/**
 * Refresh the access token
 * @param {string} token - Current access token (optional, will use stored token if not provided)
 * @returns {Promise} - Returns new access token
 */
export const refreshToken = async (token = null) => {
  try {
    const accessToken = token || getAccessToken();
    
    if (!accessToken) {
      throw new Error('No access token available');
    }

    console.log('🔄 Refreshing token...');

    const response = await axios.post(
      `${API_BASE_URL}/auth/refreshToken/en`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken, // Send token in header
        },
        timeout: 30000,
      }
    );

    console.log('✅ Token refresh response:', response.data);

    const data = response.data;

    if (data.status === 'success' && data.payload) {
      const { accessToken: newAccessToken, ...userInfo } = data.payload.userInfo || data.payload;
      
      if (newAccessToken) {
        localStorage.setItem('authToken', newAccessToken);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        console.log('✅ New token stored successfully');
      }

      return {
        success: true,
        data: data.payload,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Token refresh failed',
      };
    }
  } catch (error) {
    console.error('❌ Token refresh error:', error);
    
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      console.log('❌ Token expired, logging out...');
      logoutUser();
      window.location.href = '/login';
    }
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to refresh token',
      error: error.response?.data,
    };
  }
};

/**
 * Verify OTP sent to email
 * @param {string} email - User's email address
 * @param {string} passcode - 6-digit OTP code
 * @returns {Promise} - Returns verification result
 */
export const verifyOTP = async (email, passcode) => {
  try {
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      throw new Error('No access token available. Please login first.');
    }

    console.log('🔵 Verifying OTP...');

    const response = await axios.post(
      `${API_BASE_URL}/auth/verifyOTPWithEmail/en`,
      {
        email,
        passcode,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken, // Send token in header
        },
        timeout: 30000,
      }
    );

    console.log('✅ OTP verification response:', response.data);

    const data = response.data;

    if (data.status === 'success') {
      console.log('✅ OTP verified successfully');
      
      // Update user info if returned in payload
      if (data.payload?.userInfo) {
        localStorage.setItem('userInfo', JSON.stringify(data.payload.userInfo));
      }

      return {
        success: true,
        data: data.payload,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message || 'OTP verification failed',
      };
    }
  } catch (error) {
    console.error('❌ OTP verification error:', error);
    
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'Invalid OTP. Please try again.',
        error: error.response.data,
      };
    } else if (error.request) {
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    } else {
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
      };
    }
  }
};

/**
 * Resend OTP to email
 * Note: You may need to add the actual resend API endpoint
 * @param {string} email - User's email address
 * @returns {Promise} - Returns resend result
 */
export const resendOTP = async (email) => {
  try {
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      throw new Error('No access token available. Please login first.');
    }

    console.log('🔵 Resending OTP...');

    // TODO: Update with actual resend OTP endpoint when available
    const response = await axios.post(
      `${API_BASE_URL}/auth/resendOTP/en`, // Update this endpoint
      {
        email,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken,
        },
        timeout: 30000,
      }
    );

    console.log('✅ OTP resent successfully:', response.data);

    const data = response.data;

    return {
      success: data.status === 'success',
      message: data.message || 'OTP sent successfully',
      data: data.payload,
    };
  } catch (error) {
    console.error('❌ Resend OTP error:', error);
    
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to resend OTP',
      error: error.response?.data,
    };
  }
};

/**
 * Logout user
 * Clears stored authentication data
 */
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userInfo');
  console.log('🔴 User logged out, storage cleared');
};

/**
 * Get stored user info
 * @returns {Object|null} - Returns user info or null
 */
export const getUserInfo = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

/**
 * Get stored access token
 * @returns {string|null} - Returns access token or null
 */
export const getAccessToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * Check if user is authenticated
 * @returns {boolean} - Returns true if user has valid token
 */
export const isAuthenticated = () => {
  const token = getAccessToken();
  return !!token;
};

/**
 * Setup axios interceptor to automatically add token and refresh on 401
 * Call this once in your app initialization
 */
export const setupAxiosInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = getAccessToken();
      if (token && config.url && !config.url.includes('/auth/login')) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // If 401 and not already retried, try to refresh token
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refreshResult = await refreshToken();
        
        if (refreshResult.success) {
          // Retry original request with new token
          const newToken = getAccessToken();
          originalRequest.headers.Authorization = newToken;
          return axios(originalRequest);
        } else {
          // Refresh failed, logout
          logoutUser();
          window.location.href = '/login';
        }
      }

      return Promise.reject(error);
    }
  );

  console.log('✅ Axios interceptor setup complete');
};
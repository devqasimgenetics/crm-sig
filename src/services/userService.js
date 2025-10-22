import axiosInstance from '../config/axios'; // Update this path to your actual axios config

/**
 * Auth Service
 * Handles all authentication related API calls
 */

/**
 * Login user with email/phone and password
 * @param {string} login - User's email address or phone number
 * @param {string} password - User's password
 * @returns {Promise} - Returns user info and access token
 */
export const loginUser = async (login, password) => {
  try {
    // Note: axiosInstance already returns response.data due to response interceptor
    const data = await axiosInstance.post(
      '/auth/login/en',
      {
        login, // This accepts email or phone number
        password,
      }
    );

    if (data.status === 'success') {
      // Store access token in localStorage
      const { accessToken, userInfo } = data.payload;
      
      if (accessToken) {
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
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
    console.error('Login error:', error);
    
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        message: error.response.data?.message || 'Invalid credentials',
        error: error.response.data,
      };
    } else if (error.request) {
      // Request made but no response received
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    } else {
      // Something else happened
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  }
};

/**
 * Logout user
 * Clears stored authentication data
 */
export const logoutUser = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userInfo');
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
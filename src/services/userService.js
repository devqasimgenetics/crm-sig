import axiosInstance from '../config/axios';

const userService = {
  // Get all users
  getAllUsers: async (params = {}) => {
    try {
      const response = await axiosInstance.get('/users', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await axiosInstance.post('/users', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Partial update user
  patchUser: async (userId, userData) => {
    try {
      const response = await axiosInstance.patch(`/users/${userId}`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await axiosInstance.delete(`/users/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('authToken');
  },
};

export default userService;
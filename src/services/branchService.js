import axios from 'axios';

/**
 * Lead Service
 * Handles all lead related API calls including:
 * - Get All Leads
 * - Create Lead
 */

const API_BASE_URL = 'https://api.crm.saveingold.app/api/v1';

/**np
 * Get all leads with pagination
 * @param {number} page - Page number (default: 1)
 * @param {number} limit - Number of items per page (default: 10)
 * @returns {Promise} - Returns list of leads
 */

export const getAccessToken = () => {
  return localStorage.getItem('authToken');
};

export const getAllLeads = async (page = 1, limit = 10) => {
  try {
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      throw new Error('No access token available. Please login first.');
    }

    console.log('🔵 Fetching leads...');

    const response = await axios.get(
      `${API_BASE_URL}/lead/getAll/en?paramPage=${page}&paramLimit=${limit}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken,
        },
        timeout: 30000,
      }
    );

    console.log('✅ Leads fetched successfully:', response.data);

    const data = response.data;

    if (data.status === 'success') {
      return {
        success: true,
        data: data.payload,
        message: data.message,
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to fetch leads',
      };
    }
  } catch (error) {
    console.error('❌ Fetch leads error:', error);
    
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'Failed to fetch leads',
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
 * Create a new lead
 * @param {Object} leadData - Lead data object
 * @returns {Promise} - Returns created lead
 */
export const createLead = async (leadData) => {
  try {
    const accessToken = getAccessToken();
    
    if (!accessToken) {
      throw new Error('No access token available. Please login first.');
    }

    console.log('🔵 Creating lead...');

    const response = await axios.post(
      `${API_BASE_URL}/lead/create/en`,
      leadData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken,
        },
        timeout: 30000,
      }
    );

    console.log('✅ Lead created successfully:', response.data);

    const data = response.data;

    if (data.status === 'success') {
      return {
        success: true,
        data: data.payload,
        message: data.message || 'Lead created successfully',
      };
    } else {
      return {
        success: false,
        message: data.message || 'Failed to create lead',
      };
    }
  } catch (error) {
    console.error('❌ Create lead error:', error);
    
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'Failed to create lead',
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
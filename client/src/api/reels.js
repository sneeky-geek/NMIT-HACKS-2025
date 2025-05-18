// API calls for reels
import { processReelsMedia } from '../utils/mediaUtils';
import { API_CONFIG } from '../config';

const BASE_URL = API_CONFIG.BASE_URL;
const API_URL = `${BASE_URL}/api`;

/**
 * Fetch all reels or filter by userId
 * @param {string} userId - Optional user ID to filter reels
 * @returns {Promise<Array>} - Array of reel objects
 */
export const fetchReels = async (userId) => {
  try {
    const url = userId ? `${API_URL}/reels?userId=${userId}` : `${API_URL}/reels`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch reels: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching reels:', error);
    throw error;
  }
};

/**
 * Upload a new reel
 * @param {File} file - The image or video file
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The created reel object
 */
export const uploadReel = async (file, userId) => {
  try {
    const formData = new FormData();
    formData.append('media', file);
    formData.append('userId', userId);
    
    const response = await fetch(`${API_URL}/reels`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Failed to upload reel: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error uploading reel:', error);
    throw error;
  }
};

/**
 * Update a reel (like/unlike or sound settings)
 * @param {string} reelId - The ID of the reel to update
 * @param {Object} updateData - The data to update (likes or soundOn)
 * @returns {Promise<Object>} - The updated reel object
 */
export const updateReel = async (reelId, updateData) => {
  try {
    const response = await fetch(`${API_URL}/reels/${reelId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update reel: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error updating reel:', error);
    throw error;
  }
};

/**
 * Delete a reel
 * @param {string} reelId - The ID of the reel to delete
 * @returns {Promise<Object>} - Empty object on success
 */
export const deleteReel = async (reelId) => {
  try {
    const response = await fetch(`${API_URL}/reels/${reelId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete reel: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error deleting reel:', error);
    throw error;
  }
}; 
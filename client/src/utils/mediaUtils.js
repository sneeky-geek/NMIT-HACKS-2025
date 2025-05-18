/**
 * Utility functions for handling media URLs
 */

import { API_CONFIG } from '../config';

const SERVER_BASE_URL = API_CONFIG.BASE_URL;

/**
 * Ensures a media URL is properly formatted with the correct server base URL
 * @param {string} url - The original URL from the API
 * @returns {string} - The properly formatted URL
 */
export const getFullMediaUrl = (url) => {
  if (!url) return url;
  
  // If it's already an absolute URL, return it as is
  if (url.startsWith('http')) {
    return url;
  }
  
  // Handle different relative path formats
  if (url.startsWith('/uploads')) {
    return `${SERVER_BASE_URL}${url}`;
  } else if (url.startsWith('uploads/')) {
    return `${SERVER_BASE_URL}/${url}`;
  } else {
    // Assume it's just a filename
    return `${SERVER_BASE_URL}/uploads/${url}`;
  }
};

/**
 * Process an array of reels to ensure all media URLs are properly formatted
 * @param {Array} reels - Array of reel objects from the API
 * @returns {Array} - Array of reels with fixed media URLs
 */
export const processReelsMedia = (reels) => {
  if (!reels || !Array.isArray(reels)) return reels;
  
  return reels.map(reel => {
    if (reel.media && reel.media.url) {
      reel.media.url = getFullMediaUrl(reel.media.url);
    }
    return reel;
  });
};

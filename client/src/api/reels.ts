// API client for interacting with the reels endpoints
import { API_CONFIG, getApiUrl } from '@/config';

// Interfaces for API responses
export interface ReelData {
  _id: string;
  userId: string;
  media: {
    type: 'image' | 'video';
    fileName: string;
    fileType: string;
    filePath: string;
    fileSize: number;
  };
  description: string;
  likes: number;
  shares: number;
  createdAt: string;
  soundOn?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  error?: string;
}

// Base URL for API endpoints
// Use the centralized config for the base URL
const API_BASE_URL = '/api';

/**
 * Fetch all reels from the server
 */
export const fetchReels = async (): Promise<ReelData[]> => {
  try {
    const response = await fetch(getApiUrl(`${API_BASE_URL}/reels`));
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch reels');
    }
    
    const data: ApiResponse<ReelData[]> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'No reels data returned');
    }
    
        // Return data as-is, letting frontend handle transformation
    return data.data;
  } catch (error) {
    console.error('Error fetching reels:', error);
    return [];
  }
};

/**
 * Upload a new reel
 */
export const uploadReel = async (
  file: File,
  userId: string,
  description: string = ''
): Promise<ReelData | null> => {
  try {
    const formData = new FormData();
    formData.append('media', file);
    formData.append('userId', userId);
    formData.append('description', description);
    
    // Determine if the file is a video (for sound option)
    const isVideo = file.type.startsWith('video/');
    if (isVideo) {
      formData.append('soundOn', 'true');
    }
    
    const response = await fetch(getApiUrl(`${API_BASE_URL}/reels`), {
      method: 'POST',
      body: formData,
      // Do not set Content-Type header - browser will set it with boundary for FormData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload reel');
    }
    
    const data: ApiResponse<ReelData> = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.message || 'Failed to create reel');
    }
    
    // Return the reel data as-is
    return data.data;
  } catch (error) {
    console.error('Error uploading reel:', error);
    return null;
  }
};

/**
 * Like or unlike a reel
 */
export const likeReel = async (reelId: string, action: 'like' | 'unlike' | 'share'): Promise<boolean> => {
  try {
    const response = await fetch(getApiUrl(`${API_BASE_URL}/reels/${reelId}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Failed to ${action} reel`);
    }
    
    const data: ApiResponse<ReelData> = await response.json();
    return data.success || false;
  } catch (error) {
    console.error(`Error ${action}ing reel:`, error);
    return false;
  }
};

/**
 * Share a reel (increment share count)
 */
export const shareReel = async (reelId: string): Promise<boolean> => {
  try {
    const response = await fetch(getApiUrl(`${API_BASE_URL}/reels/${reelId}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'share' }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to share reel');
    }
    
    const data: ApiResponse<ReelData> = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Error sharing reel:', error);
    return false;
  }
};

/**
 * Delete a reel
 */
export const deleteReel = async (reelId: string): Promise<boolean> => {
  try {
    const response = await fetch(getApiUrl(`${API_BASE_URL}/reels/${reelId}`), {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete reel');
    }
    
    const data: ApiResponse<null> = await response.json();
    return data.success || false;
  } catch (error) {
    console.error('Error deleting reel:', error);
    return false;
  }
};

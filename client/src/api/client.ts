// import axios from 'axios';
// import type { GenerateRequest, JobResponse } from '../types';

// // Environment variable handling for flexibility
// const API_BASE = import.meta.env.VITE_API_URL || '/api';

// export const apiClient = axios.create({
//   baseURL: API_BASE,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 10000, // 10s timeout for standard requests (not SSE)
// });

// // --- API Methods ---

// export const generateThumbnail = async (payload: GenerateRequest) => {
//   // Returns { jobId: "..." }
//   return apiClient.post<{ jobId: string }>('/generate', payload);
// };

// export const getJobStatus = async (jobId: string) => {
//   // Returns full job object
//   return apiClient.get<JobResponse>(`/jobs/${jobId}`);
// };

// export const saveFavorite = async (imageUrl: string, prompt: string) => {
//   return apiClient.post('/favorites', { imageUrl, prompt });
// };

import axios from 'axios';
import type { GenerateRequest, JobResponse } from '../types';

// Toggle this in your .env file
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// --- API Methods ---

export const generateThumbnail = async (payload: GenerateRequest) => {
  // 1. MOCK MODE: Return a fake Job ID immediately
  if (USE_MOCK) {
    console.log("[Mock API] POST /generate received:", payload);
    return new Promise<{ data: { jobId: string } }>((resolve) => {
      setTimeout(() => {
        resolve({ 
          data: { jobId: `mock-job-${Date.now()}` } 
        });
      }, 800); // Simulate 0.8s network delay
    });
  }

  // 2. REAL MODE: Hit the backend
  return apiClient.post<{ jobId: string }>('/generate', payload);
};

export const getJobStatus = async (jobId: string) => {
  // The stream hook usually handles the final fetch, 
  // but if you call this manually in mock mode, we handle it too.
  if (USE_MOCK) {
    return new Promise<{ data: JobResponse }>((resolve) => {
        resolve({
            data: {
                jobId,
                status: 'completed',
                result: {
                    imageUrl: [
                        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1535378437321-29e904d1dd4b?q=80&w=1964&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1964&auto=format&fit=crop"
                    ],
                    creditsRemaining: 10
                }
            }
        })
    });
  }

  return apiClient.get<JobResponse>(`/jobs/${jobId}`);
};

export const saveFavorite = async (imageUrl: string, prompt: string) => {
  if (USE_MOCK) return Promise.resolve();
  return apiClient.post('/favorites', { imageUrl, prompt });
};
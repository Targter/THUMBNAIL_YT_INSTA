// // import axios from 'axios';
// // import type { GenerateRequest, JobResponse } from '../types';

// // // Environment variable handling for flexibility
// // const API_BASE = import.meta.env.VITE_API_URL || '/api';

// // export const apiClient = axios.create({
// //   baseURL: API_BASE,
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// //   timeout: 10000, // 10s timeout for standard requests (not SSE)
// // });

// // // --- API Methods ---

// // export const generateThumbnail = async (payload: GenerateRequest) => {
// //   // Returns { jobId: "..." }
// //   return apiClient.post<{ jobId: string }>('/generate', payload);
// // };

// // export const getJobStatus = async (jobId: string) => {
// //   // Returns full job object
// //   return apiClient.get<JobResponse>(`/jobs/${jobId}`);
// // };

// // export const saveFavorite = async (imageUrl: string, prompt: string) => {
// //   return apiClient.post('/favorites', { imageUrl, prompt });
// // };

// import axios from 'axios';
// import type { GenerateEdit, GenerateRequest, JobResponse } from '../types';
// import { supabase } from '../lib/supabase';
// import { data } from 'react-router-dom';
// // Toggle this in your .env file
// const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
// const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';



// export const apiClient = axios.create({
//   baseURL: API_BASE,
//     headers: {
//     'Content-Type': 'multipart/form-data',
//   },
// });

// // --- API Methods ---

// apiClient.interceptors.request.use(async (config) => {
//   // if (USE_MOCK) return config;

//   // 1. Get current session
//   const { data: { session } } = await supabase.auth.getSession();
//   console.log(data)
//   // 2. Attach Token if exists
//   if (session?.access_token) {
//     config.headers.Authorization = `Bearer ${session.access_token}`;
//   }
//   console.log("respone from 3000  ")
  
//   return config;
// }, (error) => {
//   return Promise.reject(error);
// });


// export const generateThumbnail = async (payload: GenerateRequest) => {
//   // if (USE_MOCK) {
//   //   // ... keep your mock logic here ...
//   //   return new Promise((resolve) => resolve({ data: { jobId: 'mock-123' } } as any));
//   // }
//   const formData = new FormData();
//   formData.append('prompt', payload.prompt);
//   formData.append('contextImage', payload.userUpload);
//   // console.log("userUPload:",payload.userUpload)
//   formData.append('platform', payload.platform);

// // apiClient.post('/api/generate', formData);
//   console.log("frontend:Payload:",payload)
//   console.log("Generate clale.d. ")

//   return apiClient.post<{ jobId: string }>('/api/generate', formData);
// };

// export const handleMagicEdit = async (payload: GenerateEdit) => {
//   // if (USE_MOCK) {
//   //   // ... keep your mock logic here ...
//   //   return new Promise((resolve) => resolve({ data: { jobId: 'mock-123' } } as any));
//   // }
//   const formData = new FormData();
//   formData.append('prompt', payload.prompt);
//   formData.append('platform', "youtube");
//   // console.log("userUPload:",payload.userUpload)
//   formData.append('imageUrl', payload.imageUrl);

// // apiClient.post('/api/generate', formData);
//   // console.log("frontend:Payload:",payload)
//   console.log("Generate clale.d. ",payload)
// // {imageUrl:payload.imageUrl,platform:payload.platform,prompt:payload.prompt}{imageUrl:payload.imageUrl,platform:payload.platform,prompt:payload.prompt}
//   return apiClient.post<{ jobId: string }>('/api/edit', payload);
// };



// export const getJobStatus = async (jobId: string) => {
//   if (USE_MOCK) { 
//      // ... keep your mock logic ...
//      return Promise.resolve({} as any); 
//   }
//   return apiClient.get<JobResponse>(`/jobs/${jobId}`);
// };


// // /
// // export const generateThumbnail = async (payload: GenerateRequest) => {
// //   // 1. MOCK MODE: Return a fake Job ID immediately
// //   if (USE_MOCK) {
// //     console.log("[Mock API] POST /generate received:", payload);
// //     return new Promise<{ data: { jobId: string } }>((resolve) => {
// //       setTimeout(() => {
// //         resolve({ 
// //           data: { jobId: `mock-job-${Date.now()}` } 
// //         });
// //       }, 800); // Simulate 0.8s network delay
// //     });
// //   }

// //   // 2. REAL MODE: Hit the backend
// //   return apiClient.post<{ jobId: string }>('/generate', payload);
// // };

// // export const getJobStatus = async (jobId: string) => {
// //   // The stream hook usually handles the final fetch, 
// //   // but if you call this manually in mock mode, we handle it too.
// //   if (USE_MOCK) {
// //     return new Promise<{ data: JobResponse }>((resolve) => {
// //         resolve({
// //             data: {
// //                 jobId,
// //                 status: 'completed',
// //                 result: {
// //                     imageUrl: [
// //                         "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop",
// //                         "https://images.unsplash.com/photo-1535378437321-29e904d1dd4b?q=80&w=1964&auto=format&fit=crop",
// //                         "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1964&auto=format&fit=crop"
// //                     ],
// //                     creditsRemaining: 10
// //                 }
// //             }
// //         })
// //     });
// //   }

// //   return apiClient.get<JobResponse>(`/jobs/${jobId}`);
// // };

// export const saveFavorite = async (imageUrl: string, prompt: string) => {
//   if (USE_MOCK) return Promise.resolve();
//   return apiClient.post('/favorites', { imageUrl, prompt });
// };


// // 
// export const getFavorites = async () => {
//   const response = await apiClient.get('/api/favorites');
//   return response.data;
// };

// export const uploadFavorite = async (file: File, platform: 'youtube' | 'instagram' = 'youtube') => {
//   const formData = new FormData();
//   formData.append('image', file);
//   formData.append('platform', platform);

//   const response = await apiClient.post('/api/favorites', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   });
//   return response.data;
// };

// export const deleteFavorite = async (id: string) => {
//   const response = await apiClient.delete(`/api/favorites/${id}`);
//   return response.data;
// };

import axios from 'axios';
import { supabase } from '../lib/supabase';
import type { GenerateEdit, GenerateRequest, JobResponse, Favorite } from '../types';

// Environment Handling
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// 1. AXIOS INSTANCE
// Note: We DO NOT set 'Content-Type' here globally. 
// Axios sets 'multipart/form-data' automatically when sending FormData, 
// and 'application/json' when sending objects.
export const apiClient = axios.create({
  baseURL: API_BASE,
});

// 2. INTERCEPTOR (Auth Injection)
apiClient.interceptors.request.use(async (config) => {
  if (USE_MOCK) return config;

  // Get current session from Supabase
  const { data: { session } } = await supabase.auth.getSession();
  
  // Attach Token if exists
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

// ------------------------------------------------------------------
// CORE GENERATION ENDPOINTS
// ------------------------------------------------------------------

/**
 * 1. GENERATE THUMBNAIL (Multipart)
 * Handles: Prompt + Platform + Optional File Upload + Style References
 */
export const generateThumbnail = async (payload: GenerateRequest) => {
  if (USE_MOCK) return mockResponse();

  const formData = new FormData();
  
  // Basic Fields
  formData.append('prompt', payload.prompt);
  formData.append('platform', payload.platform);

  // Context Image (Subject) - Matches backend `upload.single('userFile')`
  if (payload.userUpload) {
    formData.append('userFile', payload.userUpload);
  }

  // Style References (Favorites)
  if (payload.useStyleRef) {
    formData.append('useStyleRef', 'true');
    // If a specific favorite ID was chosen
    if (payload.styleId) {
      formData.append('styleId', payload.styleId);
    }
  }

  return apiClient.post<{ jobId: string }>('/api/generate', formData);
};

/**
 * 2. MAGIC EDIT (JSON)
 * Handles: Prompt + Source Image URL (Faster than re-uploading)
 */
export const handleMagicEdit = async (payload: GenerateEdit) => {
  if (USE_MOCK) return mockResponse();

  // We send JSON because we are passing a URL, not a File object
  const body = {
    prompt: payload.prompt,
    platform: payload.platform || 'youtube',
    imageUrl: payload.imageUrl, // URL of the image to edit
  };

  console.log("Sending Edit Request:", body);

  return apiClient.post<{ jobId: string }>('/api/edit', body);
};

/**
 * 3. GET JOB STATUS
 * Used for polling fallback or final result fetch
 */
export const getJobStatus = async (jobId: string) => {
  if (USE_MOCK) {
    // Return a mock completed status
    return Promise.resolve({
      data: {
        jobId,
        status: 'completed',
        result: {
          imageUrls: [
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200",
            "https://images.unsplash.com/photo-1535378437321-29e904d1dd4b?w=1200",
            "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=1200"
          ],
          creditsRemaining: 8
        }
      }
    });
  }
  return apiClient.get<JobResponse>(`/api/jobs/${jobId}`);
};

// ------------------------------------------------------------------
// FAVORITES / LIBRARY ENDPOINTS
// ------------------------------------------------------------------

export const getFavorites = async () => {
  if (USE_MOCK) return { data: [] };
  const response = await apiClient.get<Favorite[]>('/api/favorites');
  return response.data;
};

/**
 * Upload a raw file to use as a Style Reference later
 */
export const uploadFavorite = async (file: File) => {
  if (USE_MOCK) return;

  const formData = new FormData();
  formData.append('file', file); // Matches backend `upload.single('file')`

  const response = await apiClient.post<Favorite>('/api/favorites/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Save a specific AI generation to favorites
 */
export const saveGenerationAsFavorite = async (imagePath: string, generationId?: string) => {
  if (USE_MOCK) return;
  return apiClient.post('/favorites', { imagePath, generationId });
};

export const deleteFavorite = async (id: string) => {
  if (USE_MOCK) return;
  const response = await apiClient.delete(`/api/favorites/${id}`);
  return response.data;
};

// --- Helper ---
const mockResponse = () => new Promise<{ data: { jobId: string } }>((resolve) => {
  setTimeout(() => resolve({ data: { jobId: `mock-${Date.now()}` } }), 500);
});
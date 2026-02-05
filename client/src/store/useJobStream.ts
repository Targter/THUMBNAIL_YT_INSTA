// import { useState, useRef, useCallback, useEffect } from 'react';
// import { apiClient } from '../api/client';
// import { JobResponse } from '../types';
// import { simulateJobStream,MOCK_RESULT_IMAGE } from '../api/mockJob';

// interface UseJobStreamReturn {
//   startStream: (jobId: string) => void;
//   reset: () => void;
//   status: JobResponse['status'] | 'idle';
//   data: JobResponse | null;
//   error: string | null;
//   progress: number;
// }

// export const useJobStream = (): UseJobStreamReturn => {
//   const [status, setStatus] = useState<JobResponse['status'] | 'idle'>('idle');
//   const [data, setData] = useState<JobResponse | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [progress, setProgress] = useState(0);

//   const eventSourceRef = useRef<EventSource | null>(null);
    

//    const startStream = useCallback((jobId: string) => {
//     // RESET STATE
//     setStatus('processing');
//     setError(null);
//     setData(null);
//     setProgress(0);
//     closeStream();

//     // --- MOCK MODE CHECK ---
//     if (import.meta.env.VITE_USE_MOCK === 'true') {
//       console.log('[MOCK] Starting mock job stream...');
      
//       // Override fetchFinalResult for mock
//       const mockFetchFinal = () => {
//         setData({
//           jobId,
//           status: 'completed',
//           result: {
//             imageUrl: MOCK_RESULT_IMAGE,
//             creditsRemaining: 9
//           }
//         });
//         setStatus('completed');
//         setProgress(100);
//       };

//       // Start Simulation
//       const cleanup = simulateJobStream(
//         jobId,
//         (payload) => {
//            if (payload.status === 'completed') {
//              mockFetchFinal();
//            } else {
//              setProgress(payload.progress);
//              setStatus(payload.status);
//            }
//         },
//         () => {} // onComplete handled in callback above
//       );
      
//       // Store cleanup in ref so we can cancel if component unmounts
//       // (Simplified for mock: strictly speaking we'd map this to eventSourceRef or a new ref)
//       return; 
//     }
//     // --- END MOCK MODE ---


    
//   // Helper to safely close connection
//   const closeStream = useCallback(() => {
//     if (eventSourceRef.current) {
//       console.log('[SSE] Closing connection');
//       eventSourceRef.current.close();
//       eventSourceRef.current = null;
//     }
//   }, []);

//   // Final fetch logic
//   const fetchFinalResult = useCallback(async (jobId: string) => {
//     try {
//       console.log('[Fetch] Getting final result...');
//       const response = await apiClient.get<JobResponse>(`/jobs/${jobId}`);
//       setData(response.data);
//       setStatus(response.data.status);
//       setProgress(100);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to retrieve final image.');
//       setStatus('failed');
//     }
//   }, []);

//   const startStream = useCallback((jobId: string) => {
//     // 1. Reset State
//     setStatus('processing');
//     setError(null);
//     setData(null);
//     setProgress(0);
//     closeStream();

//     // 2. Initialize SSE
//     const url = `${import.meta.env.VITE_API_URL || '/api'}/jobs/${jobId}/stream`;
//     console.log(`[SSE] Connecting to: ${url}`);
    
//     const evtSource = new EventSource(url);
//     eventSourceRef.current = evtSource;

//     // 3. Listen for Messages
//     evtSource.onmessage = (event) => {
//       try {
//         const payload = JSON.parse(event.data);
//         console.log('[SSE] Payload:', payload);

//         if (payload.progress) setProgress(payload.progress);

//         if (payload.status === 'completed') {
//           closeStream();
//           fetchFinalResult(jobId); // Trigger the final fetch
//         } else if (payload.status === 'failed') {
//           closeStream();
//           setStatus('failed');
//           setError(payload.message || 'Generation failed');
//         } else {
//           // 'processing' or 'pending'
//           setStatus(payload.status);
//         }
//       } catch (e) {
//         console.error('[SSE] Parse error:', e);
//       }
//     };

//     // 4. Handle Errors
//     evtSource.onerror = (err) => {
//       console.warn('[SSE] Connection error/closed:', err);
//       closeStream();
      
//       // If SSE fails mid-flight, fall back to checking status once
//       // to see if it actually finished or just the connection died.
//       fetchFinalResult(jobId); 
//     };

//   }, [closeStream, fetchFinalResult]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => closeStream();
//   }, [closeStream]);

//   const reset = useCallback(() => {
//     closeStream();
//     setStatus('idle');
//     setData(null);
//     setError(null);
//     setProgress(0);
//   }, [closeStream]);

//   return { startStream, reset, status, data, error, progress };
// };

import { useState, useRef, useCallback, useEffect } from 'react';
import { apiClient } from '../api/client';
import type { JobResponse, SSEMessage } from '../types';
import { simulateJobStream, getMockJobResult } from '../api/mock';

// Toggle this in your .env file: VITE_USE_MOCK=true
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

interface UseJobStreamReturn {
  startStream: (jobId: string) => void;
  reset: () => void;
  status: JobResponse['status'] | 'idle';
  data: JobResponse | null;
  error: string | null;
  progress: number;
}

export const useJobStream = (): UseJobStreamReturn => {
  const [status, setStatus] = useState<JobResponse['status'] | 'idle'>('idle');
  const [data, setData] = useState<JobResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // We use a ref to store the cleanup function (mock) or EventSource (real)
  const connectionRef = useRef<EventSource | (() => void) | null>(null);

  // Cleanup: Stop any active connection
  const closeStream = useCallback(() => {
    if (!connectionRef.current) return;

    if (typeof connectionRef.current === 'function') {
      // It's a mock cleanup function
      connectionRef.current();
    } else {
      // It's a real EventSource
      connectionRef.current.close();
    }
    connectionRef.current = null;
  }, []);

  // ---------------------------------------------------------
  // 1. Final Fetch Logic (The "Get Result" phase)
  // ---------------------------------------------------------
  const fetchFinalResult = useCallback(async (jobId: string) => {
    try {
      if (USE_MOCK) {
        // Mock Response
        const mockData = getMockJobResult(jobId);
        setData(mockData);
        setStatus('completed');
        return;
      }

      // Real API Call
      const response = await apiClient.get<JobResponse>(`/jobs/${jobId}`);
      setData(response.data);
      setStatus(response.data.status);
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve final image.');
      setStatus('failed');
    }
  }, []);

  // ---------------------------------------------------------
  // 2. Start Stream Logic
  // ---------------------------------------------------------
  const startStream = useCallback((jobId: string) => {
    // Reset UI State
    setStatus('processing');
    setError(null);
    setData(null);
    setProgress(0);
    closeStream();

    // --- MOCK MODE PATH ---
    if (USE_MOCK) {
      const stopMock = simulateJobStream(jobId, (msg) => {
        if (msg.status === 'completed') {
          setProgress(100);
          closeStream();
          fetchFinalResult(jobId);
        } else if (msg.status === 'failed') {
          setStatus('failed');
          setError(msg.error || 'Mock generation failed');
          closeStream();
        } else {
          setStatus(msg.status);
          if (msg.progress) setProgress(msg.progress);
        }
      });
      console.log("job and stream is calling..........")
      connectionRef.current = stopMock; // Store cleanup
      return;
    }

    // --- REAL SSE PATH ---
    const url = `${import.meta.env.VITE_API_URL || ''}/api/jobs/${jobId}/stream`;
    console.log(`[SSE] Connecting: ${url}`);
    
    const evtSource = new EventSource(url);
    connectionRef.current = evtSource;

    evtSource.onmessage = (event) => {
      try {
        const payload: SSEMessage = JSON.parse(event.data);

        if (payload.progress) setProgress(payload.progress);

        if (payload.status === 'completed') {
          closeStream();
          fetchFinalResult(jobId); // Trigger the single GET request
        } else if (payload.status === 'failed') {
          closeStream();
          setStatus('failed');
          setError(payload.message || 'Generation failed');
        } else {
          setStatus(payload.status);
        }
      } catch (e) {
        console.error('SSE Parse Error', e);
      }
    };

    evtSource.onerror = (e) => {
      console.error('SSE Error', e);
      closeStream();
      // Fallback: Check status once in case SSE died but job finished
      fetchFinalResult(jobId);
    };

  }, [closeStream, fetchFinalResult]);

  // Auto-cleanup on component unmount
  useEffect(() => {
    return () => closeStream();
  }, [closeStream]);

  const reset = useCallback(() => {
    closeStream();
    setStatus('idle');
    setData(null);
    setError(null);
    setProgress(0);
  }, [closeStream]);

  return { startStream, reset, status, data, error, progress };
};
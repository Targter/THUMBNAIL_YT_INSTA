// This simulates the backend SSE stream logic in the browser
import type { JobResponse } from '../types';

export const simulateJobStream = (
  jobId: string, 
  onMessage: (data: any) => void,
  onComplete: () => void
) => {
  let progress = 0;
  
  const interval = setInterval(() => {
    progress += 10;
    
    // Simulate Progress
    onMessage({
      status: 'processing',
      progress: progress,
      jobId
    });

    // Simulate Completion
    if (progress >= 100) {
      clearInterval(interval);
      onMessage({ status: 'completed', progress: 100, jobId });
      onComplete();
    }
  }, 1000); // Update every second

  return () => clearInterval(interval);
};

export const MOCK_RESULT_IMAGE = "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop";
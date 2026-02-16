// import { JobResponse, SSEMessage } from '../types';
import type { JobResponse,SSEMessage } from '../types';


export const MOCK_DELAY_MS = 8000; // 8 seconds to generate
export const MOCK_RESULT_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop";
const MOCK_VARIANTS = [
  "https://fvbtgxcbfnzeuyvijsrq.supabase.co/storage/v1/object/public/thumbnails/5dc3e916-dcfd-42ed-8cae-38f29caffa93/438bb6f5-c089-4398-a8b9-e671d70b0a6d/gen_0_1770968408342.png", // Abstract
  "https://images.unsplash.com/photo-1535378437321-29e904d1dd4b?q=80&w=1964&auto=format&fit=crop", // Future
  "https://fvbtgxcbfnzeuyvijsrq.supabase.co/storage/v1/object/public/thumbnails/5dc3e916-dcfd-42ed-8cae-38f29caffa93/438bb6f5-c089-4398-a8b9-e671d70b0a6d/gen_2_1770968409416.png"  // Cyber
];
/**
 * Simulates an EventSource stream
 */
export const simulateJobStream = (
  jobId: string,
  onMessage: (data: SSEMessage) => void
) => {
  let progress = 0;
  const intervalTime = 800; // Update every 800ms

  console.log(`[Mock] Starting job ${jobId}...`);

  const interval = setInterval(() => {
    progress += 10;
    
    // Simulate randomness
    const isComplete = progress >= 100;

    if (isComplete) {
      clearInterval(interval);
      console.log(`[Mock] Job ${jobId} completed.`);
      onMessage({
        jobId,
        status: 'completed',
        progress: 100,
        message: 'Generation successful'
      });
    } else {
      console.log(`[Mock] Job ${jobId} progress: ${progress}%`);
      onMessage({
        jobId,
        status: 'processing',
        progress: progress,
        message: 'Generating pixels...'
      });
    }
  }, intervalTime);

  // Return cleanup function (like closing an EventSource)
  return () => {
    console.log(`[Mock] Connection closed for ${jobId}`);
    clearInterval(interval);
  };
};

/**
 * Simulates the final GET /api/jobs/:id response
 */
export const getMockJobResult = (jobId: string): JobResponse => ({
  jobId,
  status: 'completed',
  progress: 100,
  result: {
    imageUrls: MOCK_VARIANTS,
    creditsRemaining: 9 // Mock remaining credits
  }
});
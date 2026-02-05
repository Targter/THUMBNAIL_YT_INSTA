export type Platform = 'youtube' | 'instagram';

export interface GenerateRequest {
  description: string;
  platform: Platform;
  styleReferenceId?: string;
}

export interface JobResult {
  imageUrl: string[];
  creditsRemaining: number;
}

export interface JobResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number; // 0 to 100
  result?: JobResult;
  error?: string;
}

export interface SSEMessage {
  jobId: string;
  status: JobResponse['status'];
  progress?: number;
  message?: string;
  error?: string;
}

export interface Favorite {
  id: string;
  imageUrl: string;
  prompt: string;
  platform?: Platform;
  createdAt?: string;
}
export type Platform = 'youtube' | 'instagram';

// export interface GenerateRequest {
//   prompt: string;
//   platform: Platform;
//   styleReferenceId?: string;
//   userUpload?:any;
// }
// export interface GenerateEdit {
//   prompt: any;
//   imageUrl?: any;
//   platform?:Platform;
// }

export interface GenerateRequest {
  prompt: string;
  platform: 'youtube' | 'instagram';
  userUpload?: File | null; // The file object
  useStyleRef?: boolean;
  styleId?: string; // Optional: ID of the favorite to use
  styleReferenceId?:any;
}

export interface GenerateEdit {
  prompt: string;
  imageUrl: string; // The URL (String), not a File
  platform?: 'youtube' | 'instagram';
}

export interface Favorite {
  id: string;
  image_path: string;
  public_url: string;
  is_uploaded: boolean;
  created_at: string;
}


export interface JobResult {
  imageUrls: string[];
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
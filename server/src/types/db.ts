export type JobStatus = "pending" | "processing" | "completed" | "failed";

export interface JobData {
  jobId: string;
  userId: string;
  prompt: string;

  platform: string;

  contextImagePath:any;
  sourceImageUrl:string

  count: number; // usually 3,
  isEdit:boolean,
  styleImagePath:any
}

export interface GenerationResult {
  image_path: string;
  public_url: string;
  seed: number;
}

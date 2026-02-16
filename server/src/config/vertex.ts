
import { VertexAI } from '@google-cloud/vertexai';
import { PredictionServiceClient } from '@google-cloud/aiplatform';
import { GoogleAuth } from 'google-auth-library';

// 1. Load Env Variables
const PROJECT_ID = process.env.GCP_PROJECT_ID; // e.g., "my-project-123"
const LOCATION = process.env.GCP_LOCATION || 'us-central1';
const KEY_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS; // Path to .json file

if (!PROJECT_ID) {
  throw new Error("❌ GCP_PROJECT_ID is missing from .env");
}

// console.log(`[Vertex Config] Initializing for Project: ${PROJECT_ID} in ${LOCATION}`);

// 2. Auth Helper (Keeps connection alive)
const authOptions = {
  keyFile: KEY_PATH,
  scopes: ['https://www.googleapis.com/auth/cloud-platform']
};

// 3. Initialize Gemini Client (For Text/Prompting)
const vertexAI = new VertexAI({
  project: PROJECT_ID,
  location: LOCATION,
  googleAuthOptions: authOptions
});

// 4. Initialize Imagen Client (For Image Generation)
const predictionClient = new PredictionServiceClient({
  apiEndpoint: `${LOCATION}-aiplatform.googleapis.com`,
  keyFilename: KEY_PATH,
  projectId: PROJECT_ID
});

export { vertexAI, predictionClient, PROJECT_ID, LOCATION };
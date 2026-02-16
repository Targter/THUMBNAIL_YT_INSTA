import { PredictionServiceClient, helpers } from '@google-cloud/aiplatform';
import { GoogleGenerativeAI } from '@google/generative-ai';

// INIT
const PROJECT_ID = process.env.GCP_PROJECT_ID;
const LOCATION = 'us-central1';
const API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

const predictionClient = new PredictionServiceClient({
  apiEndpoint: `${LOCATION}-aiplatform.googleapis.com`,
});
const genAI = new GoogleGenerativeAI(API_KEY!);

/**
 * STEP 1: EXTRACT VISUAL DNA (Gemini)
 * Instead of just asking for a prompt, we ask Gemini to create a 
 * forensic description of the Subject's face.
 */
async function extractVisualDNA(subjectBuffer: Buffer): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Vision model

  const prompt = `
  Analyze this face in extreme detail for an image generator. 
  Focus ONLY on physical features. Do not describe clothing or background.
  
  Describe:
  1. Exact skin tone and texture.
  2. Eye shape and color.
  3. Nose shape.
  4. Facial hair (exact style) or lack thereof.
  5. Hairstyle and color.
  6. Any distinguishing marks (glasses, moles, scars).
  
  Output a single dense paragraph describing the person: "A photorealistic close-up of a [ethnicity] man with [feature]..."
  `;

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: subjectBuffer.toString("base64"), mimeType: "image/jpeg" } }
  ]);
  
  return result.response.text();
}

/**
 * STEP 2: CONSTRUCT THE MEGA-PROMPT
 * We merge the "Visual DNA" with the "Style" and "Title".
 */
async function createIdentityLockedPrompt(
  title: string,
  userPrompt: string, 
  visualDNA: string, 
  styleBuffer?: Buffer
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  let inputs: any[] = [
    `ACT AS A PROMPT ENGINEER.
    
    GOAL: Create a prompt for a YouTube thumbnail where the CHARACTER IS EXACT.
    
    INPUT DATA:
    1. THE CHARACTER (VISUAL DNA): "${visualDNA}" (You MUST preserve these details).
    2. THE SCENARIO: "${userPrompt}"
    3. THE TITLE VIBE: "${title}"
    ${styleBuffer ? "4. STYLE REFERENCE: (See attached image)" : ""}

    INSTRUCTIONS:
    - Write a prompt that places THE CHARACTER into THE SCENARIO.
    - IMPORTANT: If the Style Reference image contains a person, IGNORE THAT PERSON. Only copy the *lighting*, *colors*, and *camera angle* of the style.
    - The character description must be high priority.
    - Use strong keywords: "Photorealistic", "8k", "Raw photo", "Detailed skin texture".

    OUTPUT:
    Return ONLY the raw prompt text.
    `,
  ];

  if (styleBuffer) {
    inputs.push({ inlineData: { data: styleBuffer.toString("base64"), mimeType: "image/jpeg" } });
  }

  const result = await model.generateContent(inputs);
  return result.response.text();
}

/**
 * STEP 3: GENERATE WITH IMAGEN 3 (The Execution)
 */
export async function generateThumbnailBatch({
  prompt, // The user's idea
  title,  // The video title
  count = 3,
  subjectImage, // THE FACE
  styleImage,   // THE VIBE
}: {
  prompt: string, title: string, count?: number, subjectImage?: Buffer, styleImage?: Buffer
}) {

  console.log("🧠 Phase 1: Extracting Visual DNA from Subject...");
  // We get a text description of the face to reinforce the image reference
  if (!subjectImage) throw new Error("Subject image is required");
  const visualDNA = await extractVisualDNA(subjectImage);
  
  console.log("🧠 Phase 2: Constructing Identity-Locked Prompt...");
  // We build the prompt ensuring the style doesn't overwrite the face
  const finalPrompt = await createIdentityLockedPrompt(title, prompt, visualDNA, styleImage);
  console.log("📝 Final Prompt:", finalPrompt);

  console.log("🎨 Phase 3: Sending to Imagen 3...");

  // PREPARE THE PAYLOAD
  // We use subject_reference for the visual lock
  const instance: any = {
    prompt: finalPrompt,
    subject_reference: {
      image: { bytes: subjectImage.toString('base64') },
      subject_type: "PERSON", 
      // CRITICAL: We pass the visualDNA here too so the model knows exactly what to look for
      subject_description: visualDNA 
    }
  };

  // We add style reference ONLY if provided
  if (styleImage) {
    instance.style_reference = {
      image: { bytes: styleImage.toString('base64') },
      reference_type: "STYLE_AND_COMPOSITION" // Using this instead of just STYLE is often stronger for layouts
    };
  }

  const parameters = helpers.toValue({
    sampleCount: count,
    aspectRatio: "16:9",
    // We can increase adherence to the prompt (guidance scale) if the face is drifting, 
    // but Imagen manages this internally mostly.
    personGeneration: "allow_adult",
    safetyFilterLevel: "block_some",
  });

  const endpoint = `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/imagen-3.0-generate-001`;

  const result = await predictionClient.predict({
    endpoint,
    instances: [helpers.toValue(instance) as any],
    parameters: parameters as any,
  });

  const response = result[0];

  if (!response.predictions) throw new Error("Generation failed");

  return response.predictions.map((p: any) => {
    const bytes = p.structValue?.fields?.bytesBase64Encoded?.stringValue;
    return bytes ? Buffer.from(bytes, 'base64') : null;
  }).filter(Boolean);
}
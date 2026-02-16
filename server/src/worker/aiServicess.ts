// // import { vertexAI, predictionClient } from '../config/vertex';
// // import { helpers } from '@google-cloud/aiplatform';

// // // Configuration
// // const PROJECT_ID = process.env.GCP_PROJECT_ID;
// // const LOCATION = process.env.GCP_LOCATION || 'us-central1';
// // const PUBLISHER = 'google';
// // const IMAGEN_MODEL = 'imagen-3.0-generate-001'; // The PRO Model

// // interface GenerateOptions {
// //   prompt: string;
// //   count?: number;
  
// //   // 1. Subject (Keep Identity)
// //   subjectImage?: Buffer; 
  
// //   // 2. Style (Keep Vibe)
// //   styleImage?: Buffer;   
  
// //   // 3. Edit Target
// //   sourceImage?: Buffer;
// //   isEdit?: boolean;
// // }
// // // subjectImage
// // // Helper: Buffer to Base64
// // const toBase64 = (b: Buffer) => b.toString('base64');

// // /**
// //  * STAGE 1: THE ART DIRECTOR (Gemini 1.5 Pro)
// //  * Analyzes inputs and writes the perfect engineering prompt for Imagen.
// //  */
// // async function craftProPrompt(
// //   userPrompt: string, 
// //   subjectBuffer?: Buffer, 
// //   styleBuffer?: Buffer
// // ): Promise<string> {
  
// //   console.log(`[Vertex AI] Stage 1: Gemini 1.5 Pro analyzing inputs...`);
  
// //   const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// //   const textPart = {
// //     text: `
// //       ROLE: You are an expert Image Prompt Engineer for Imagen 3.
// //       GOAL: Write a single, highly detailed text prompt to generate a YouTube Thumbnail.
      
// //       INPUTS PROVIDED:
// //       1. USER REQUEST: "${userPrompt}"
// //       ${subjectBuffer ? '2. SUBJECT IMAGE: Contains the specific person/object to feature.' : ''}
// //       ${styleBuffer ? '3. STYLE REFERENCE: Contains the color palette, lighting, and composition to mimic.' : ''}

// //       INSTRUCTIONS:
// //       - If SUBJECT IMAGE is provided: Describe the person/object in extreme detail (hair color, gender, clothing, distinctive features) so Imagen can recreate them.
// //       - If STYLE REFERENCE is provided: Describe the artistic style (e.g., "Neon lighting", "Cyberpunk aesthetic", "Matte painting style", "Thick outlines").
// //       - COMBINE them into one cohesive prompt.
// //       - ADD "high quality, 8k, hyper-realistic, thumbnail style, vibrant colors".
// //       - OUTPUT ONLY THE TEXT PROMPT. NO EXPLANATIONS.
// //     `
// //   };

// //   const parts: any[] = [textPart];

// //   if (subjectBuffer) {
// //     parts.push({
// //       inlineData: { mimeType: 'image/png', data: toBase64(subjectBuffer) }
// //     });
// //   }

// //   if (styleBuffer) {
// //     parts.push({
// //       inlineData: { mimeType: 'image/png', data: toBase64(styleBuffer) }
// //     });
// //   }

// //   const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
// //   const finalPrompt = result.response.candidates?.[0].content.parts?.[0].text;
  
// //   if (!finalPrompt) throw new Error("Gemini failed to craft prompt");
  
// //   console.log(`[Vertex AI] Optimized Prompt: "${finalPrompt.substring(0, 60)}..."`);
// //   return finalPrompt;
// // }

// // /**
// //  * STAGE 2: THE STUDIO (Imagen 3)
// //  * Generates the actual pixels using the optimized prompt.
// //  */
// // async function generatePixels(prompt: string, aspectRatio: string): Promise<Buffer> {
// //   const endpoint = `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/${PUBLISHER}/models/${IMAGEN_MODEL}`;

// //   const instance = helpers.toValue({ prompt });
// //   const parameters = helpers.toValue({
// //     sampleCount: 1,
// //     aspectRatio: aspectRatio,
// //     safetyFilterLevel: 'block_some',
// //     personGeneration: 'allow_adult', // Required for expressive YouTube faces
// //   });

// //   if (!instance || !parameters) {
// //     throw new Error("Failed to convert values for Imagen API");
// //   }

// //   const [response] = await predictionClient.predict({
// //       endpoint,
// //       instances: [instance],
// //       parameters,
// //   });

// //   const bytesBase64 = response.predictions?.[0]?.structValue?.fields?.bytesBase64Encoded?.stringValue;
// //   if (!bytesBase64) throw new Error("Imagen 3 returned no image data.");
  
// //   return Buffer.from(bytesBase64, 'base64');
// // }

// // /**
// //  * STAGE 3: EDITING (Imagen 2/3 Edit Mode)
// //  */
// // async function editPixels(sourceBuffer: Buffer, prompt: string): Promise<Buffer> {
// //   // Vertex AI Image Editing endpoint logic
// //   // Note: For simplicity in this snippet, we use a specialized prompt approach
// //   // In production, you would call 'image-editing-001' model
// //   console.log(`[Vertex AI] Editing Image...`);
// //   // Placeholder for specific Edit API call, essentially same structure as generatePixels
// //   // but passing 'image' in the instance.
// //   // For now, we reuse generatePixels with strong prompting as Imagen 3 follows text extremely well.
// //   return generatePixels(`EDITING TASK: ${prompt}. INPUT IMAGE DESCRIPTION: [Imagine description here]`, "16:9");
// // }

// // /**
// //  * MAIN EXPORT
// //  */
// // export const generateThumbnailBatch = async ({
// //   prompt,
// //   count = 3,
// //   subjectImage, // The "Context"
// //   styleImage,   // The "Favorite"
// //   sourceImage,  // The "Edit Target"
// //   isEdit = false
// // }: GenerateOptions): Promise<Buffer[]> => {
  
// //   const generatedBuffers: Buffer[] = [];
  
// //   // 1. Determine Prompt Strategy
// //   let optimizedPrompt = prompt;
  
// //   // If we have references, let Gemini 1.5 Pro merge them into a text description
// //   if (!isEdit && (subjectImage || styleImage)) {
// //     optimizedPrompt = await craftProPrompt(prompt, subjectImage, styleImage);
// //   }

// //   console.log(`[Vertex AI] Generating ${count} variations using Imagen 3...`);

// //   // 2. Generation Loop
// //   for (let i = 0; i < count; i++) {
// //     try {
// //       let buffer: Buffer;

// //       if (isEdit && sourceImage) {
// //         // Use Editing Pipeline
// //         buffer = await editPixels(sourceImage, prompt); 
// //       } else {
// //         // Use Generation Pipeline
// //         // Add variation noise to prompt
// //         const variation = i === 0 ? "" : ` (Variation ${i+1}: different angle, unique composition)`;
// //         buffer = await generatePixels(optimizedPrompt + variation, "16:9");
// //       }

// //       generatedBuffers.push(buffer);
// //       console.log(`[Vertex AI] Image ${i+1} Ready.`);
// //     } catch (e: any) {
// //       console.error(`[Vertex AI] Failed var ${i+1}:`, e.message);
// //     }
// //   }

// //   if (generatedBuffers.length === 0) throw new Error("Vertex AI pipeline failed.");
// //   return generatedBuffers;
// // };


// // import { createGoogleGenerativeAI } from '@ai-sdk/google';

// import {  predictionClient, PROJECT_ID, LOCATION } from '../config/vertex';
// import { helpers } from '@google-cloud/aiplatform';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// // CONSTANTS
// const PUBLISHER = 'google';
// const IMAGEN_MODEL = 'imagen-3.0-generate-001'; // Ensure you have access or use 'imagegeneration@006'

// interface GenerateOptions {
//   prompt: string;
//   count?: number;
//   subjectImage?: Buffer; // Context/Face
//   styleImage?: Buffer;   // Favorite/Style
//   sourceImage?: Buffer;  // For Editing
//   isEdit?: boolean;
// }

// // Helper
// const toBase64 = (b: Buffer) => b.toString('base64');

// // --- STAGE 1: PROMPT ENGINEERING (Gemini) ---
// async function craftProPrompt(
//   userPrompt: string, 
//   subjectBuffer?: Buffer, 
//   styleBuffer?: Buffer
// ): Promise<string> {
  
//   console.log(`[Vertex AI] Stage 1: Crafting prompt with Gemini...`);
  
//   //   const google = createGoogleGenerativeAI({
//   //   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
//   // });
//   const genAI = new GoogleGenerativeAI(
//   process.env.GOOGLE_GENERATIVE_AI_API_KEY!
// );
//     const model = genAI.getGenerativeModel({
//     model: 'gemini-2.5-flash', // ✅ correct model
//   });


//   // USE SPECIFIC STABLE MODEL VERSION
//   // const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-pro-001' });

//   const textPart = {
//     text: `
//       ROLE: You are an expert Image Prompt Engineer for Imagen 3.
//       GOAL: Write a single, highly detailed text prompt to generate a YouTube Thumbnail.
      
//       INPUTS:
//       1. USER REQUEST: "${userPrompt}"
//       ${subjectBuffer ? '2. SUBJECT IMAGE: Contains the person/object to feature.' : ''}
//       ${styleBuffer ? '3. STYLE REFERENCE: Contains the color/lighting/vibe.' : ''}

//       INSTRUCTIONS:
//       - Describe the Subject in extreme detail (hair, eyes, clothes) so Imagen can recreate it.
//       - Describe the Style (neon, cinematic, matte painting).
//       - Add: "high quality, 8k, hyper-realistic, vivid colors, rule of thirds".
//       - OUTPUT ONLY THE TEXT PROMPT.
//     `
//   };

//   const parts: any[] = [textPart];

//   if (subjectBuffer) {
//     parts.push({ inlineData: { mimeType: 'image/jpeg', data: toBase64(subjectBuffer) } });
//   }
//   if (styleBuffer) {
//     parts.push({ inlineData: { mimeType: 'image/jpeg', data: toBase64(styleBuffer) } });
//   }

//   try {

//     const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
//     const responseText = result.response.candidates?.[0].content.parts?.[0].text;
//     if (!responseText) throw new Error("Empty response from Gemini");
    
//     console.log(`[Vertex AI] Optimized Prompt: "${responseText.substring(0, 50)}..."`);
//     return responseText;
//   } catch (err: any) {
//     console.error("Gemini Prompt Error:", err);
//     return userPrompt; // Fallback to raw prompt if Gemini fails
//   }
// }

// // --- STAGE 2: IMAGE GENERATION (Imagen) ---
// async function generatePixels(prompt: string, aspectRatio: string): Promise<Buffer> {
//   const endpoint = `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/${PUBLISHER}/models/${IMAGEN_MODEL}`;

//   const instance = helpers.toValue({ prompt });
//   const parameters = helpers.toValue({
//     sampleCount: 1,
//     aspectRatio: aspectRatio,
//     safetyFilterLevel: 'block_some',
//     personGeneration: 'allow_adult',
//   });

//   if (!instance || !parameters) {
//     throw new Error("Failed to convert values for Imagen API");
//   }

//   try {
//     const response = await predictionClient.predict({
//       endpoint,
//       instances: [instance],
//       parameters,
//     });

//     const bytesBase64 = response[0]?.predictions?.[0]?.structValue?.fields?.bytesBase64Encoded?.stringValue;
//     if (!bytesBase64) throw new Error("Imagen returned no data");
    
//     return Buffer.from(bytesBase64, 'base64');
//   } catch (err: any) {
//     // Detailed error logging
//     console.error("Vertex Imagen Error:", JSON.stringify(err, null, 2));
//     throw err; 
//   }
// }

// // --- MAIN FUNCTION ---
// export const generateThumbnailBatch = async ({
//   prompt,
//   count = 3,
//   subjectImage,
//   styleImage,
//   sourceImage,
//   isEdit = false
// }: GenerateOptions): Promise<Buffer[]> => {
  
//   const generatedBuffers: Buffer[] = [];
  
//   // 1. Optimize Prompt
//   let finalPrompt = prompt;
//   if (!isEdit) {
//     finalPrompt = await craftProPrompt(prompt, subjectImage, styleImage);
//   }

//   console.log(`[Vertex AI] Generating ${count} variations...`);

//   for (let i = 0; i < 1; i++) {
//     try {
//       // Add slight noise for variety
//       const variation = i === 0 ? "" : ` (Variation ${i}: distinct lighting)`;
      
//       const buffer = await generatePixels(finalPrompt + variation, "16:9");
//       generatedBuffers.push(buffer);
//       console.log(`[Vertex AI] Image ${i+1} Generated.`);
//     } catch (e) {
//       console.error(`[Vertex AI] Failed var ${i+1}`);
//     }
//   }

//   if (generatedBuffers.length === 0) throw new Error("Vertex AI Generation Failed");
//   return generatedBuffers;
// };

import { predictionClient, PROJECT_ID, LOCATION } from '../config/vertex';
import { helpers } from '@google-cloud/aiplatform';
import { GoogleGenerativeAI } from '@google/generative-ai';

// CONSTANTS
const PUBLISHER = 'google';
// Use the newest Imagen 3 model (check if 'imagen-3.0-generate-001' is enabled in your cloud console)
const IMAGEN_MODEL = 'imagen-3.0-generate-001'; 

interface GenerateOptions {
  prompt: string;
  count?: number;
  subjectImage?: Buffer; // YOUR FACE
  styleImage?: Buffer;   
  sourceImage?:any;
  isEdit?: boolean;
}

const toBase64 = (b: Buffer) => b.toString('base64');

// --- STAGE 1: FORENSIC PROMPT ENGINEERING (Gemini 1.5 Pro) ---
async function craftProPrompt(
  userPrompt: string, 
  subjectBuffer?: Buffer, 
  styleBuffer?: Buffer
): Promise<string> {
  
  console.log(`[Vertex AI] Stage 1: Forensic analysis...`);
  
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
  
  // FIX: Use 'gemini-1.5-pro' for better image reasoning. '2.5' doesn't exist yet.
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

  const textPart = {
    text: `
      ROLE: You are a YouTube Thumbnail Director.
      GOAL: Write a prompt for Imagen 3 that places the person from the SUBJECT IMAGE into the context of the REQUEST.

      INPUTS:
      1. REQUEST: "${userPrompt}"
      2. SUBJECT IMAGE: The specific person to generate.

      INSTRUCTIONS:
      1. IDENTIFY THE SUBJECT: Briefly describe the person's key features (ethnicity, approximate age, hair style, beard, glasses).
      2. CLOTHING STRATEGY: If the user didn't ask to change clothes, describe exactly what they are wearing in the SUBJECT IMAGE to keep consistency.
      3. SCENE INTEGRATION: Place this specific person into the scene described in the REQUEST.
      4. STYLE: Natural, high-quality YouTube thumbnail style. Bright, clear, sharp focus on the face.
      
      OUTPUT FORMAT: 
      Write a single prompt string starting with: "A high-quality photo of [description of person]..."
      
      AVOID: "Cyberpunk", "Futuristic" (unless requested), "CGI", "Render". Keep it looking like a high-end camera photo.
    `
  };

  const parts: any[] = [textPart];

  if (subjectBuffer) {
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: toBase64(subjectBuffer) } });
  }

  try {
    const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
    const responseText = result.response.candidates?.[0].content.parts?.[0].text;
    if (!responseText) throw new Error("Empty response from Gemini");
    
    console.log(`[Vertex AI] Gemini Prompt: "${responseText.substring(0, 100)}..."`);
    return responseText;
  } catch (err: any) {
    console.error("Gemini Prompt Error:", err);
    return userPrompt; 
  }
}

// --- STAGE 2: GENERATION (Imagen with Reference) ---
async function generatePixels(
  prompt: string, 
  aspectRatio: string, 
  subjectBuffer?: Buffer
): Promise<Buffer> {
  const endpoint = `projects/${PROJECT_ID}/locations/${LOCATION}/publishers/${PUBLISHER}/models/${IMAGEN_MODEL}`;

  // FIX: Less "Sci-Fi" boosters. More "YouTuber" boosters.
  const styleBoost = ", canon eos r5, 50mm lens, sharp focus, natural studio lighting, 4k, high detail, youtube thumbnail aesthetics.";
  const negativePrompt = "cartoon, 3d render, painting, drawing, plastic skin, disfigured, blurry, low contrast, dark, distorted face.";

  const finalPrompt = `${prompt} ${styleBoost} --negative_prompt="${negativePrompt}"`;

  // PREPARE INSTANCE
  // Ideally, we pass the image as a reference if the model supports 'image-to-image' or 'subject' modes.
  // For standard generation-001, we rely on the Prompt. 
  // IF you are using a model version that supports input images (like for variation/editing), 
  // you pass the image here.
  
  const instance: any = { prompt: finalPrompt };

  // **CRITICAL:** If we have a subject image, we can try to pass it as a semantic guide 
  // (depending on exact model capability allowed in your GCP project).
  // If your model supports 'image' input (Image-to-Image), this keeps the structure/clothes.
  if (subjectBuffer) {
    instance.image = {
        bytesBase64Encoded: toBase64(subjectBuffer)
    };
  }

  const instanceValue = helpers.toValue(instance);
  
  const parameters = helpers.toValue({
    sampleCount: 1,
    aspectRatio: aspectRatio,
    safetyFilterLevel: 'block_some',
    personGeneration: 'allow_adult',
    // 'add_subject_style': true // If available in your API version
  });

  if (!instanceValue || !parameters) throw new Error("Failed to convert values");

  try {
    const response = await predictionClient.predict({
      endpoint,
      instances: [instanceValue],
      parameters,
    });

    const predictions = response[0].predictions;
    if (!predictions || predictions.length === 0) throw new Error("No predictions returned");

    const bytesBase64 = predictions[0]?.structValue?.fields?.bytesBase64Encoded?.stringValue;
    if (!bytesBase64) throw new Error("Imagen returned no data");
    
    return Buffer.from(bytesBase64, 'base64');
  } catch (err: any) {
    console.error("Vertex Imagen Error:", JSON.stringify(err, null, 2));
    throw err; 
  }
}

// --- MAIN EXPORT ---
export const generateThumbnailBatch = async ({
  prompt,
  count = 1,
  subjectImage,
  styleImage,
  isEdit = false
}: GenerateOptions): Promise<Buffer[]> => {
  
  const generatedBuffers: Buffer[] = [];
  
  // 1. Optimize Prompt with Gemini 1.5 Pro
  let finalPrompt = prompt;
  if (!isEdit && subjectImage) {
    finalPrompt = await craftProPrompt(prompt, subjectImage, styleImage);
  }

  console.log(`[Vertex AI] Generating...`);

  for (let i = 0; i < 1; i++) {
    try {
      // Pass the subjectImage to generatePixels so it can use it as a structural reference
      const buffer = await generatePixels(finalPrompt, "16:9", subjectImage);
      generatedBuffers.push(buffer);
      console.log(`[Vertex AI] Image ${i+1} Generated.`);
    } catch (e) {
      console.error(`[Vertex AI] Failed var ${i+1}`, e);
    }
  }

  return generatedBuffers;
};
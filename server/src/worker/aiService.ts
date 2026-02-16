import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

// Initialize Google AI with Server Environment Variable
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

interface GenerateOptions {
  prompt: string;
  count?: number;
  contextImage?: Buffer; // Node.js Buffer (from Supabase)
  mimeType?: string;     // e.g., 'image/png'
   isEdit?: boolean;
}

export const generateThumbnailBatch = async ({
  prompt,
  count = 3,
  contextImage,
  mimeType = 'image/png',
  isEdit = false
}: GenerateOptions): Promise<Buffer[]> => {

  const generatedBuffers: Buffer[] = [];

  console.log(`[AI Service] Preparing prompt with context for: "${prompt.substring(0, 30)}..."`);

  // ------------------------------------------------------------------
  // 1. PREPARE CONTEXT IMAGES (Node.js Buffer -> Data URL)
  // ------------------------------------------------------------------
  let mainImageDataUrl: string | null = null;
  
  if (contextImage) {
    // Node.js equivalent of FileReader/btoa
    const base64 = contextImage.toString('base64');
    mainImageDataUrl = `data:${mimeType};base64,${base64}`;
  }

   const designRules = `
    ROLE: You are an elite YouTube Thumbnail Designer.
    TASK: ${isEdit ? 'Edit the provided image' : 'Create a new thumbnail'} based on: "${prompt}".
    
    DESIGN RULES (STRICT):
    1. COMPOSITION: Rule of thirds. Subject must be large and separated from background.
    2. COLORS: High saturation, complementary colors (e.g., Teal/Orange, Blue/Yellow).
    3. TEXT: If text is needed, use short, punchy 2-3 word phrases. readable fonts.
    4. EMOTION: High energy, clear facial expressions (if people are present).
    5. STYLE: 3D Render style or High-End Photography. NOT cartoonish unless requested.
    6. ASPECT RATIO: 16:9 Landscape.
    
    ${mainImageDataUrl ? 'IMPORTANT: The provided image is the MAIN SUBJECT. Do not distort faces. Enhance lighting and background.' : ''}
  `;

  const hasMain = !!mainImageDataUrl;
  
  // ------------------------------------------------------------------
  // 2. CONSTRUCT SYSTEM PROMPT (Your Exact Logic)
  // ------------------------------------------------------------------
  let thumbnailPrompt = `Create a professional, eye-catching YouTube thumbnail based on this request: ${prompt}.\n\n`;

  // Build image context explanation
  const imageContextParts: string[] = [];
  let imageIndex = 1;

  if (hasMain) {
    imageContextParts.push(`- Image ${imageIndex}: This is the MAIN subject that MUST be prominently featured in the thumbnail.`);
    imageIndex++;
  }

  if (imageContextParts.length > 0) {
    thumbnailPrompt += `IMPORTANT: I am providing images below:\n${imageContextParts.join("\n")}\n\n`;
  }

  thumbnailPrompt += `Requirements:
  - Make it vibrant, high-contrast, and optimized for click-through rate
  - Use bold colors and clear visual hierarchy
  - Aspect ratio must be 16:9
  - Make it look professional and eye-catching`;

  // ------------------------------------------------------------------
  // 3. GENERATION LOOP
  // ------------------------------------------------------------------
  for (let i = 0; i < 2; i++) {
    try {
      console.log(`[AI Service] Generating variation ${i + 1}/${count}...`);

      // A. Build Multimodal User Content
      const userContent: Array<{ type: 'text'; text: string } | { type: 'image'; image: string }> = [];

      // Add Text
      // userContent.push({
      //   type: 'text',
      //   text: thumbnailPrompt,
      // });

      // Add Image (if exists)
      if (mainImageDataUrl) {
        userContent.push({
          type: 'image',
          image: mainImageDataUrl, // Vercel SDK handles Data URI
        });
      }

      // B. Call API
      const result = await generateText({
        // Fallback to experimental model if 2.5 isn't available to your key yet
        model: google('gemini-2.5-flash-image'), 
        messages: [
          {
            role: 'user',
             content: [
              { type: 'text', text: designRules },
              ...(mainImageDataUrl ? [{ type: 'image' as const, image: mainImageDataUrl }] : [])
            ],
          },
        ],
        providerOptions: {
          google: {
            responseModalities: ["TEXT", "IMAGE"], // Request Image Output
            imageConfig: {
              aspectRatio: "16:9",
            },
          },
        },
      });

      // C. Extract Image (Node.js Safe Extraction)
      // The SDK response structure for images can vary in Node vs Browser.
      // We look for 'files' (if updated SDK) or parse standard text output if base64.
      
      let imageBuffer: Buffer | null = null;

      // Check if SDK returned structured files (Vercel AI SDK Core)
      // @ts-ignore - 'files' might be experimental in some type definitions
      if (result.files && result.files.length > 0) {
        // @ts-ignore
        const file = result.files[0];

        if (file.mediaType.startsWith('image/')) {
            const uint8Array = await file.uint8Array;
             imageBuffer = Buffer.from(uint8Array);
        //   imageBuffer = Buffer.from(file.data, 'base64');
        }
      } 
      // Fallback: Sometimes Gemini returns a raw base64 string in the text response
      else if (result.text && result.text.length > 1000) {
        // Simple check: does it look like base64?
        try {
            // Cleanup potential markdown wrapping like ```base64 ... ```
            const cleanText = result.text.replace(/```/g, '').replace('base64', '').trim();
            imageBuffer = Buffer.from(cleanText, 'base64');
        } catch (e) {
            console.warn("Failed to parse base64 from text");
        }
      }

      if (imageBuffer) {
        generatedBuffers.push(imageBuffer);
        console.log(`[AI Service] Variation ${i + 1} Success`);
      } else {
        console.warn(`[AI Service] Variation ${i + 1} returned no usable image data.`);
      }

    } catch (error: any) {
      console.error(`[AI Service] Variation ${i + 1} Error:`, error.message);
      
      if (error.message.includes('404')) {
        throw new Error("Model 'gemini-2.0-flash-exp' (or 2.5) not found. Check your API Key permissions.");
      }
    }


  }

  // D. Fail-safe (If AI fails, don't crash the worker, throw clean error)
  if (generatedBuffers.length === 0) {
    throw new Error("No images were generated. AI Provider returned empty or invalid responses.");
  }

  return generatedBuffers;
};
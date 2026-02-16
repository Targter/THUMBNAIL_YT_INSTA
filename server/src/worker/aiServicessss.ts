// // import { createGoogleGenerativeAI } from '@ai-sdk/google';
// // import { generateText } from 'ai';

// // // Initialize Google AI
// // const google = createGoogleGenerativeAI({
// //   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
// // });

// // interface GenerateOptions {
// //   prompt: string;         // "User pointing at graph"
// //   title: string;          // "I LOST EVERYTHING"
// //   count?: number;
// //   subjectImage?: Buffer;   // THE FACE (Identity)
// //   styleImage?: Buffer;    // THE VIBE (Reference)
// //   mimeType?: string;      
// // }

// // export const generateThumbnailBatch = async ({
// //   prompt,
// //   title,
// //   count = 1,
// //   subjectImage,
// //   styleImage,
// //   mimeType = 'image/png',
// // }: GenerateOptions): Promise<Buffer[]> => {

// //   const generatedBuffers: Buffer[] = [];
// //   console.log(`[AI Service] 🧠 Initializing Gemini 2.0 Flash for: "${title}"`);

// //   // ------------------------------------------------------------------
// //   // 1. PREPARE IMAGES (Buffer -> Data URL)
// //   // ------------------------------------------------------------------
// //   // Helper to convert buffer to data URL
// //   const toDataURL = (buf: Buffer) => `data:${mimeType};base64,${buf.toString('base64')}`;

// //   const subjectDataUrl = subjectImage ? toDataURL(subjectImage) : null;
// //   const styleDataUrl = styleImage ? toDataURL(styleImage) : null;

// //   // ------------------------------------------------------------------
// //   // 2. CONSTRUCT THE "DEEP THOUGHT" PROMPT
// //   // ------------------------------------------------------------------
// //   // We explicitly label the images in the text prompt so Gemini knows which is which.
// //   const systemInstruction = `
// //     ROLE: You are the world's best YouTube Thumbnail Artist using Gemini 2.0 Vision.
    
// //     TASK: Generate a photorealistic YouTube thumbnail.
    
// //     INPUTS PROVIDED:
// //     1. IMAGE 1: The MAIN SUBJECT (The YouTuber). You MUST preserve their facial features, hair, and ethnicity exactly.
// //     ${styleDataUrl ? '2. IMAGE 2: The STYLE REFERENCE. Copy the lighting, color grading, and composition from this image.' : ''}
    
// //     CONTEXT:
// //     - VIDEO TITLE: "${title}"
// //     - SCENARIO: ${prompt}
    
// //     STRICT VISUAL RULES:
// //     - The Subject from Image 1 must be the central figure.
// //     - The Facial Expression must match the "Video Title" (e.g., Shocked, Happy, Angry).
// //     - Lighting must be high-end studio quality (Rim lighting, softbox).
// //     - Aspect Ratio: 16:9.
// //     - NO TEXT on the image (unless specifically asked).
// //   `;

// //   // ------------------------------------------------------------------
// //   // 3. GENERATION LOOP
// //   // ------------------------------------------------------------------
// //   // We use the experimental 2.0 flash model which supports image generation
// //   // If you have specific access to 2.5, change the string below.
// //   const MODEL_NAME = 'gemini-2.5-flash-image'; 

// //   for (let i = 0; i < count; i++) {
// //     try {
// //       console.log(`[AI Service] 🎨 Generating Variation ${i + 1}/${count}...`);

// //       // A. Build Multimodal Content
// //       const messageContent: any[] = [
// //         { type: 'text', text: systemInstruction },
// //         { type: 'image', image: subjectDataUrl }, // Image 1 (Subject)
// //       ];

// //       if (styleDataUrl) {
// //         messageContent.push({ type: 'image', image: styleDataUrl }); // Image 2 (Style)
// //       }

// //       // B. Call API
// //       const result = await generateText({
// //         model: google(MODEL_NAME), 
// //         messages: [
// //           {
// //             role: 'user',
// //             content: messageContent,
// //           },
// //         ],
// //         // C. Force Image Generation Mode
// //         providerOptions: {
// //           google: {
// //             // This is CRITICAL. It tells Gemini to output an Image, not text description.
// //             responseModalities: ["IMAGE"], 
// //           },
// //         },
// //       });

// //       // D. Extract Image (Robust Handling)
// //       // The SDK behavior changes frequently. We handle the two most common return types.
// //       let imageBuffer: Buffer | null = null;

// //       // METHOD 1: Check for explicit file attachments (Newer SDK versions)
// //       // @ts-ignore
// //       if (result.experimental_output?.files?.[0]) {
// //          // @ts-ignore
// //          const file = result.experimental_output.files[0];
// //          imageBuffer = Buffer.from(file.data, 'base64');
// //       }
// //       // METHOD 2: Check standard 'files' array (Standard SDK)
// //       // @ts-ignore
// //       else if (result.files && result.files.length > 0) {
// //         // @ts-ignore
// //         const file = result.files[0];
// //         // Some providers return uint8Array, some return base64 string
// //         if (file.uint8Array) {
// //              imageBuffer = Buffer.from(file.uint8Array);
// //         } else if (typeof file === 'string') {
// //              imageBuffer = Buffer.from(file, 'base64');
// //         }
// //       } 
// //       // METHOD 3: Fallback - sometimes Gemini returns base64 string in the text field
// //       else if (result.text && result.text.length > 500) {
// //         try {
// //           // Remove potential markdown wrapping
// //           const cleanBase64 = result.text.replace(/^```base64\s*/, '').replace(/\s*```$/, '').trim();
// //           imageBuffer = Buffer.from(cleanBase64, 'base64');
// //         } catch (e) {
// //           console.warn("Could not parse text as base64");
// //         }
// //       }

// //       if (imageBuffer) {
// //         generatedBuffers.push(imageBuffer);
// //         console.log(`[AI Service] ✅ Variation ${i + 1} Generated Successfully`);
// //       } else {
// //         console.warn(`[AI Service] ⚠️ Variation ${i + 1} failed: No image data found in response.`);
// //       }

// //     } catch (error: any) {
// //       console.error(`[AI Service] ❌ Error generating variation ${i + 1}:`, error.message);
// //       // Don't throw immediately, try the next iteration
// //     }
// //   }

// //   if (generatedBuffers.length === 0) {
// //     throw new Error("Failed to generate any valid images.");
// //   }

// //   return generatedBuffers;
// // };





// // import { createGoogleGenerativeAI } from '@ai-sdk/google';
// // import { generateText } from 'ai';

// // // ------------------------------------------------------
// // // 1. INIT GOOGLE GENERATIVE AI
// // // ------------------------------------------------------
// // const google = createGoogleGenerativeAI({
// //   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
// // });

// // // ------------------------------------------------------
// // // 2. TYPES
// // // ------------------------------------------------------
// // interface GenerateOptions {
// //   prompt: string;          // Scene: "A lion attacking me"
// //   title: string;           // Video title: "I LOST EVERYTHING"
// //   count?: number;          // Default = 3
// //   subjectImage?: Buffer;    // REQUIRED (identity)
// //   styleImage?: Buffer;     // Optional (lighting / vibe)
// //   mimeType?: string;
// // }

// // // ------------------------------------------------------
// // // 3. UTILS
// // // ------------------------------------------------------
// // const toDataURL = (buf: Buffer, mimeType: string) =>
// //   `data:${mimeType};base64,${buf.toString('base64')}`;

// // // Thumbnail-specific variations (IMPORTANT)
// // const VARIATION_STYLES = [
// //   "Wide-angle dramatic action, background motion blur",
// //   "Close-up emotional expression, shallow depth of field",
// //   "Low-angle cinematic shot, intense contrast lighting",
// // ];

// // // ------------------------------------------------------
// // // 4. CORE FUNCTION
// // // ------------------------------------------------------
// // export async function generateThumbnailBatch({
// //   prompt,
// //   title,
// //   count = 3,
// //   subjectImage,
// //   styleImage,
// //   mimeType = 'image/png',
// // }: GenerateOptions): Promise<Buffer[]> {

// //   const MODEL_NAME = 'gemini-2.5-flash-image';
// //   const results: Buffer[] = [];

// //   const subjectDataUrl = subjectImage ? toDataURL(subjectImage, mimeType) : null;
// //   const styleDataUrl = styleImage ? toDataURL(styleImage, mimeType) : null;

// //   // ------------------------------------------------------
// //   // 5. PROMPT LAYERS (IMPORTANT)
// //   // ------------------------------------------------------

// //   const SYSTEM_PROMPT = `
// // You are a professional YouTube thumbnail generator.
// // You strictly follow composition, realism, and subject-preservation rules.
// // You output ONLY an image.
// // `;

// //   const COMPOSITION_RULES = `
// // COMPOSITION RULES (NON-NEGOTIABLE):
// // - The subject from Image 1 MUST remain unchanged.
// // - Face must be sharp, fully visible, and unobstructed.
// // - Subject must occupy the CENTER 40–50% of the frame.
// // - Background elements must NOT overlap the face.
// // - Subject lighting must look studio-grade.
// // - Aspect ratio: 16:9.
// // `;

// //   const SAFETY_RULES = `
// // SAFETY RULES:
// // - Never distort facial features.
// // - Never merge subject with background objects.
// // - Dangerous elements stay behind or beside the subject.
// // `;

// //   const QUALITY_RULES = `
// // QUALITY:
// // - Photorealistic
// // - Cinematic lighting
// // - High contrast
// // - Sharp focus on face
// // - No blur or noise on subject
// // `;

// //   // ------------------------------------------------------
// //   // 6. GENERATION LOOP
// //   // ------------------------------------------------------
// //   for (let i = 0; i < count; i++) {
// //     try {
// //       const variationStyle = VARIATION_STYLES[i % VARIATION_STYLES.length];

// //         const SCENE_PROMPT = `
// //         VIDEO TITLE:
// //         "${title}"

// //         SCENE CONTEXT:
// //         ${prompt}

// //         VARIATION STYLE:
// //         ${variationStyle}

// //         STYLE:
// //         Ultra-realistic cinematic YouTube thumbnail
// //         `;

// //               const FINAL_PROMPT = `
// //                 ${SYSTEM_PROMPT}
// //                 ${COMPOSITION_RULES}
// //                 ${SAFETY_RULES}
// //                 ${QUALITY_RULES}
// //                 ${SCENE_PROMPT}
// //                 `;

// //       const content: any[] = [
// //         { type: 'text', text: FINAL_PROMPT },
// //         { type: 'image', image: subjectDataUrl }, // Image 1: SUBJECT
// //       ];

// //       if (styleDataUrl) {
// //         content.push({ type: 'image', image: styleDataUrl }); // Image 2: STYLE
// //       }

// //       const result = await generateText({
// //         model: google(MODEL_NAME),
// //         messages: [{ role: 'user', content }],
// //         providerOptions: {
// //           google: {
// //             responseModalities: ['IMAGE'], // FORCE IMAGE OUTPUT
// //           },
// //         },
// //       });

// //       // ------------------------------------------------------
// //       // 7. ROBUST IMAGE EXTRACTION
// //       // ------------------------------------------------------
// //       let imageBuffer: Buffer | null = null;

// //       // Newer SDKs
// //       // @ts-ignore
// //       if (result.experimental_output?.files?.[0]) {
// //         // @ts-ignore
// //         imageBuffer = Buffer.from(result.experimental_output.files[0].data, 'base64');
// //       }
// //       // Standard SDK
// //       // @ts-ignore

// //     // 1️⃣ Preferred: Typed Uint8Array (SAFE)
// //     if (result.files?.[0]?.uint8Array) {
// //       imageBuffer = Buffer.from(result.files[0].uint8Array);
// //     }

// //   // 2️⃣ Experimental output (runtime-only, cast explicitly)
// //   else if (
// //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
// //     (result as any).experimental_output?.files?.[0]?.data
// //   ) {
// //     const base64 = (result as any).experimental_output.files[0].data;
// //     imageBuffer = Buffer.from(base64, 'base64');
// //   }

// //     // 3️⃣ Final fallback (rare)
// //     else if (typeof result.text === 'string' && result.text.length > 500) {
// //       const clean = result.text
// //         .replace(/^```base64/, '')
// //         .replace(/```$/, '')
// //         .trim();
// //       imageBuffer = Buffer.from(clean, 'base64');
// //     }


// //       // Fallback
// //       else if (result.text && result.text.length > 500) {
// //         const clean = result.text
// //           .replace(/^```base64/, '')
// //           .replace(/```$/, '')
// //           .trim();
// //         imageBuffer = Buffer.from(clean, 'base64');
// //       }

// //       if (!imageBuffer) {
// //         throw new Error('No image data returned');
// //       }

// //       results.push(imageBuffer);
// //       console.log(`✅ Thumbnail ${i + 1} generated`);

// //     } catch (err: any) {
// //       console.error(`❌ Generation failed for variation ${i + 1}`, err.message);
// //     }
// //   }

// //   if (!results.length) {
// //     throw new Error('All thumbnail generations failed');
// //   }

// //   return results;
// // }


// // import { createGoogleGenerativeAI } from '@ai-sdk/google';
// // import { generateText } from 'ai';

// // const google = createGoogleGenerativeAI({
// //   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
// // });

// // interface GenerateOptions {
// //   prompt: string;         // e.g. "Winning a trophy"
// //   title: string;          // e.g. "I WON $1,000,000"
// //   count?: number;
// //   subjectImage?: Buffer;   // Your Face
// //   styleImage?: Buffer;    // The Reference Vibe
// //   mimeType?: string;      
// // }

// // export const generateThumbnailBatch = async ({
// //   prompt,
// //   title,
// //   count = 3,
// //   subjectImage,
// //   styleImage,
// //   mimeType = 'image/png',
// // }: GenerateOptions): Promise<Buffer[]> => {

// //   const generatedBuffers: Buffer[] = [];
  
// //   // Use the Experimental Flash model for best image synthesis
// //   // Ensure this model is enabled in your Google AI Studio
// //   const MODEL_NAME = 'models/gemini-2.5-flash-image'; 

// //   console.log(`[AI Service] 🚀 Generating ${count} Distinct Variations for: "${title}"`);

// //   // 1. DATA PREPARATION
// //   const toDataURL = (buf: Buffer) => `data:${mimeType};base64,${buf.toString('base64')}`;
// //   const subjectDataUrl =  subjectImage ? toDataURL(subjectImage) : null;
// //   const styleDataUrl = styleImage ? toDataURL(styleImage) : null;

// //   // -------------------------------------------------------------------------
// //   // 2. DEFINE DISTINCT DIRECTORIAL STYLES (The "Anti-Same" Logic)
// //   // -------------------------------------------------------------------------
// //   const variations = [
// //     {
// //       type: "DIRECT_ACTION",
// //       instruction: `
// //         STYLE: "Commercial & Clean". 
// //         - Lighting: Bright, Even, High-Key (Like a TV Commercial).
// //         - Focus: Balance the Subject and the Object equally.
// //         - Colors: Vivid and True-to-life. 
// //         - Vibe: Professional, Trustworthy, Clear.
// //       `
// //     },
// //     {
// //       type: "DRAMATIC_EMOTION",
// //       instruction: `
// //         STYLE: "Movie Poster / High Drama".
// //         - Lighting: "Rembrandt" or "Split" lighting. High contrast shadows.
// //         - Focus: Prioritize the FACIAL EXPRESSION. The context is secondary/blurred.
// //         - Colors: Saturated, Moody (Teal/Orange or Red/Blue depending on prompt).
// //         - Vibe: Intense, Shocking, Viral.
// //       `
// //     },
// //     {
// //       type: "STORY_DEPTH",
// //       instruction: `
// //         STYLE: "Wide Environmental / Storytelling".
// //         - Lighting: Volumetric (God rays, atmospheric).
// //         - Focus: Emphasize the SCALE of the background/context object. Make the subject feel embedded in the scene.
// //         - Lens: Ultra-Wide (16mm).
// //         - Vibe: Epic, Grand, Detailed.
// //       `
// //     }
// //   ];

// //   // -------------------------------------------------------------------------
// //   // 3. GENERATION LOOP
// //   // -------------------------------------------------------------------------
// //   for (let i = 0; i < count; i++) {
// //     try {
// //       // Cycle through the variation styles (Modulus operator ensures we loop safely)
// //       const currentStyle = variations[i % variations.length];
      
// //       console.log(`[AI Service] 🎨 Variation ${i + 1}: Applying style "${currentStyle.type}"`);

// //       // 4. THE MASTER PROMPT (Combines Layout Safety + Dynamic Style)
// //       const systemInstruction = `
// //         ROLE: You are an Elite YouTube Thumbnail Artist.
        
// //         TASK: Create a 16:9 Image based on the inputs.
        
// //         === INPUTS ===
// //         1. MAIN CHARACTER (Image 1): Preserve Identity EXACTLY.
// //         2. CONTEXT (Prompt): "${prompt}"
// //         3. EMOTION (Title): "${title}"
        
// //         === CURRENT DIRECTORIAL STYLE (STRICT) ===
// //         ${currentStyle.instruction}
// //         *IMPORTANT: Adjust the intensity of the scene based on the User's Prompt. If the prompt is "Happy", make it vibrant. If "Scary", make it dark.*

// //         === LAYOUT & SAFETY RULES (ALWAYS ACTIVE) ===
// //         1. THE CONTAINER BOX: Imagine a "Safe Zone" with 15% padding on all sides. 
// //            - The Subject's HEAD and HANDS must be INSIDE this box.
// //            - DO NOT cut off the subject at the edge of the frame.
// //            - ZOOM OUT if necessary to fit the subject.
        
// //         2. COMPOSITION:
// //            - Subject must be in the Foreground.
// //            - Context Object must be clearly visible in the Midground/Background.
// //            - Do not let them overlap messily. Use Depth of Field to separate them.
        
// //         3. NO HALLUCINATIONS:
// //            - Do NOT add text.
// //            - Do NOT add random objects not mentioned in the prompt.

// //         OUTPUT: A photorealistic, 8k image.
// //       `;

// //       // Build Message Content
// //       const messageContent: any[] = [
// //         { type: 'text', text: systemInstruction },
// //         { type: 'image', image: subjectDataUrl }, // Priority 1: Subject
// //       ];

// //       if (styleDataUrl) {
// //         messageContent.push({ type: 'image', image: styleDataUrl }); // Priority 2: Style
// //       }

// //       // Call API
// //       const result = await generateText({
// //         model: google(MODEL_NAME), 
// //         messages: [
// //           {
// //             role: 'user',
// //             content: messageContent,
// //           },
// //         ],
// //         providerOptions: {
// //           google: {
// //             responseModalities: ["IMAGE"], 
// //             generationConfig: {
// //                 aspectRatio: "16:9",
// //                 sampleCount: 1, 
// //             },
// //             // Relax safety slightly to allow for "Dramatic/Shocked" faces
// //             safetySettings: [
// //                 { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
// //                 { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
// //                 { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
// //                 { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" }
// //             ]
// //           },
// //         },
// //       });

// //       // 5. ROBUST IMAGE EXTRACTION
// //       let imageBuffer: Buffer | null = null;

// //       // Handle Gemini 2.0 Experimental Output Formats
// //       // @ts-ignore
// //       if (result.experimental_output?.files?.[0]) {
// //          // @ts-ignore
// //          const file = result.experimental_output.files[0];
// //          imageBuffer = Buffer.from(file.data, 'base64');
// //       }
// //       // Handle Standard Output
// //       // @ts-ignore
// //       else if (result.files && result.files.length > 0) {
// //         // @ts-ignore
// //         const file = result.files[0];
// //         if (file.uint8Array) imageBuffer = Buffer.from(file.uint8Array);
// //         else if (typeof file === 'string') imageBuffer = Buffer.from(file, 'base64');
// //       } 
// //       // Handle Text-Embedded Base64 (Fallback)
// //       else if (result.text && result.text.length > 500) {
// //          try {
// //            const cleanBase64 = result.text.replace(/^```base64\s*/, '').replace(/\s*```$/, '').replace(/\n/g, '').trim();
// //            imageBuffer = Buffer.from(cleanBase64, 'base64');
// //          } catch (e) { console.warn("Failed to parse base64 text"); }
// //       }

// //       if (imageBuffer) {
// //         generatedBuffers.push(imageBuffer);
// //         console.log(`[AI Service] ✅ Variation ${i + 1} Success (${currentStyle.type})`);
// //       } else {
// //         console.warn(`[AI Service] ⚠️ Variation ${i + 1} Failed: No image returned.`);
// //       }

// //     } catch (error: any) {
// //       console.error(`[AI Service] ❌ Variation ${i + 1} Error:`, error.message);
      
// //       if (error.message.includes('404')) {
// //          console.error("Make sure 'gemini-2.0-flash-exp' is enabled in your Google AI Studio project.");
// //          break;
// //       }
// //     }
// //   }

// //   if (generatedBuffers.length === 0) {
// //     throw new Error("No images were generated. Check API logs.");
// //   }

// //   return generatedBuffers;
// // };


// // import { createGoogleGenerativeAI } from '@ai-sdk/google';
// // import { generateText } from 'ai';

// // const google = createGoogleGenerativeAI({
// //   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
// // });

// // interface GenerateOptions {
// //   prompt: string;         // e.g., "Attacked by a lion"
// //   title: string;          // e.g., "I ALMOST DIED!"
// //   count?: number;
// //   subjectImage?: Buffer;   // The User's Face
// //   styleImage?: Buffer;    // Optional Style Reference
// //   mimeType?: string;      
// // }

// // export const generateThumbnailBatch = async ({
// //   prompt,
// //   title,
// //   count = 3,
// //   subjectImage,
// //   styleImage,
// //   mimeType = 'image/png',
// // }: GenerateOptions): Promise<Buffer[]> => {

// //   const generatedBuffers: Buffer[] = [];
  
// //   // ⚡ CRITICAL: Using the Experimental Vision Model (Best for Image Gen)
// //   // Make sure this is enabled in your Google AI Studio
// //   const MODEL_NAME = 'models/gemini-2.5-flash-image'; 

// //   console.log(`[AI Service] 🎭 Generating ${count} Emotionally Accurate Thumbnails for: "${title}"`);

// //   // 1. PREPARE IMAGE DATA
// //   const toDataURL = (buf: Buffer) => `data:${mimeType};base64,${buf.toString('base64')}`;
// //   const subjectDataUrl = subjectImage ? toDataURL(subjectImage) : null;
// //   const styleDataUrl = styleImage ? toDataURL(styleImage) : null;

// //   // 2. DEFINE THE 3 "YOUTUBE ANGLES" (For Variety)
// //   const angleVariations = [
// //     {
// //       name: "THE REACTION SHOT",
// //       lens: "Close-up (35mm)",
// //       focus: "Focus intensity on the FACE and EMOTION. Background is blurred (Bokeh)."
// //     },
// //     {
// //       name: "THE ACTION SHOT",
// //       lens: "Medium Shot (50mm)",
// //       focus: "Show the Subject interacting with the Danger/Object. Waist-up framing."
// //     },
// //     {
// //       name: "THE EPIC WIDE",
// //       lens: "Wide Angle (24mm)",
// //       focus: "Show the entire environment (The Lion, The Plane). Subject is smaller but fully visible."
// //     }
// //   ];

// //   // 3. GENERATION LOOP
// //   for (let i = 0; i < count; i++) {
// //     try {
// //       const currentAngle = angleVariations[i % angleVariations.length];
      
// //       console.log(`[AI Service] 📸 Generating: ${currentAngle.name}...`);

// //       // 4. THE "EMOTIONAL INTELLIGENCE" PROMPT
// //       const systemInstruction = `
// //         ROLE: You are the World's Best YouTube Thumbnail Designer.
        
// //         TASK: Create a High-CTR (Click-Through-Rate) 16:9 Thumbnail.

// //         === 1. INPUT ANALYSIS ===
// //         - SCENARIO: "${prompt}"
// //         - TITLE: "${title}"
// //         - REFERENCE IDENTITY: Image 1 (Preserve this person exactly).
        
// //         === 2. EMOTIONAL LOGIC (CRITICAL) ===
// //         *Analyze the SCENARIO and apply the correct emotion:*
// //         - IF SCENARIO involves Danger (Lions, Fire, Crash) -> Emotion is TERROR, SCREAMING, CRYING, SWEATING.
// //         - IF SCENARIO involves Fun (Plane, Money, Games) -> Emotion is ECSTATIC, LAUGHING, CHEERING.
// //         - IF SCENARIO involves Mystery (Ghost, Secret) -> Emotion is SHOCKED, SUSPICIOUS, HAND OVER MOUTH.
// //         *DO NOT default to a generic face. MATCH THE PROMPT.*

// //         === 3. SPATIAL LAYOUT (THE "PERFECT FIT" RULE) ===
// //         - PADDING: You MUST leave 20% empty space around the subject's head and hands.
// //         - NO CUT-OFFS: The chin, forehead, and hands must be FULLY INSIDE the frame.
// //         - POSITION: Place the Subject in the Foreground. Place the Context (e.g. Lion/Plane) in the Background.
// //         - ZOOM: Zoom out slightly to ensure safety. It is better to have too much space than to cut the head.

// //         === 4. VISUAL STYLE ===
// //         - Angle: ${currentAngle.lens}
// //         - Focus: ${currentAngle.focus}
// //         - Lighting: High Saturation, High Contrast, Studio "Rim Lighting" to separate subject from background.
// //         - Quality: 8k, Hyper-realistic.

// //         OUTPUT: A single 16:9 Image.
// //       `;

// //       // Build Message Content
// //       const messageContent: any[] = [
// //         { type: 'text', text: systemInstruction },
// //         { type: 'image', image: subjectDataUrl }, // Priority 1: Identity
// //       ];

// //       if (styleDataUrl) {
// //         messageContent.push({ type: 'image', image: styleDataUrl }); // Priority 2: Style
// //       }

// //       // 5. CALL API
// //       const result = await generateText({
// //         model: google(MODEL_NAME), 
// //         messages: [
// //           {
// //             role: 'user',
// //             content: messageContent,
// //           },
// //         ],
// //         providerOptions: {
// //           google: {
// //             responseModalities: ["IMAGE"], 
// //             generationConfig: {
// //                 aspectRatio: "16:9", // STRICT YOUTUBE DIMENSION
// //                 sampleCount: 1, 
// //             },
// //             // Lower safety settings slightly to allow for "Terror/Danger" expressions
// //             safetySettings: [
// //                 { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
// //                 { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
// //                 { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
// //                 { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" }
// //             ]
// //           },
// //         },
// //       });

// //       // 6. ROBUST EXTRACTION
// //       let imageBuffer: Buffer | null = null;

// //       // Handle Gemini Experimental Output
// //       // @ts-ignore
// //       if (result.experimental_output?.files?.[0]) {
// //          // @ts-ignore
// //          const file = result.experimental_output.files[0];
// //          imageBuffer = Buffer.from(file.data, 'base64');
// //       }
// //       // Handle Standard Output
// //       // @ts-ignore
// //       else if (result.files && result.files.length > 0) {
// //         // @ts-ignore
// //         const file = result.files[0];
// //         if (file.uint8Array) imageBuffer = Buffer.from(file.uint8Array);
// //         else if (typeof file === 'string') imageBuffer = Buffer.from(file, 'base64');
// //       } 
// //       // Text Fallback
// //       else if (result.text && result.text.length > 500) {
// //          try {
// //            const cleanBase64 = result.text.replace(/^```base64\s*/, '').replace(/\s*```$/, '').replace(/\n/g, '').trim();
// //            imageBuffer = Buffer.from(cleanBase64, 'base64');
// //          } catch (e) { console.warn("Failed to parse base64 text"); }
// //       }

// //       if (imageBuffer) {
// //         generatedBuffers.push(imageBuffer);
// //         console.log(`[AI Service] ✅ Variation ${i + 1} Success`);
// //       } else {
// //         console.warn(`[AI Service] ⚠️ Variation ${i + 1} Returned Empty`);
// //       }

// //     } catch (error: any) {
// //       console.error(`[AI Service] ❌ Variation ${i + 1} Error:`, error.message);
// //       // Fail gracefully for individual variations
// //     }
// //   }

// //   if (generatedBuffers.length === 0) {
// //     throw new Error("Generation Failed. Check logs.");
// //   }

// //   return generatedBuffers;
// // };


// // import { createGoogleGenerativeAI } from '@ai-sdk/google';
// // import { generateText } from 'ai';

// // const google = createGoogleGenerativeAI({
// //   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
// // });

// // interface GenerateOptions {
// //   prompt: string;         // e.g., "Shark attacking the boat"
// //   title: string;          // e.g., "I SWAM WITH SHARKS"
// //   count?: number;
// //   subjectImage?: Buffer;   // The User's Face
// //   styleImage?: Buffer;    // Optional Style Reference
// //   mimeType?: string;      
// // }

// // export const generateThumbnailBatch = async ({
// //   prompt,
// //   title,
// //   count = 3,
// //   subjectImage,
// //   styleImage,
// //   mimeType = 'image/png',
// // }: GenerateOptions): Promise<Buffer[]> => {

// //   const generatedBuffers: Buffer[] = [];
  
// //   // ⚡ USING GEMINI 2.0 FLASH EXPERIMENTAL (Best for Vision & Layout)
// //   const MODEL_NAME = 'models/gemini-2.5-flash-image'; 

// //   console.log(`[AI Service] 📐 Generating 16:9 YouTube Standard Thumbnails for: "${title}"`);

// //   // 1. PREPARE IMAGE DATA
// //   const toDataURL = (buf: Buffer) => `data:${mimeType};base64,${buf.toString('base64')}`;
// //   const subjectDataUrl = subjectImage ? toDataURL(subjectImage) : null;
// //   const styleDataUrl = styleImage ? toDataURL(styleImage) : null;

// //   // 2. DEFINE 3 DISTINCT YOUTUBE LAYOUTS (To fill the 16:9 space)
// //   const layouts = [
// //     {
// //       type: "SPLIT_SCREEN",
// //       desc: "Subject on the RIGHT (Close up). Action/Context on the LEFT (Wide). Use the full width of the image."
// //     },
// //     {
// //       type: "CENTER_EXPLOSION",
// //       desc: "Subject in CENTER. Background action radiating outwards to the edges. Wide panoramic view."
// //     },
// //     {
// //       type: "SIDE_PROFILE",
// //       desc: "Subject looking from LEFT to RIGHT at the object. Classic YouTube 'Reaction' composition."
// //     }
// //   ];

// //   // 3. GENERATION LOOP
// //   for (let i = 0; i < count; i++) {
// //     try {
// //       // Pick a layout strategy
// //       const currentLayout = layouts[i % layouts.length];

// //       console.log(`[AI Service] 📺 Generating Variation ${i + 1}: ${currentLayout.type}...`);

// //       // 4. THE "YOUTUBE STANDARD" PROMPT
// //       const systemInstruction = `
// //         ROLE: You are a Professional YouTube Thumbnail Designer.
        
// //         TASK: Generate a High-CTR Thumbnail.

// //         === 1. TECHNICAL SPECS (NON-NEGOTIABLE) ===
// //         - ASPECT RATIO: 16:9 (Landscape).
// //         - RESOLUTION: 1920x1080 equivalent.
// //         - FRAMING: "Full Bleed" (The image must touch all 4 corners).
// //         - NO BARS: Do not generate black bars or white borders.
// //         - ORIENTATION: Horizontal / Landscape ONLY.

// //         === 2. INPUT DATA ===
// //         - SCENARIO: "${prompt}"
// //         - TITLE: "${title}"
// //         - SUBJECT IDENTITY: Image 1 (Preserve exact facial features).

// //         === 3. EMOTIONAL MATCHING ===
// //         *Logic Check:*
// //         - IF prompt implies DANGER (Attack, Fall, Fire) -> Face must show FEAR, SCREAMING, SWEAT.
// //         - IF prompt implies SUCCESS (Money, Plane, Win) -> Face must show JOY, LAUGHING, EXCITEMENT.
// //         - IF prompt implies MYSTERY (Ghost, Secret) -> Face must show SHOCK, SUSPENSE.
// //         *Current Goal: Match the facial expression to "${prompt}"*

// //         === 4. COMPOSITION RULE: "${currentLayout.type}" ===
// //         - ${currentLayout.desc}
// //         - PADDING: Keep the Subject's head and hands fully inside the frame (10% Safety Margin from edges).
// //         - ZOOM: Use a Wide Angle (24mm) to capture the background context without cutting off the subject.

// //         OUTPUT: A photorealistic, 16:9 Image.
// //       `;

// //       // Build Message Content
// //       const messageContent: any[] = [
// //         { type: 'text', text: systemInstruction },
// //         { type: 'image', image: subjectDataUrl }, // Priority 1: Subject
// //       ];

// //       if (styleDataUrl) {
// //         messageContent.push({ type: 'image', image: styleDataUrl }); // Priority 2: Style
// //       }

// //       // 5. CALL API WITH STRICT 16:9 CONFIG
// //       const result = await generateText({
// //         model: google(MODEL_NAME), 
// //         messages: [
// //           {
// //             role: 'user',
// //             content: messageContent,
// //           },
// //         ],
// //         providerOptions: {
// //           google: {
// //             responseModalities: ["IMAGE"], 
// //             // 🚨 THIS IS THE CRITICAL FIX FOR DIMENSIONS 🚨
// //             imageConfig: {
// //             aspectRatio: "16:9",
// //           },
// //             // Safety settings adjusted for dramatic thumbnails
// //             safetySettings: [
// //                 { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
// //                 { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
// //                 { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
// //                 { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" }
// //             ]
// //           },
// //         },
// //       });

// //       // 6. ROBUST EXTRACTION
// //       let imageBuffer: Buffer | null = null;

// //       // Handle Gemini Experimental Output
// //       // @ts-ignore
// //       if (result.experimental_output?.files?.[0]) {
// //          // @ts-ignore
// //          const file = result.experimental_output.files[0];
// //          imageBuffer = Buffer.from(file.data, 'base64');
// //       }
// //       // Handle Standard Output
// //       // @ts-ignore
// //       else if (result.files && result.files.length > 0) {
// //         // @ts-ignore
// //         const file = result.files[0];
// //         if (file.uint8Array) imageBuffer = Buffer.from(file.uint8Array);
// //         else if (typeof file === 'string') imageBuffer = Buffer.from(file, 'base64');
// //       } 
// //       // Text Fallback
// //       else if (result.text && result.text.length > 500) {
// //          try {
// //            const cleanBase64 = result.text.replace(/^```base64\s*/, '').replace(/\s*```$/, '').replace(/\n/g, '').trim();
// //            imageBuffer = Buffer.from(cleanBase64, 'base64');
// //          } catch (e) { console.warn("Failed to parse base64 text"); }
// //       }

// //       if (imageBuffer) {
// //         generatedBuffers.push(imageBuffer);
// //         console.log(`[AI Service] ✅ Variation ${i + 1} Success (16:9)`);
// //       } else {
// //         console.warn(`[AI Service] ⚠️ Variation ${i + 1} Returned Empty`);
// //       }

// //     } catch (error: any) {
// //       console.error(`[AI Service] ❌ Variation ${i + 1} Error:`, error.message);
// //       // Fail gracefully for individual variations
// //     }
// //   }

// //   if (generatedBuffers.length === 0) {
// //     throw new Error("Generation Failed. Check API Credits or Model Availability.");
// //   }

// //   return generatedBuffers;
// // };


// // import { createGoogleGenerativeAI } from '@ai-sdk/google';
// // import { generateText } from 'ai';

// // const google = createGoogleGenerativeAI({
// //   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
// // });

// // interface GenerateOptions {
// //   prompt: string;         // e.g. "Shark attacking me"
// //   title: string;          // e.g. "I SURVIVED"
// //   count?: number;
// //   subjectImage?: Buffer;
// //   styleImage?: Buffer;
// //   mimeType?: string;
// // }

// // // ------------------------------------------------------------------
// // // 1. THE EMOTION ENGINE (Pre-processing Logic)
// // // ------------------------------------------------------------------
// // // Instead of hoping the AI guesses right, we force the mood based on keywords.
// // function detectMood(text: string): string {
// //   const lower = text.toLowerCase();
  
// //   if (lower.match(/(attack|lion|shark|fire|dead|ghost|scary|fear|danger|run|cry|sad|lost|fail|crash)/)) {
// //     return "EXTREME FEAR. Eyes wide open, mouth screaming, sweating, looking terrified. Dark, moody, high contrast lighting.";
// //   }
// //   if (lower.match(/(won|money|rich|plane|bike|car|happy|fun|party|celebrate|success|gold|trophy|smile)/)) {
// //     return "EXTREME JOY. Laughing, cheering, ecstatic, fists in the air. Bright, vibrant, sunny high-key lighting.";
// //   }
// //   if (lower.match(/(secret|what|mystery|box|hidden|shock|omg|wait|stop|police)/)) {
// //     return "SHOCK & SUSPENSE. Mouth covered by hands, eyebrows raised, gasping. Dramatic, mysterious spotlighting.";
// //   }
// //   if (lower.match(/(angry|fight|hate|mad|rage|punch|destroy)/)) {
// //     return "RAGE & AGGRESSION. Gritting teeth, shouting, furrowed brows. Red intense lighting.";
// //   }
  
// //   // Default fallback
// //   return "INTENSE EXCITEMENT. High energy, engaging eye contact with camera.";
// // }

// // // ------------------------------------------------------------------
// // // 2. THE GENERATION FUNCTION
// // // ------------------------------------------------------------------
// // export const generateThumbnailBatch = async ({
// //   prompt,
// //   title,
// //   count = 3,
// //   subjectImage,
// //   styleImage,
// //   mimeType = 'image/png',
// // }: GenerateOptions): Promise<Buffer[]> => {

// //   const generatedBuffers: Buffer[] = [];
// //   const MODEL_NAME = 'models/gemini-2.5-flash-image';

// //   // CALCULATE MOOD BEFORE GENERATION
// //   const forcedMood = detectMood(prompt + " " + title);
  
// //   console.log(`[AI Service] 🎯 Target Mood: ${forcedMood}`);
// //   console.log(`[AI Service] 📐 Enforcing 16:9 Cinematic Ratio`);

// //   const toDataURL = (buf: Buffer) => `data:${mimeType};base64,${buf.toString('base64')}`;
// //   const subjectDataUrl = subjectImage?  toDataURL(subjectImage) : null;
// //   const styleDataUrl = styleImage ? toDataURL(styleImage) : null;

// //   // ------------------------------------------------------------------
// //   // 3. THE "PERFECT FIT" PROMPT
// //   // ------------------------------------------------------------------
// //   // We use "Negative Prompting" logic inside the instruction to prevent bad cropping.
// //   const systemInstruction = `
// //     ROLE: You are a Cinematic Director for YouTube Thumbnails.
    
// //     TASK: Generate a Wide-Angle 16:9 Image (1920x1080).
    
// //     === INPUTS ===
// //     1. SUBJECT (Image 1): Preserve facial identity EXACTLY.
// //     2. SCENARIO: "${prompt}"
// //     3. FORCED EMOTION: "${forcedMood}" (You MUST apply this expression to the subject).

// //     === COMPOSITION RULES (STRICT 16:9) ===
// //     - CAMERA LENS: Use a 16mm or 24mm Wide Angle Lens. This is CRITICAL to show the environment.
// //     - FRAMING: The image MUST be Wide (Landscape).
// //     - PADDING: Do NOT fill the frame with just the face. Show the Subject + The Environment.
// //     - NO CROPPING: Leave empty space above the head ("Headroom"). Keep hands inside the frame.

// //     === ENVIRONMENT LOGIC ===
// //     - If the user mentions a "Bike" or "Car", SHOW THE FULL VEHICLE next to the person.
// //     - If the user mentions a "Lion" or "Shark", SHOW THE ATTACKER huge in the background.
// //     - The Subject should be reacting to this environment.

// //     OUTPUT FORMAT:
// //     - Aspect Ratio: 16:9
// //     - RESOLUTION: 1920x1080 equivalent.
// //     - Style: Photorealistic, 8k, Unreal Engine 5 Render style.
// //   `;

// //   for (let i = 0; i < count; i++) {
// //     try {
// //       console.log(`[AI Service] 📸 Generating Variation ${i + 1}/${count}...`);

// //       const messageContent: any[] = [
// //         { type: 'text', text: systemInstruction },
// //         { type: 'image', image: subjectDataUrl },
// //       ];
// //       if (styleDataUrl) messageContent.push({ type: 'image', image: styleDataUrl });

// //       const result = await generateText({
// //         model: google(MODEL_NAME), 
// //         messages: [{ role: 'user', content: messageContent }],
// //         providerOptions: {
// //           google: {
// //             responseModalities: ["IMAGE"], 
// //             // 🚨 FORCE 16:9 DIMENSIONS 🚨
// //              imageConfig: {
// //             aspectRatio: "16:9",
// //               },
// //             safetySettings: [
// //                 { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
// //                 { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
// //                 { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
// //                 { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" }
// //             ]
// //           },
// //         },
// //       });

// //       // EXTRACT IMAGE
// //       let imageBuffer: Buffer | null = null;
// //       // @ts-ignore
// //       if (result.experimental_output?.files?.[0]) {
// //          // @ts-ignore
// //          const file = result.experimental_output.files[0];
// //          imageBuffer = Buffer.from(file.data, 'base64');
// //       } else if (result.text && result.text.length > 500) {
// //          try {
// //            const cleanBase64 = result.text.replace(/^```base64\s*/, '').replace(/\s*```$/, '').replace(/\n/g, '').trim();
// //            imageBuffer = Buffer.from(cleanBase64, 'base64');
// //          } catch (e) { console.warn("Failed to parse base64 text"); }
// //       }

// //       if (imageBuffer) {
// //         generatedBuffers.push(imageBuffer);
// //         console.log(`[AI Service] ✅ Variation ${i + 1} Success`);
// //       }

// //     } catch (error: any) {
// //       console.error(`[AI Service] ❌ Variation ${i + 1} Error:`, error.message);
// //     }
// //   }

// //   if (generatedBuffers.length === 0) throw new Error("Generation Failed.");
// //   return generatedBuffers;
// // };





// // import { createGoogleGenerativeAI } from '@ai-sdk/google';
// // import { generateText } from 'ai';

// // // Initialize Google AI
// // const google = createGoogleGenerativeAI({
// //   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
// // });

// // interface GenerateOptions {
// //   prompt: string;         // e.g., "Shark attacking me"
// //   title: string;          // e.g., "I SURVIVED"
// //   count?: number;
// //   subjectImage?: Buffer;   // The User's Face (Critical)
// //   styleImage?: Buffer;    // Optional Vibe Reference
// //   mimeType?: string;      
// //   isEdit?: boolean;
// // }

// // // ------------------------------------------------------------------
// // // 1. HELPER: EMOTION DETECTOR (The "Brain")
// // // ------------------------------------------------------------------
// // function detectMood(text: string): string {
// //   const lower = text.toLowerCase();
// //   if (lower.match(/(attack|lion|shark|fire|dead|ghost|scary|fear|danger|run|cry|sad|lost|fail|crash)/)) {
// //     return "EXTREME FEAR. Eyes wide open, mouth screaming, sweating, looking terrified. Dark, moody, high contrast lighting.";
// //   }
// //   if (lower.match(/(won|money|rich|plane|bike|car|happy|fun|party|celebrate|success|gold|trophy|smile)/)) {
// //     return "EXTREME JOY. Laughing, cheering, ecstatic, fists in the air. Bright, vibrant, sunny high-key lighting.";
// //   }
// //   if (lower.match(/(secret|what|mystery|box|hidden|shock|omg|wait|stop|police)/)) {
// //     return "SHOCK & SUSPENSE. Mouth covered by hands, eyebrows raised, gasping. Dramatic, mysterious spotlighting.";
// //   }
// //   return "INTENSE EXCITEMENT. High energy, engaging eye contact with camera, YouTube 'Clickbait' Face.";
// // }

// // // ------------------------------------------------------------------
// // // 2. HELPER: IMAGE PREPARATION
// // // ------------------------------------------------------------------
// // const toDataURL = (buf: Buffer, mime: string) => `data:${mime};base64,${buf.toString('base64')}`;

// // // ------------------------------------------------------------------
// // // 3. MAIN GENERATION FUNCTION
// // // ------------------------------------------------------------------
// // export const generateThumbnailBatch = async ({
// //   prompt,
// //   title,
// //   count = 3,
// //   subjectImage,
// //   styleImage,
// //   mimeType = 'image/png',
// //   isEdit = false
// // }: GenerateOptions): Promise<Buffer[]> => {

// //   const generatedBuffers: Buffer[] = [];
// //   const forcedMood = detectMood(prompt + " " + title);

// //   console.log(`[AI Service] 🧠 Mood Detected: "${forcedMood}"`);
// //   console.log(`[AI Service] 📐 Preparing ${count} YouTube Standard Thumbnails...`);

// //   // Prepare Images
// //   const subjectDataUrl = subjectImage ? toDataURL(subjectImage, mimeType) : null;
// //   const styleDataUrl = styleImage ? toDataURL(styleImage, mimeType) : null;

// //   // Define Layout Strategies (To prevent duplicates)
// //   const layouts = [
// //     { type: "SPLIT_SCREEN", desc: "Subject on RIGHT (Close up). Context on LEFT (Wide). Distinct separation." },
// //     { type: "CENTER_EXPLOSION", desc: "Subject in CENTER. Background action radiating outwards. Wide panoramic view." },
// //     { type: "SIDE_PROFILE", desc: "Subject looking from LEFT to RIGHT at the object. Classic YouTube 'Reaction' composition." }
// //   ];

// //   // ------------------------------------------------------------------
// //   // 4. GENERATION LOOP
// //   // ------------------------------------------------------------------
// //   for (let i = 0; i < count; i++) {
// //     try {
// //       // Rotate through layouts
// //       const currentLayout = layouts[i % layouts.length];
// //       console.log(`[AI Service] 🎨 Variation ${i + 1}: ${currentLayout.type}...`);

// //       // ------------------------------------------------------------------
// //       // 5. THE "PERFECT" PROMPT (Strictly Optimized for YouTube)
// //       // ------------------------------------------------------------------
// //       const designRules = `
// //         ROLE: You are an Elite YouTube Thumbnail Designer (Top 1% CTR).
// //         TASK: Create a Photorealistic 16:9 Thumbnail.

// //         === 1. TECHNICAL SPECS (STRICT) ===
// //         - ASPECT RATIO: 16:9 (Landscape, 1920x1080).
// //         - FRAMING: "Full Bleed" (Image must touch all 4 corners).
// //         - LENS: Wide Angle (24mm). This is CRITICAL to show the environment.
// //         - SAFETY MARGIN: Leave 15% empty space around the Subject's head. DO NOT CUT OFF THE HEAD.

// //         === 2. EMOTION & CONTENT ===
// //         - SCENARIO: "${prompt}"
// //         - TITLE VIBE: "${title}"
// //         - FORCED EMOTION: "${forcedMood}" (Apply this expression to the Subject).
// //         - ENVIRONMENT: If the prompt mentions an object (Car, Lion, Money), it must be HUGE in the background.

// //         === 3. COMPOSITION RULE: "${currentLayout.type}" ===
// //         - ${currentLayout.desc}
// //         - Subject must be in the Foreground.
// //         - Lighting must be "Rim Lighting" (Halo effect) to separate subject from background.

// //         === 4. INPUT HANDLING ===
// //         - IMAGE 1 (Provided): This is the MAIN SUBJECT. Preserve their facial identity exactly.
// //         ${styleImage ? '- IMAGE 2 (Provided): Use this for Color Grading/Vibe.' : ''}

// //         OUTPUT: A single high-quality image.
// //       `;

// //       // Build Multimodal Content
// //       const userContent: Array<{ type: 'text'; text: string } | { type: 'image'; image: string }> = [
// //         { type: 'text', text: designRules },
// //         { type: 'image', image: subjectDataUrl! } // Priority 1: Face
// //       ];

// //       if (styleDataUrl) {
// //         userContent.push({ type: 'image', image: styleDataUrl }); // Priority 2: Style
// //       }

// //       // ------------------------------------------------------------------
// //       // 6. CALL API (Using your verified configuration)
// //       // ------------------------------------------------------------------
// //       const result = await generateText({
// //         // Keep your working model string.
// //         model: google('gemini-2.5-flash-image'), 
// //         messages: [
// //           {
// //             role: 'user',
// //             content: userContent,
// //           },
// //         ],
// //         providerOptions: {
// //           google: {
// //             responseModalities: ["IMAGE"], // Force Image
// //             // 🚨 STRICT DIMENSION CONFIG 🚨
// //             imageConfig: {
// //               aspectRatio: "16:9",
// //               // sampleCount: 1 // Uncomment if supported by your specific model version
// //             },
// //             // Lower safety settings to allow for "Terror/Danger" thumbnail faces
// //             safetySettings: [
// //                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
// //                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
// //                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
// //                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" }
// //             ]
// //           },
// //         },
// //       });

// //       // ------------------------------------------------------------------
// //       // 7. ROBUST EXTRACTION (Your verified logic)
// //       // ------------------------------------------------------------------
// //       let imageBuffer: Buffer | null = null;

// //       // Method A: Check for structured files (Newer SDK)
// //       // @ts-ignore
// //       if (result.experimental_output?.files?.[0]) {
// //          // @ts-ignore
// //          const file = result.experimental_output.files[0];
// //          imageBuffer = Buffer.from(file.data, 'base64');
// //       }
// //       // Method B: Check standard files array
// //       // @ts-ignore
// //       else if (result.files && result.files.length > 0) {
// //         // @ts-ignore
// //         const file = result.files[0];
// //         if (file.mediaType?.startsWith('image/')) {
// //             const uint8Array = await file.uint8Array;
// //             imageBuffer = Buffer.from(uint8Array);
// //         } else if (file.uint8Array) {
// //              imageBuffer = Buffer.from(file.uint8Array);
// //         } else if (typeof file === 'string') {
// //              imageBuffer = Buffer.from(file, 'base64');
// //         }
// //       } 
// //       // Method C: Text Fallback
// //       else if (result.text && result.text.length > 1000) {
// //         try {
// //             const cleanText = result.text.replace(/```/g, '').replace('base64', '').trim();
// //             imageBuffer = Buffer.from(cleanText, 'base64');
// //         } catch (e) {
// //             console.warn("Failed to parse base64 from text");
// //         }
// //       }

// //       if (imageBuffer) {
// //         generatedBuffers.push(imageBuffer);
// //         console.log(`[AI Service] ✅ Variation ${i + 1} Success`);
// //       } else {
// //         console.warn(`[AI Service] ⚠️ Variation ${i + 1} returned no usable image data.`);
// //       }

// //     } catch (error: any) {
// //       console.error(`[AI Service] ❌ Variation ${i + 1} Error:`, error.message);
// //     }
// //   }

// //   if (generatedBuffers.length === 0) {
// //     throw new Error("No images were generated. Check API Key or Model Quota.");
// //   }

// //   return generatedBuffers;
// // };


// import { createGoogleGenerativeAI } from '@ai-sdk/google';
// import { generateText } from 'ai';

// const google = createGoogleGenerativeAI({
//   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
// });

// interface GenerateOptions {
//   prompt: string;
//   title: string;
//   count?: number;
//   subjectImage?: Buffer;
//   styleImage?: Buffer;
//   mimeType?: string;
// }

// // ------------------------------------------------------------------
// // STAGE 1: THE "JOURNEY" DIRECTOR
// // ------------------------------------------------------------------
// // async function generateStoryConcepts(prompt: string, title: string, count: number) {
// //   const model = google('models/gemini-2.0-flash'); 

// //   const systemPrompt = `
// //     ROLE: You are a Travel Vlogger & Creative Director.
    
// //     TASK: Analyze the user's travel plan and generate ${count} distinct thumbnail concepts that tell a STORY.
    
// //     INPUT:
// //     - User Prompt: "${prompt}"
// //     - Title: "${title}"

// //     CRITICAL ANALYSIS:
// //     1. **Detect Route:** If user says "Delhi to Manali", identify the CONTRAST (Delhi = Hot/Chaos/Pollution vs. Manali = Cold/Snow/Peace).
// //     2. **Detect Vehicle:** Extract the specific bike/car name (e.g., "Hayabusa", "Thar", "Himalayan"). You MUST mention this vehicle in the output.
// //     3. **Detect Vibe:** Is it a "Struggle" (Heat/Rain) or "Success" (Reached destination)?

// //     GENERATE 3 CONCEPTS (Must be different):
// //     - **Concept 1 (The Split Screen):** Show the CONTRAST. Left side = Start (Delhi Heat), Right side = End (Manali Snow).
// //     - **Concept 2 (The Journey/Struggle):** The rider in the difficult condition (e.g., sweating in Delhi traffic with the bike, or shivering in snow).
// //     - **Concept 3 (The Epic Arrival):** The specific vehicle (Hayabusa) parked at the destination with the rider looking triumphant.

// //     OUTPUT FORMAT (Raw JSON Array):
// //     [
// //       {
// //         "layout": "SPLIT_SCREEN" or "WIDE_ANGLE" or "POV",
// //         "visual_hook": "Detailed description of the scene",
// //         "vehicle_instruction": "Specific details about the vehicle",
// //         "mood": "Exact facial expression",
// //         "lighting": "Lighting description"
// //       }
// //     ]
// //   `;

// //   const result = await generateText({
// //     model,
// //     messages: [{ role: 'user', content: systemPrompt }],
// //   });

// //   try {
// //     const cleanJson = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
// //     return JSON.parse(cleanJson);
// //   } catch (e) {
// //     console.error("JSON Parse failed", e);
// //     // Fallback
// //     return Array(count).fill({
// //       layout: "WIDE_ANGLE",
// //       visual_hook: "Riding a Hayabusa on a mountain road with snow peaks",
// //       vehicle_instruction: "Suzuki Hayabusa Bike",
// //       mood: "Excited and freezing",
// //       lighting: "Golden Hour"
// //     });
// //   }
// // }
// // ------------------------------------------------------------------
// // STAGE 1: UNIVERSAL YOUTUBE STORY DIRECTOR
// // ------------------------------------------------------------------
// async function generateStoryConcepts(
//   prompt: string,
//   title: string,
//   count: number
// ) {
//   const model = google('models/gemini-2.0-flash');

//   const systemPrompt = `
// ROLE: You are a Senior YouTube Creative Director.

// GOAL:
// Generate ${count} DISTINCT YouTube thumbnail concepts that maximize curiosity and click-through rate.
// These concepts must work for ANY YouTube niche.

// INPUT:
// - User Prompt: "${prompt}"
// - Title: "${title}"

// STEP 1: DEEP ANALYSIS
// - Identify the CORE EVENT (What actually happened?)
// - Identify the EMOTIONAL CONFLICT (Fear, excitement, regret, curiosity, pride, shock, anger)
// - Identify the TRANSFORMATION (Before vs After, Unknown vs Known, Safe vs Dangerous)

// STEP 2: MAP TO UNIVERSAL STORY TYPES
// Every concept MUST use a different story archetype from below:

// 1. BEFORE_AFTER:
//    - Contrast between starting state and ending state
// 2. STRUGGLE:
//    - Person facing difficulty, tension, or chaos
// 3. REVEAL:
//    - Something hidden, secret, or unexpected being exposed
// 4. CLIMAX:
//    - The most intense or peak moment
// 5. REACTION:
//    - Strong human reaction to an event/object/person

// STEP 3: GENERATE CONCEPTS
// For each concept, output a JSON object with:

// - story_type: One of [BEFORE_AFTER, STRUGGLE, REVEAL, CLIMAX, REACTION]
// - layout: One of [SPLIT_SCREEN, WIDE_CONTEXT, CLOSE_REACTION, POV, SIDE_PROFILE]
// - visual_hook: Very concrete visual description (what we literally see)
// - subject_focus: What must be clearly visible (face, object, screen, result, damage, etc.)
// - emotion: Mixed human emotions (never single emotion)
// - environment: Physical surroundings
// - lighting: Lighting that supports emotion (natural, harsh, dim, uneven, etc.)

// RULES:
// - NO domain assumptions (not only travel, not only vehicles).
// - NO generic phrases like "nice background".
// - Think like a human YouTube designer, not an AI.
// - Output RAW JSON ARRAY only. No explanation.

// OUTPUT FORMAT:
// [
//   {
//     "story_type": "",
//     "layout": "",
//     "visual_hook": "",
//     "subject_focus": "",
//     "emotion": "",
//     "environment": "",
//     "lighting": ""
//   }
// ]
// `;

//   const result = await generateText({
//     model,
//     messages: [{ role: 'user', content: systemPrompt }],
//   });

//   try {
//     const cleanJson = result.text
//       .replace(/```json/g, '')
//       .replace(/```/g, '')
//       .trim();

//     return JSON.parse(cleanJson);
//   } catch (e) {
//     console.error("Story JSON Parse Failed", e);

//     // SAFE FALLBACK (Universal)
//     return Array.from({ length: count }, (_, i) => ({
//       story_type: "REACTION",
//       layout: "CLOSE_REACTION",
//       visual_hook: "Person reacting strongly to an unexpected outcome",
//       subject_focus: "Face and object/result causing reaction",
//       emotion: "Shock + curiosity + disbelief",
//       environment: "Real-life environment related to the event",
//       lighting: "Natural uneven lighting",
//     }));
//   }
// }


// // ------------------------------------------------------------------
// // STAGE 2: THE REALISTIC RENDERER
// // ------------------------------------------------------------------
// // export const generateThumbnailBatch = async ({
// //   prompt,
// //   title,
// //   count = 3,
// //   subjectImage,
// //   styleImage,
// //   mimeType = 'image/png',
// // }: GenerateOptions): Promise<Buffer[]> => {

// //   const generatedBuffers: Buffer[] = [];
// //   const MODEL_NAME = 'models/gemini-2.5-flash-image';

// //   console.log(`[AI Service] 🗺️ Planning Journey for: "${prompt}"...`);
  
// //   // 1. GET STORY CONCEPTS
// //   const concepts = await generateStoryConcepts(prompt, title, count);
// //   console.log(`[AI Service] 🎬 Storyboard Created:`, concepts);

// //   const toDataURL = (buf: Buffer, mime: string) => `data:${mime};base64,${buf.toString('base64')}`;
// //   const subjectDataUrl = subjectImage ? toDataURL(subjectImage, mimeType!) : null;
// //   const styleDataUrl = styleImage ? toDataURL(styleImage, mimeType!) : null;

// //   // 2. GENERATION LOOP
// //   for (let i = 0; i < count; i++) {
// //     try {
// //       const concept = concepts[i % concepts.length];
// //       console.log(`[AI Service] 📸 Generating Concept ${i + 1}: ${concept.layout}...`);

// //       // 3. THE "TRAVEL VLOG" PROMPT
// //       const systemInstruction = `
// //         ROLE: You are a Travel Photographer using a Sony A7S III.
// //         TASK: Create a REALISTIC, 16:9 TRAVEL VLOG THUMBNAIL.

// //         === 1. SCENE COMPOSITION: "${concept.layout}" ===
// //         ${concept.layout === 'SPLIT_SCREEN' 
// //           ? '- LAYOUT: SPLIT SCREEN EFFECT. Left Half: Hot, Sunny, Crowded City (Delhi). Right Half: Cold, Snowy Mountains (Manali). Diagonal tear line in middle.' 
// //           : '- LAYOUT: Cinematic Wide Shot. 16:9 Full Bleed.'}
        
// //         === 2. VISUAL ELEMENTS ===
// //         - THE SCENE: ${concept.visual_hook}
// //         - THE VEHICLE: **${concept.vehicle_instruction}**. Make sure the bike looks exactly like this model.
// //         - THE RIDER (Image 1): Preserve facial identity. 
// //         - CLOTHING: Rider should be wearing riding gear appropriate for the weather described.

// //         === 3. ATMOSPHERE & REALISM ===
// //         - EMOTION: ${concept.mood}
// //         - LIGHTING: ${concept.lighting}
// //         - DETAILS:
// //           - If "Delhi/Heat": Show heat waves, sweat on face, dust, traffic blur.
// //           - If "Manali/Cold": Show visible breath vapor, frost on the bike visor, snow texture.
// //         - CAMERA: Sharp focus on the Rider and Bike. Background slightly blurred (f/2.8).

// //         OUTPUT: A photorealistic image. No text overlays.
// //       `;

// //       const userContent: Array<{ type: 'text'; text: string } | { type: 'image'; image: string }> = [
// //         { type: 'text', text: systemInstruction },
// //         ...(subjectDataUrl ? [{ type: "image" as const, image: subjectDataUrl }] : [])
// //       ];
// //       if (styleDataUrl) userContent.push({ type: 'image', image: styleDataUrl });

// //       const result = await generateText({
// //         model: google(MODEL_NAME), 
// //         messages: [{ role: 'user', content: userContent }],
// //         providerOptions: {
// //           google: {
// //             responseModalities: ["IMAGE"],
// //             imageConfig: { aspectRatio: "16:9" },
// //             safetySettings: [
// //                { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
// //                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
// //                { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
// //                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" }
// //             ]
// //           },
// //         },
// //       });

//   //     // EXTRACT IMAGE (Standard Logic)
//   //     let imageBuffer: Buffer | null = null;
//   //     // @ts-ignore
//   //     if (result.experimental_output?.files?.[0]) imageBuffer = Buffer.from(result.experimental_output.files[0].data, 'base64');
//   //     // @ts-ignore
//   //     else if (result.files?.[0]) {
//   //         // @ts-ignore
//   //         const f = result.files[0];
//   //         if (f.uint8Array) {
//   //           imageBuffer = Buffer.from(f.uint8Array);
//   //         } else if (typeof f === 'string') {
//   //           imageBuffer = Buffer.from(f, 'base64');
//   //         }
//   //     }

//   //     if (imageBuffer) {
//   //       generatedBuffers.push(imageBuffer);
//   //       console.log(`[AI Service] ✅ Variation ${i + 1} Success`);
//   //     } else {
//   //       console.warn(`[AI Service] ⚠️ Variation ${i + 1} Failed`);
//   //     }

//   //   } catch (error: any) {
//   //     console.error(`[AI Service] ❌ Variation ${i + 1} Error:`, error.message);
//   //   }
//   // }

// export const generateThumbnailBatch = async ({
//   prompt,
//   title,
//   count = 3,
//   subjectImage,
//   styleImage,
//   mimeType = 'image/png',
// }: GenerateOptions): Promise<Buffer[]> => {

//   const generatedBuffers: Buffer[] = [];
//   const MODEL_NAME = 'models/gemini-2.5-flash-image';

//   // 1. GET STORY CONCEPTS (Now truly universal)
//   const concepts = await generateStoryConcepts(prompt, title, count);
  
//   const toDataURL = (buf: Buffer, mime: string) => `data:${mime};base64,${buf.toString('base64')}`;
//   const subjectDataUrl = subjectImage ? toDataURL(subjectImage, mimeType!) : null;
//   const styleDataUrl = styleImage ? toDataURL(styleImage, mimeType!) : null;

//   for (let i = 0; i < count; i++) {
//     try {
//       const concept = concepts[i % concepts.length];

//       // 2. THE DYNAMIC PROMPT (No more hardcoded Delhi/Manali)
//       const systemInstruction = `
//         ROLE: Expert YouTube Thumbnail Photographer.
//         TASK: Create a high-CTR, 16:9 photorealistic thumbnail.
        
//         STORY TYPE: ${concept.story_type}
//         COMPOSITION: ${concept.layout}
        
//         VISUAL SCENE: 
//         - Primary Action: ${concept.visual_hook}
//         - Focus Point: ${concept.subject_focus}. Ensure this is sharp and prominent.
//         - Environment: ${concept.environment}
        
//         ATMOSPHERE:
//         - Human Emotion: ${concept.emotion}. Capture this vividly in the subject's expression.
//         - Lighting Style: ${concept.lighting}
        
//         TECHNICAL RULES:
//         - If multiple panels/split-screen: Use a clean, sharp vertical or diagonal divider.
//         - Face Consistency: If a subject image is provided, replicate the facial features, hair, and identity exactly.
//         - Style: Cinematic, high-contrast, professional "vlogger" look. 
//         - Background: Slightly blurred (bokeh effect) to make the ${concept.subject_focus} pop.
        
//         OUTPUT: A photorealistic image. Absolutely NO text, NO watermarks, and NO logos.
//       `;

//       const userContent: Array<{ type: 'text'; text: string } | { type: 'image'; image: string }> = [
//         { type: 'text', text: systemInstruction },
//         ...(subjectDataUrl ? [{ type: "image" as const, image: subjectDataUrl }] : [])
//       ];

//       // Use the style image as a reference if the user provided one
//       if (styleDataUrl) {
//         userContent.push({ type: 'text', text: "Apply the color grading and aesthetic style of this reference image:" });
//         userContent.push({ type: 'image', image: styleDataUrl });
//       }

//       const result = await generateText({
//         model: google(MODEL_NAME), 
//         messages: [{ role: 'user', content: userContent }],
//         providerOptions: {
//           google: {
//             responseModalities: ["IMAGE"],
//             imageConfig: { aspectRatio: "16:9" },
//             // Keeping safety thresholds moderate for "Struggle" or "Reaction" archetypes
//             safetySettings: [
//                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
//             ]
//           },
//         },
//       });

//       // ... (Rest of your buffer extraction logic)
//            // EXTRACT IMAGE (Standard Logic)
//       let imageBuffer: Buffer | null = null;
//       // @ts-ignore
//       if (result.experimental_output?.files?.[0]) imageBuffer = Buffer.from(result.experimental_output.files[0].data, 'base64');
//       // @ts-ignore
//       else if (result.files?.[0]) {
//           // @ts-ignore
//           const f = result.files[0];
//           if (f.uint8Array) {
//             imageBuffer = Buffer.from(f.uint8Array);
//           } else if (typeof f === 'string') {
//             imageBuffer = Buffer.from(f, 'base64');
//           }
//       }

//       if (imageBuffer) {
//         generatedBuffers.push(imageBuffer);
//         console.log(`[AI Service] ✅ Variation ${i + 1} Success`);
//       } else {
//         console.warn(`[AI Service] ⚠️ Variation ${i + 1} Failed`);
//       }

//     } catch (error: any) {
//       console.error(`[AI Service] ❌ Variation ${i + 1} Error:`, error.message);
//     }
//   }

//   if (generatedBuffers.length === 0) throw new Error("Generation Failed.");

//   return generatedBuffers;
// };


// import { createGoogleGenerativeAI } from '@ai-sdk/google';
// import { generateText } from 'ai';

// // Initialize the Google provider
// const google = createGoogleGenerativeAI({
//   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
// });

// export interface GenerateOptions {
//   prompt: string;
//   title?: string;
//   count?: number;
//   subjectImage?: Buffer; // Buffer of the user's face
//   styleImage?: Buffer;   // Buffer of a reference style
//   mimeType?: string;     // e.g., 'image/jpeg' or 'image/png'
// }

// interface StoryConcept {
//   story_type: string;
//   time_of_day: string;
//   camera_angle: string;
//   action_level: string;
//   visual_hook: string;
//   subject_condition: string;
//   vlog_ui_element: string;
// }

// // ============================================================================
// // STAGE 1: THE DIRECTOR (Narrative & Strategy Engine)
// // ============================================================================
// async function generateStoryConcepts(
//   prompt: string, 
//   title: string = "", 
//   count: number = 3
// ): Promise<StoryConcept[]> {
//   const model = google('gemini-2.5-flash');

//   const systemPrompt = `
//     ROLE: You are an Elite YouTube Thumbnail Creative Director.
//     TASK: Generate ${count} HIGHLY DISTINCT thumbnail concepts based on the prompt: "${prompt}" and Title: "${title}"

//     YOU MUST USE A DIFFERENT STRATEGY FOR EACH CONCEPT:
//     - Strategy 1 (Immersion): First-Person POV or tight close-up. High tension/action.
//     - Strategy 2 (Scale): Wide Cinematic shot. Shows the environment and the subject's place in it.
//     - Strategy 3 (Vlogger): Side-profile tracking shot or includes a Picture-in-Picture (face-cam) UI element.

//     TIME OF DAY DYNAMICS:
//     Match the lighting to the emotion. Danger = Night/Harsh light. Adventure = Golden Hour. Mystery = Blue Hour.

//     OUTPUT FORMAT (RAW JSON ARRAY ONLY):
//     [
//       {
//         "story_type": "STRUGGLE, REVEAL, CLIMAX, or REACTION",
//         "time_of_day": "Morning, Midday, Golden Hour, Blue Hour, or Night",
//         "camera_angle": "First-Person POV, Third-Person Over-the-Shoulder, Wide Drone Shot, or Side Tracking Shot",
//         "action_level": "Static, Slow Motion, or High-Speed Motion Blur",
//         "visual_hook": "Intensely detailed description of the exact moment and interaction.",
//         "subject_condition": "Physical state of the subject (e.g., Sweating, scratched face hiding, relaxed with wind in hair).",
//         "vlog_ui_element": "None" OR "Circular face-cam overlay in the bottom corner showing a reaction"
//       }
//     ]
//   `;

//   try {
//     const result = await generateText({
//       model,
//       messages: [{ role: 'user', content: systemPrompt }],
//     });

//     const cleanJson = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
//     return JSON.parse(cleanJson) as StoryConcept[];
//   } catch (e) {
//     console.error("[Director Error] JSON Parse Failed, falling back to safe defaults.", e);
//     // Safe Fallback guaranteeing 3 distinct styles if the LLM hallucinates
//     return [
//       {
//         story_type: "CLIMAX", time_of_day: "Night", camera_angle: "First-Person POV",
//         action_level: "High-Speed Motion Blur", visual_hook: `Intense close-up based on: ${prompt}`,
//         subject_condition: "Sweating, intense focus, eyes wide", vlog_ui_element: "None"
//       },
//       {
//         story_type: "STRUGGLE", time_of_day: "Blue Hour", camera_angle: "Wide Drone Shot",
//         action_level: "Static", visual_hook: `Massive environmental scale showing: ${prompt}`,
//         subject_condition: "Small in frame, facing overwhelming odds", vlog_ui_element: "None"
//       },
//       {
//         story_type: "REACTION", time_of_day: "Midday", camera_angle: "Side Tracking Shot",
//         action_level: "Slow Motion", visual_hook: `Action happening alongside the subject: ${prompt}`,
//         subject_condition: "Expressive reaction, highly visible", vlog_ui_element: "Circular face-cam overlay"
//       }
//     ].slice(0, count);
//   }
// }

// // ============================================================================
// // STAGE 1.5: THE ARCHITECT (Prompt Engineering Pre-Processor)
// // ============================================================================
// function buildEngineeringPrompt(concept: StoryConcept): string {
//   // Translate time of day to actual cinematic lighting techniques
//   let lightingProfile = "Studio lighting, softboxes, even exposure.";
//   if (concept.time_of_day === "Night") lightingProfile = "Pitch black environment, harsh directional artificial light (flashlight/headlights), high contrast, moody shadows.";
//   if (concept.time_of_day === "Golden Hour") lightingProfile = "Warm, glowing amber sunlight coming from a low angle, long soft shadows, cinematic rim lighting.";
//   if (concept.time_of_day === "Blue Hour") lightingProfile = "Eerie, cool blue ambient light right after sunset, low visibility, tense atmosphere.";

//   // Translate action to camera settings
//   let cameraSettings = "Aperture f/2.8, sharp focus, high shutter speed.";
//   if (concept.action_level === "High-Speed Motion Blur") cameraSettings = "Slow shutter speed effect, heavy directional motion blur on the background, subject in sharp focus to simulate extreme speed/chaos.";

//   // [Image of Rule of Thirds composition in photography]

//   return `
//     OBJECTIVE: Generate a high-CTR, photorealistic YouTube Thumbnail.
//     STORY TYPE: ${concept.story_type}
    
//     SCENE & ACTION:
//     - Visual Hook: ${concept.visual_hook}
//     - Camera Angle: ${concept.camera_angle}. (CRITICAL: Adhere strictly to this framing).
//     - Subject State: ${concept.subject_condition}. Ensure the human element reflects this physical state perfectly.
    
//     ENVIRONMENT & LIGHTING:
//     - Time of Day: ${concept.time_of_day}
//     - Lighting Instructions: ${lightingProfile}
//     - Camera Settings: ${cameraSettings}. Use Rule of Thirds composition.

//     ${concept.vlog_ui_element !== "None" ? `
//     SPECIAL VLOG UI LAYER:
//     - Add a distinct ${concept.vlog_ui_element}. This must look like a gaming or vlogging Picture-in-Picture layout inserted over the main scene.
//     ` : ""}

//     TECHNICAL RESTRICTIONS (STRICT):
//     - ASPECT RATIO: 16:9.
//     - TEXT: Absolutely NO text, words, or floating letters in the image.
//     - REALISM: Must look like a real photo taken on a Sony A7S III. Keep natural skin texture and slight film grain. No plastic "CGI" skin.
//     - CONSISTENCY: If a reference face image is provided, perfectly map the facial structure, skin tone, and hair to the primary subject.
//   `;
// }

// // ============================================================================
// // STAGE 2: THE RENDERER (Concurrent Generation)
// // ============================================================================
// export const generateThumbnailBatch = async ({
//   prompt,
//   title = "",
//   count = 3,
//   subjectImage,
//   styleImage,
//   mimeType = 'image/jpeg',
// }: GenerateOptions): Promise<Buffer[]> => {
  
//   console.log(`[AI Service] 🎬 Directing Story for: "${prompt}"...`);
  
//   // 1. Get the dynamic JSON blueprints
//   const concepts = await generateStoryConcepts(prompt, title, count);
//   console.log(`[AI Service] 🗺️ Architecting ${concepts.length} unique variations...`);

//   // Helper to convert Buffers to Base64 Data URLs for the AI SDK
//   const toDataURL = (buf: Buffer, mime: string) => `data:${mime};base64,${buf.toString('base64')}`;
//   const subjectDataUrl = subjectImage ? toDataURL(subjectImage, mimeType) : null;
//   const styleDataUrl = styleImage ? toDataURL(styleImage, mimeType) : null;

//   // 2. Map over blueprints and create concurrent rendering tasks
//   const generationPromises = concepts.map(async (concept, index) => {
//     const systemInstruction = buildEngineeringPrompt(concept);

//     // Build Multimodal payload
//     const userContent: Array<{ type: 'text'; text: string } | { type: 'image'; image: string }> = [
//       { type: 'text', text: systemInstruction }
//     ];

//     if (subjectDataUrl) {
//       userContent.push({ type: 'text', text: "REFERENCE 1 (SUBJECT IDENTITY): Apply this exact face to the Primary Subject. Maintain identity." });
//       userContent.push({ type: 'image', image: subjectDataUrl });
//     }

//     if (styleDataUrl) {
//       userContent.push({ type: 'text', text: "REFERENCE 2 (STYLE): Apply the color grading and aesthetic vibe of this image." });
//       userContent.push({ type: 'image', image: styleDataUrl });
//     }

//     try {
//       console.log(`[Worker ${index + 1}] 📸 Rendering ${concept.camera_angle} at ${concept.time_of_day}...`);
      
//       const result = await generateText({
//         model: google('gemini-2.5-flash-image'),
//         messages: [{ role: 'user', content: userContent }],
//         providerOptions: {
//           google: {
//             responseModalities: ["IMAGE"],
//             imageConfig: { aspectRatio: "16:9" },
//             // Keeping thresholds moderate to allow for "Struggle/Attack" scenarios
//             safetySettings: [
//                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
//                { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" }
//             ]
//           },
//         },
//       });

//       // Safely extract the image Buffer
//       // Note: Depending on your exact vercel 'ai' SDK version, it might be in experimental_output or files
//       let imageBuffer: Buffer | null = null;
      
//       // @ts-ignore
//       if (result.experimental_output?.files?.[0]) {
//         // @ts-ignore
//         imageBuffer = Buffer.from(result.experimental_output.files[0].data, 'base64');
//       // @ts-ignore
//       } else if (result.files && result.files.length > 0) {
//         // @ts-ignore
//         const f = result.files.find(file => file.mediaType?.startsWith('image/'));
//         if (f) {
//           if (f.uint8Array) imageBuffer = Buffer.from(f.uint8Array);
//           else if (typeof f === 'string') imageBuffer = Buffer.from(f, 'base64');
//         }
//       }

//       if (imageBuffer) {
//         console.log(`[Worker ${index + 1}] ✅ Render Success`);
//         return imageBuffer;
//       } else {
//         throw new Error("No image data returned from model API.");
//       }

//     } catch (error: any) {
//       console.error(`[Worker ${index + 1}] ❌ Render Failed: ${error.message}`);
//       return null; // Return null so Promise.allSettled handles it gracefully
//     }
//   });

//   // 3. Execute all generations concurrently
//   const results = await Promise.allSettled(generationPromises);
  
//   // 4. Filter and return only the successful Buffers
//   const successfulBuffers = results
//     .filter((res): res is PromiseFulfilledResult<Buffer> => res.status === 'fulfilled' && res.value !== null)
//     .map(res => res.value);

//   if (successfulBuffers.length === 0) {
//     throw new Error("All rendering workers failed. Please check your prompt or API limits.");
//   }

//   return successfulBuffers;
// };




// import { createGoogleGenerativeAI } from '@ai-sdk/google';
// import { generateText } from 'ai';

// const google = createGoogleGenerativeAI({
//   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
// });

// export interface GenerateOptions {
//   prompt: string;
//   title?: string;
//   count?: number;
//   subjectImage?: Buffer;
//   styleImage?: Buffer;
//   mimeType?: string;
// }

// interface UniversalConcept {
//   niche: string;
//   layout_archetype: "THE_REACTION" | "THE_TRANSFORMATION" | "THE_OBJECT_SHOWCASE" | "THE_ACTION_TENSION";
//   camera_lens: string;
//   lighting_style: string;
//   human_anchor: string;
//   visual_hook: string;
//   background_depth: string;
// }

// // ============================================================================
// // STAGE 1: THE UNIVERSAL DIRECTOR (Niche Diagnosis & Strategy)
// // ============================================================================
// async function generateStoryConcepts(
//   prompt: string, 
//   title: string = "", 
//   count: number = 3
// ): Promise<UniversalConcept[]> {
//   const model = google('gemini-2.5-flash');

//   const systemPrompt = `
//     ROLE: Elite YouTube Creative Director for all niches (Tech, Gaming, Vlog, Finance, Cooking, IRL).
//     TASK: Analyze the prompt: "${prompt}" (Title: "${title}"). Generate ${count} DISTINCT thumbnail blueprints.

//     STEP 1: Identify the likely Niche.
//     STEP 2: Apply a different "Layout Archetype" for each concept:
//       - THE_REACTION: Used for Drama/Vlogs/Gaming. Extreme close-up of a highly emotional face looking at a secondary object.
//       - THE_TRANSFORMATION: Used for Tutorials/Fitness/Art. Split-screen or clear visual contrast between two states.
//       - THE_OBJECT_SHOWCASE: Used for Tech/Finance/Food. The object/product is massive and perfectly lit, the human is smaller or in the background reacting to it.
//       - THE_ACTION_TENSION: Used for IRL/Pranks/Danger. Forced perspective, the action/threat is invading the frame.

//     OUTPUT FORMAT (RAW JSON ARRAY ONLY):
//     [
//       {
//         "niche": "e.g., Tech Review, Cooking, IRL Challenge",
//         "layout_archetype": "Choose one from the list above",
//         "camera_lens": "e.g., 14mm Ultra-Wide, 50mm Portrait, Macro Lens",
//         "lighting_style": "e.g., Bright Studio Neon, Harsh Sunlight, Moody Cinematic",
//         "human_anchor": "Exact description of the human's emotion, physical state, and position in frame. MUST be highly expressive.",
//         "visual_hook": "Description of the main object/event generating the CTR. Must be specific.",
//         "background_depth": "e.g., Deep bokeh blur, Split color gradient, Infinite dark void"
//       }
//     ]
//   `;

//   try {
//     const result = await generateText({
//       model,
//       messages: [{ role: 'user', content: systemPrompt }],
//     });

//     const cleanJson = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
//     return JSON.parse(cleanJson) as UniversalConcept[];
//   } catch (e) {
//     console.error("[Director Error] Fallback triggered.", e);
//     return Array(count).fill({
//       niche: "General", layout_archetype: "THE_REACTION", camera_lens: "35mm Portrait",
//       lighting_style: "High contrast studio lighting", human_anchor: "Shocked face, looking off camera",
//       visual_hook: `Primary focus based on: ${prompt}`, background_depth: "Heavy background blur"
//     });
//   }
// }

// // ============================================================================
// // STAGE 1.5: THE ARCHITECT (Universal Photographic Translation)
// // ============================================================================
// function buildEngineeringPrompt(concept: UniversalConcept): string {
  
//   // Dynamically build the geometry based on the archetype
//   let geometryInstruction = "";
//   if (concept.layout_archetype === "THE_REACTION") {
//     geometryInstruction = "Place the human subject in the foreground on the left or right third. They must be massive. Place the visual hook smaller in the opposite third.";
//   } else if (concept.layout_archetype === "THE_TRANSFORMATION") {
//     geometryInstruction = "Use a clear visual divider or split-screen effect. Show stark contrast between the left side and right side of the image.";
//   } else if (concept.layout_archetype === "THE_OBJECT_SHOWCASE") {
//     geometryInstruction = "The visual hook (object) must be massive, floating, or perfectly centered in the absolute foreground. The human subject should be slightly behind it, reacting to it.";
//   } else if (concept.layout_archetype === "THE_ACTION_TENSION") {
//     geometryInstruction = "Use forced perspective. The visual hook/action must feel like it is breaking the fourth wall or lunging at the camera. The human subject must look desperate or highly animated.";
//   }

  

//   return `
//     OBJECTIVE: Generate a high-CTR, photorealistic YouTube Thumbnail for the ${concept.niche} niche.
    
//     COMPOSITION & GEOMETRY (STRICT ADHERENCE REQUIRED):
//     - Layout Archetype: ${concept.layout_archetype}
//     - Geometry: ${geometryInstruction}
//     - Camera Setup: Shot on ${concept.camera_lens}. ${concept.background_depth}.

//     THE TWO ACTORS:
//     1. The Human (Anchor): ${concept.human_anchor}. (If a reference image is provided, perfectly match their facial identity).
//     2. The Story Element (Hook): ${concept.visual_hook}. Ensure this has high-definition texture and pops from the background.

//     ATMOSPHERE:
//     - Lighting: ${concept.lighting_style}
//     - Color Grading: High contrast, high vibrancy. Separate the foreground subjects from the background using rim lighting.

//     TECHNICAL RESTRICTIONS:
//     - ASPECT RATIO: 16:9.
//     - NO TEXT OR WORDS AT ALL. Zero text overlay.
//     - REALISM: Keep natural skin textures and believable lighting. Avoid plastic/CGI looks.
//   `;
// }

// // ============================================================================
// // STAGE 2: THE RENDERER (Concurrent Generation)
// // ============================================================================
// export const generateThumbnailBatch = async (options: GenerateOptions): Promise<Buffer[]> => {
//   const { prompt, title = "", count = 3, subjectImage, styleImage, mimeType = 'image/jpeg' } = options;
  
//   console.log(`[AI Service] 🎬 Analyzing Niche & Directing: "${prompt}"...`);
//   const concepts = await generateStoryConcepts(prompt, title, count);
  
//   const toDataURL = (buf: Buffer, mime: string) => `data:${mime};base64,${buf.toString('base64')}`;
//   const subjectDataUrl = subjectImage ? toDataURL(subjectImage, mimeType) : null;
//   const styleDataUrl = styleImage ? toDataURL(styleImage, mimeType) : null;

//   const generationPromises = concepts.map(async (concept, index) => {
//     const systemInstruction = buildEngineeringPrompt(concept);

//     const userContent: Array<{ type: 'text'; text: string } | { type: 'image'; image: string }> = [
//       { type: 'text', text: systemInstruction }
//     ];

//     if (subjectDataUrl) {
//       userContent.push({ type: 'text', text: "REFERENCE 1 (IDENTITY): Apply this face to the Human Anchor." });
//       userContent.push({ type: 'image', image: subjectDataUrl });
//     }

//     if (styleDataUrl) {
//       userContent.push({ type: 'text', text: "REFERENCE 2 (STYLE): Apply this exact color palette and vibe." });
//       userContent.push({ type: 'image', image: styleDataUrl });
//     }

//     try {
//       console.log(`[Worker ${index + 1}] 📸 Rendering ${concept.niche} using ${concept.layout_archetype}...`);
      
//       const result = await generateText({
//         model: google('gemini-2.5-flash-image'),
//         messages: [{ role: 'user', content: userContent }],
//         providerOptions: {
//           google: {
//             responseModalities: ["IMAGE"],
//             imageConfig: { aspectRatio: "16:9" },
//             safetySettings: [
//                { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
//             ]
//           },
//         },
//       });

//       let imageBuffer: Buffer | null = null;
//       // @ts-ignore
//       if (result.experimental_output?.files?.[0]) {
//         // @ts-ignore
//         imageBuffer = Buffer.from(result.experimental_output.files[0].data, 'base64');
//       } else {
//         // @ts-ignore
//         const f = result.files?.find(file => file.mediaType?.startsWith('image/'));
//         if (f) {
//           if (f.uint8Array) {
//             imageBuffer = Buffer.from(f.uint8Array);
//           } else if (typeof f === 'string') {
//             imageBuffer = Buffer.from(f, 'base64');
//           } else if (typeof f === 'string') {
//             imageBuffer = Buffer.from(f, 'base64');
//           }
//         }
//       }

//       if (!imageBuffer) throw new Error("No image data returned.");
//       return imageBuffer;

//     } catch (error: any) {
//       console.error(`[Worker ${index + 1}] ❌ Failed: ${error.message}`);
//       return null;
//     }
//   });

//   const results = await Promise.allSettled(generationPromises);
//   const successfulBuffers = results
//     .filter((res): res is PromiseFulfilledResult<Buffer> => res.status === 'fulfilled' && res.value !== null)
//     .map(res => res.value);

//   if (successfulBuffers.length === 0) throw new Error("All rendering workers failed.");
//   return successfulBuffers;
// };




// import { createGoogleGenerativeAI } from '@ai-sdk/google';
// import { generateText } from 'ai';

// const google = createGoogleGenerativeAI({
//   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
// });

// export interface GenerateOptions {
//   prompt: string;
//   title: string; 
//   count?: number;
//   subjectImage?: Buffer;
//   styleImage?: Buffer;
//   mimeType?: string;
// }

// // THE MASTER BLUEPRINT: Covers Time, Entities, and Layout
// interface UltimateConcept {
//   story_phase: "1_ANTICIPATION" | "2_CLIMAX" | "3_AFTERMATH";
//   composition_rule: "SOLO_FOCUS" | "GROUP_DYNAMIC" | "OBJECT_REVEAL";
//   primary_subject: string; 
//   secondary_elements: string; // STRICT rule application here
//   environment_details: string;
//   camera_and_lighting: string;
//   text_placement: string; 
// }

// // ============================================================================
// // STAGE 1: THE MASTER DIRECTOR (Intent Parsing & Creative Matrix)
// // ============================================================================
// async function generateStoryConcepts(prompt: string, title: string, count: number = 3): Promise<UltimateConcept[]> {
//   const model = google('gemini-2.5-flash');

//   const systemPrompt = `
//     ROLE: Elite YouTube Thumbnail Director & Data Parser.
//     TASK: Analyze the user prompt: "${prompt}" and Title: "${title}". Generate ${count} completely distinct thumbnail concepts.

//     STEP 1: STRICT ENTITY PARSING (ZERO HALLUCINATION)
//     - Did they mention a group? (e.g., "with 4 friends", "convoy"). If yes, set composition to GROUP_DYNAMIC.
//     - Did they mention an object? (e.g., "new bike", "trophy"). If yes, ensure it's prominently featured.
//     - Did they mention a specific location or transition? (e.g., "Delhi to Manali"). Ensure the environment reflects this exact transition.
//     - If NO group is mentioned, you MUST default to SOLO_FOCUS and explicitly forbid background characters.

//     STEP 2: THE TIMELINE MATRIX (Generate 1 concept for each phase)
//     - Phase 1 (1_ANTICIPATION): The build-up. Hidden objects (bike under cloth), waiting in suspense, harsh conditions before success (Delhi heat/traffic).
//     - Phase 2 (2_CLIMAX): The peak action. The lion mid-jump, the crowd clapping as you hold the trophy, splashing through the river.
//     - Phase 3 (3_AFTERMATH): The emotional/physical result. Scratched face hiding from a lion, crying tears of joy holding bike keys, exhausted but victorious in Manali snow.

//     OUTPUT FORMAT (RAW JSON ARRAY ONLY):
//     [
//       {
//         "story_phase": "Must use: 1_ANTICIPATION, 2_CLIMAX, or 3_AFTERMATH",
//         "composition_rule": "SOLO_FOCUS, GROUP_DYNAMIC, or OBJECT_REVEAL",
//         "primary_subject": "Extremely detailed description of the Hero's emotional and physical state (e.g., 'Massive in foreground, sweating, scratched cheek, wide terrified eyes')",
//         "secondary_elements": "Only elements explicitly requested or logically required by the timeline (e.g., 'A bike covered in a red cloth', '4 friends pushing a Jeep', 'NONE')",
//         "environment_details": "Highly specific atmosphere (e.g., 'Blinding Manali snowstorm', 'Dark stage with spotlight', 'Polluted chaotic Delhi street')",
//         "camera_and_lighting": "Specific lens and lighting (e.g., 'Fisheye lens, harsh blue moonlight', '50mm portrait, bright golden hour')",
//         "text_placement": "Safe zone for text so it doesn't cover faces (e.g., 'Bold typography in the top-right corner')"
//       }
//     ]
//   `;

//   try {
//     const result = await generateText({
//       model,
//       messages: [{ role: 'user', content: systemPrompt }],
//       temperature: 0.6, // Balanced for strict rule-following AND creative environments
//     });
//     const cleanJson = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
//     return JSON.parse(cleanJson) as UltimateConcept[];
//   } catch (e) {
//     console.error("[Director Error] Engine Failed, returning safe generic fallbacks.", e);
//     return Array(count).fill({
//       story_phase: "2_CLIMAX", composition_rule: "SOLO_FOCUS",
//       primary_subject: "Hero looking highly expressive and engaging.",
//       secondary_elements: "NONE", environment_details: "Dynamic cinematic background.",
//       camera_and_lighting: "Sharp focus, high contrast lighting.", text_placement: "Bottom center."
//     });
//   }
// }

// // ============================================================================
// // STAGE 1.5: THE ARCHITECT (Strict Layer Assembly)
// // ============================================================================
// function buildEngineeringPrompt(concept: UltimateConcept, title: string): string {
  
//   // Conditionally build the midground to prevent hallucinated friends/crowds
//   let secondaryLayer = "";
//   if (concept.composition_rule === "SOLO_FOCUS" || concept.secondary_elements.toUpperCase() === "NONE") {
//     secondaryLayer = `2. **LAYER 2 (BACKGROUND - STRICT RULE):** This is a SOLO composition. Absolutely NO other humans or characters are allowed in the background.`;
//   } else {
//     secondaryLayer = `2. **LAYER 2 (MIDGROUND/INTERACTION):** Seamlessly integrate these elements behind or around the hero: ${concept.secondary_elements}.`;
//   }

//   return `
//     OBJECTIVE: Generate a high-CTR, viral YouTube Thumbnail. 
//     NARRATIVE PHASE: ${concept.story_phase}

//     COMPOSITION GEOMETRY (CRITICAL - STRICT ADHERENCE):
//     1. **LAYER 1 (EXTREME FOREGROUND - THE HERO):** ${concept.primary_subject}. The human subject MUST be the focal point, occupying at least 40% of the frame. Their physical state and emotion are the most important part of this image.
//     ${secondaryLayer}
//     3. **LAYER 3 (ENVIRONMENT):** ${concept.environment_details}.

//     CINEMATOGRAPHY:
//     - Camera & Light: ${concept.camera_and_lighting}.
//     - Style: Photorealistic YouTube vlog aesthetic. High vibrancy, cinematic contrast. No cheap CGI or cartoon filters.

//     THUMBNAIL TYPOGRAPHY (CRITICAL):
//     - **TEXT CONTENT:** You must render the exact phrase: "${title}"
//     - **STYLE:** Big, BOLD, High-Impact YouTube font. High contrast (e.g., Yellow/White with black outline/shadow).
//     - **PLACEMENT:** ${concept.text_placement}. Ensure absolutely NO text covers the Hero's face.

//     (If an identity reference image is provided, apply that exact facial structure and identity strictly to the massive HERO subject in Layer 1).
//   `;
// }

// // ============================================================================
// // STAGE 2: THE CONCURRENT RENDERER
// // ============================================================================
// export const generateThumbnailBatch = async (options: GenerateOptions): Promise<Buffer[]> => {
//   const { prompt, title, count = 3, subjectImage, styleImage, mimeType = 'image/jpeg' } = options;
  
//   if (!title) throw new Error("Title is required for thumbnail text rendering.");

//   console.log(`[AI Engine] 🧠 Processing variables for: "${prompt}"...`);
//   const concepts = await generateStoryConcepts(prompt, title, count);
  
//   const toDataURL = (buf: Buffer, mime: string) => `data:${mime};base64,${buf.toString('base64')}`;
//   const subjectDataUrl = subjectImage ? toDataURL(subjectImage, mimeType) : null;
//   const styleDataUrl = styleImage ? toDataURL(styleImage, mimeType) : null;

//   const generationPromises = concepts.map(async (concept, index) => {
//     const systemInstruction = buildEngineeringPrompt(concept, title);

//     const userContent: Array<{ type: 'text'; text: string } | { type: 'image'; image: string }> = [
//       { type: 'text', text: systemInstruction }
//     ];

//     if (subjectDataUrl) {
//       userContent.push({ type: 'text', text: "REFERENCE 1 (IDENTITY): Map this face to the primary foreground Hero." });
//       userContent.push({ type: 'image', image: subjectDataUrl });
//     }
//     if (styleDataUrl) {
//       userContent.push({ type: 'text', text: "REFERENCE 2 (STYLE): Match this color grading and aesthetic." });
//       userContent.push({ type: 'image', image: styleDataUrl });
//     }

//     try {
//       console.log(`[Worker ${index + 1}] 📸 Rendering Phase: ${concept.story_phase} using ${concept.composition_rule}...`);
      
//       const result = await generateText({
//         model: google('gemini-2.5-flash-image'),
//         messages: [{ role: 'user', content: userContent }],
//         providerOptions: {
//           google: {
//             responseModalities: ["IMAGE"],
//             imageConfig: { aspectRatio: "16:9" },
//             // Keeping safety settings just high enough to allow "scratches" and "action" without violating core safety
//             safetySettings: [{ category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }]
//           },
//         },
//       });

//       let imageBuffer: Buffer | null = null;
//       // @ts-ignore
//       if (result.experimental_output?.files?.[0]) {
//         // @ts-ignore
//         imageBuffer = Buffer.from(result.experimental_output.files[0].data, 'base64');
//       } else {
//         // @ts-ignore
//         const f = result.files?.find(file => file.mediaType?.startsWith('image/'));
//         if (f) {
//           if (f.uint8Array) {
//             imageBuffer = Buffer.from(f.uint8Array);
//           } else if (typeof f === 'string') {
//             imageBuffer = Buffer.from(f, 'base64');
//           }
//         }
//       }

//       if (!imageBuffer) throw new Error("Image stream failed.");
//       return imageBuffer;

//     } catch (error: any) {
//       console.error(`[Worker ${index + 1}] ❌ Generation Failed: ${error.message}`);
//       return null;
//     }
//   });

//   const results = await Promise.allSettled(generationPromises);
//   const successfulBuffers = results
//     .filter((res): res is PromiseFulfilledResult<Buffer> => res.status === 'fulfilled' && res.value !== null)
//     .map(res => res.value);

//   if (successfulBuffers.length === 0) throw new Error("All rendering pipelines failed. Please check the prompt or API status.");
//   return successfulBuffers;
// };


// import { createGoogleGenerativeAI } from '@ai-sdk/google';
// import { generateText } from 'ai';

// const google = createGoogleGenerativeAI({
//   apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
// });

// export interface GenerateOptions {
//   prompt: string;
//   title: string; 
//   count?: number;
//   subjectImage?: Buffer;
//   styleImage?: Buffer;
//   mimeType?: string;
// }

// // 1. THE UNIFIED INTERFACE (This prevents the "undefined" error)
// interface StoryboardConcept {
//   concept_name: string;
//   layout_style: string;
//   hero_state: string;
//   scene_details: string;
//   text_placement: string;
// }

// // ============================================================================
// // STAGE 1: THE INFINITE STORYBOARD DIRECTOR (Few-Shot Prompting)
// // ============================================================================
// async function generateStoryConcepts(prompt: string, title: string, count: number = 3): Promise<StoryboardConcept[]> {
//   const model = google('gemini-2.5-flash');

//   const systemPrompt = `
//     ROLE: Elite YouTube Thumbnail Storyboard Artist.
//     TASK: Analyze the user prompt: "${prompt}" and Title: "${title}".
//     GOAL: Generate ${count} completely distinct, highly creative visual concepts that tell a gripping STORY based on the input.

//     --- HOW YOU MUST THINK (LEARN FROM THESE EXAMPLES) ---
//     If the prompt is about a JOURNEY (e.g., "Delhi to Manali"):
//     - Case 1: The Split Screen. Left side shows chaotic/hot Delhi, right side shows peaceful/snowy Manali.
//     - Case 2: The Action POV. Riding a bike on a dangerous mountain curve with a massive drop-off.
    
//     If the prompt is about DANGER/ATTACK (e.g., "Lion attack on me"):
//     - Case 1: The Jump. A massive lion mid-air, lunging at the camera, while the hero cries in terror.
//     - Case 2: The Hiding Aftermath. Hero has a bloody scratch on their face, hiding behind a rock, looking panicked.

//     If the prompt is about a PURCHASE (e.g., "Buying a new phone/bike"):
//     - Case 1: The Object Reveal. Close up of the hero holding the item, smiling massively, item is in sharp focus.
//     - Case 2: The Showroom/Delivery. Standing outside the store or bike covered in a cloth.

//     If the prompt is about a GROUP EVENT (e.g., "Ooty with friends in G-Wagon"):
//     - Case 1: The Squad Photo. The whole group sitting on the hood of the vehicle with the mountains behind them.
//     - Case 2: The POV Drive. Inside the car looking out at the epic view, friends laughing in the back seat.

//     If the prompt is about an ACCIDENT/INJURY:
//     - Case 1: The Hospital Arrival. Hero arriving at the hospital looking injured.
//     - Case 2: The Impact Zone. Sitting on the road, heavily damaged car smoking in the background.
//     ------------------------------------------------------

//     INSTRUCTIONS:
//     1. Identify the core theme of the user's prompt.
//     2. Invent ${count} highly specific, dramatic scenes just like the examples above.
//     3. Output EXACTLY these JSON keys. Do not change them.

//     OUTPUT FORMAT (RAW JSON ARRAY ONLY):
//     [
//       {
//         "concept_name": "A short name for this case (e.g., 'The Split Screen Journey')",
//         "layout_style": "How the image is structured (e.g., '50/50 Split', 'Extreme Foreground', 'Wide Angle')",
//         "hero_state": "The exact physical/emotional state of the main person (e.g., 'Scratched face, crying', 'Massive smile')",
//         "scene_details": "Everything else in the frame (e.g., 'Damaged smoking car', 'Snowy Manali mountains')",
//         "text_placement": "Where the title text should go so it doesn't cover faces"
//       }
//     ]
//   `;

//   try {
//     const result = await generateText({
//       model,
//       messages: [{ role: 'user', content: systemPrompt }],
//       temperature: 0.8, 
//     });
//     const cleanJson = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
//     return JSON.parse(cleanJson) as StoryboardConcept[];
//   } catch (e) {
//     console.error("[Director Error] Failed to parse JSON, returning exact fallback structure.", e);
//     // 2. FALLBACK MUST MATCH THE INTERFACE (Also prevents "undefined")
//     return Array(count).fill({
//       concept_name: "Dynamic Action Shot",
//       layout_style: "Hero Focused Mid-Shot",
//       hero_state: "Highly emotional expression, staring at the camera",
//       scene_details: `Cinematic background representing: ${prompt}`,
//       text_placement: "Bottom center, bold typography"
//     });
//   }
// }

// // ============================================================================
// // STAGE 1.5: THE ARCHITECT (Prompt Builder)
// // ============================================================================
// function buildEngineeringPrompt(concept: StoryboardConcept, title: string): string {
//   return `
//     OBJECTIVE: Generate a high-CTR, story-driven YouTube Thumbnail.
//     CONCEPT: ${concept.concept_name}

//     LAYOUT & GEOMETRY (CRITICAL):
//     - Layout Style: ${concept.layout_style}. Follow this structural instruction perfectly. If it asks for a split-screen, draw a clear dividing line. If it asks for a POV, frame it from the first-person perspective.
    
//     THE STORY ELEMENTS:
//     - The Hero (Primary Focus): ${concept.hero_state}. They must be highly visible and emotional. Ensure they occupy a massive portion of the frame.
//     - The Scene & Props: ${concept.scene_details}. Ensure these elements are realistic and placed logically around the hero to tell the story.

//     THUMBNAIL TEXT (CRITICAL):
//     - **TEXT CONTENT:** Render the exact phrase: "${title}"
//     - **STYLE:** Big, BOLD, High-Impact YouTube style typography. Use high contrast colors.
//     - **PLACEMENT:** ${concept.text_placement}. Ensure absolutely NO text covers the Hero's face.

//     CINEMATOGRAPHY & REALISM:
//     - Must look like a high-budget YouTube vlog thumbnail or documentary still. 
//     - Keep natural skin textures and realistic lighting. No cheap CGI styles.
//   `;
// }

// // ============================================================================
// // STAGE 2: THE CONCURRENT RENDERER
// // ============================================================================
// export const generateThumbnailBatch = async (options: GenerateOptions): Promise<Buffer[]> => {
//   const { prompt, title, count = 3, subjectImage, styleImage, mimeType = 'image/jpeg' } = options;
  
//   if (!title) throw new Error("Title is required for thumbnail generation.");

//   console.log(`[AI Service] 🧠 Storyboarding for: "${prompt}"...`);
//   const concepts = await generateStoryConcepts(prompt, title, count);
  
//   const toDataURL = (buf: Buffer, mime: string) => `data:${mime};base64,${buf.toString('base64')}`;
//   const subjectDataUrl = subjectImage ? toDataURL(subjectImage, mimeType) : null;
//   const styleDataUrl = styleImage ? toDataURL(styleImage, mimeType) : null;

//   const generationPromises = concepts.map(async (concept, index) => {
//     const systemInstruction = buildEngineeringPrompt(concept, title);

//     const userContent: Array<{ type: 'text'; text: string } | { type: 'image'; image: string }> = [
//       { type: 'text', text: systemInstruction }
//     ];

//     if (subjectDataUrl) {
//       userContent.push({ type: 'text', text: "REFERENCE 1 (IDENTITY): Map this face to the primary Hero." });
//       userContent.push({ type: 'image', image: subjectDataUrl });
//     }
//     if (styleDataUrl) {
//       userContent.push({ type: 'text', text: "REFERENCE 2 (STYLE): Match this aesthetic." });
//       userContent.push({ type: 'image', image: styleDataUrl });
//     }

//     try {
//       // 3. FIXED CONSOLE LOG (Using the correct keys from StoryboardConcept)
//       console.log(`[Worker ${index + 1}] 📸 Rendering: ${concept.concept_name} using ${concept.layout_style}...`);
      
//       const result = await generateText({
//         model: google('gemini-2.5-flash-image'),
//         messages: [{ role: 'user', content: userContent }],
//         providerOptions: {
//           google: {
//             responseModalities: ["IMAGE"],
//             imageConfig: { aspectRatio: "16:9" },
//             safetySettings: [{ category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }]
//           },
//         },
//       });

//       let imageBuffer: Buffer | null = null;
//       // @ts-ignore
//       if (result.experimental_output?.files?.[0]) {
//         // @ts-ignore
//         imageBuffer = Buffer.from(result.experimental_output.files[0].data, 'base64');
      // } else {
      //   // @ts-ignore
      //   const f = result.files?.find(file => file.mediaType?.startsWith('image/'));
      //   if (f) {
      //     if (f.uint8Array) {
      //       imageBuffer = Buffer.from(f.uint8Array);
      //     } else if (typeof f === 'string') {
      //       imageBuffer = Buffer.from(f, 'base64');
      //     }
      //   }
      // }

//       if (!imageBuffer) throw new Error("Image stream failed.");
      
//       console.log(`[Worker ${index + 1}] ✅ Finished rendering ${concept.concept_name}`);
//       return imageBuffer;

//     } catch (error: any) {
//       console.error(`[Worker ${index + 1}] ❌ Generation Failed: ${error.message}`);
//       return null;
//     }
//   });

//   const results = await Promise.allSettled(generationPromises);
//   const successfulBuffers = results
//     .filter((res): res is PromiseFulfilledResult<Buffer> => res.status === 'fulfilled' && res.value !== null)
//     .map(res => res.value);

//   if (successfulBuffers.length === 0) throw new Error("All rendering pipelines failed. Please check the prompt or API status.");
//   return successfulBuffers;
// };


import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';

// Initialize the Google Generative AI Provider
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// ============================================================================
// 0. INTERFACES & TYPES 
// ============================================================================
export interface GenerateOptions {
  prompt: string;
  title: string;
  count?: number;
  subjectImage?: Buffer; 
  styleImage?: Buffer;   
  mimeType?: string;     
}

interface PRDConcept {
  role_type: "HERO_FIRST" | "STORY_FIRST" | "DIFFERENTIATOR" | "MYSTERY" | "DOCUMENTARY";
  emotion_profile: string;
  composition_layer_1: string; 
  composition_layer_2: string; 
  composition_layer_3: string; 
  text_safe_zone: string;      
}

interface ThumbnailScore {
  face_clarity_score: number;
  story_clarity_score: number;
  mobile_readability_score: number;
  total_ctr_score: number;
  feedback: string;
}

// Helper to convert Buffers to Base64 Data URLs for APIs
const toDataURL = (buf: Buffer, mime: string) => `data:${mime};base64,${buf.toString('base64')}`;

// ============================================================================
// STAGE 1: THE STRATEGIST (Intent Parsing & Role Assignment)
// ============================================================================
async function generateStoryConcepts(prompt: string, title: string, count: number = 3): Promise<PRDConcept[]> {
  const model = google('gemini-2.5-flash');

  const systemPrompt = `
    ROLE: Elite YouTube Thumbnail Strategist.
    TASK: Analyze the prompt: "${prompt}" and Title: "${title}". Generate ${count} distinct strategies.

    CRITICAL: Concept 1 must be a "Safe/Standard" approach. Concept 2 must be an "EXTREME" variant (pushed to the absolute limits of emotion, chaos, or contrast to maximize CTR curiosity). Concept 3 should be a balanced alternative.

    PRD ROLE TYPES (CHOOSE A DIFFERENT ONE FOR EACH CONCEPT):
    1. HERO_FIRST: Face is massive (60% of frame), extreme emotion, story element is secondary.
    2. STORY_FIRST: The event (lion, crash, new car) is massive. Subject is smaller, reacting to it.
    3. DIFFERENTIATOR: Minimalist. Subject cutout, bright solid background, UI elements (arrows/circles).
    4. MYSTERY: Subject looking off-camera, partial/shadowy reveal of the story element.
    5. DOCUMENTARY: Wide context. Environment is highly visible, natural interaction, feels like a real-life vlog.

    --- LEARNING EXAMPLES ---
    - "Delhi to Manali": Use DOCUMENTARY (wide scenic drive) or DIFFERENTIATOR (split screen hot vs cold).
    - "Lion attack on me": Use STORY_FIRST (lion mid-jump) or MYSTERY (hiding behind a rock, scratched face).
    - "Car crash": Use STORY_FIRST (smoking car) or HERO_FIRST (crying in ambulance).
    - "Buying a phone": Use HERO_FIRST (massive smile holding box) or DOCUMENTARY (walking out of store).

    OUTPUT FORMAT (RAW JSON ARRAY ONLY):
    [
      {
        "role_type": "One of the 5 roles",
        "emotion_profile": "Mixed emotion (e.g., Shock + Fear, Joy + Disbelief)",
        "composition_layer_1": "Foreground details (Hero state, size, focus)",
        "composition_layer_2": "Midground details (The interaction or main story element)",
        "composition_layer_3": "Background details (Context, lighting, environment)",
        "text_safe_zone": "Where to place text safely (e.g., 'Top Left Quadrant', 'Bottom Third')"
      }
    ]
  `;

  try {
    const result = await generateText({
      model,
      messages: [{ role: 'user', content: systemPrompt }],
      temperature: 0.7, 
    });
    
    const cleanJson = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson) as PRDConcept[];
  } catch (e) {
    console.error("[Stage 1 Error] Strategist failed, using safe fallbacks.", e);
    return Array(count).fill({
      role_type: "HERO_FIRST",
      emotion_profile: "Highly engaging and expressive",
      composition_layer_1: "Massive expressive hero in the foreground",
      composition_layer_2: `Action related to: ${prompt}`,
      composition_layer_3: "Cinematic, out-of-focus background",
      text_safe_zone: "Top Center"
    });
  }
}

// ============================================================================
// STAGE 1.5: THE ARCHITECT (Prompt Assembly)
// ============================================================================
function buildEngineeringPrompt(concept: PRDConcept, title: string): string {
  return `
    OBJECTIVE: Generate a high-CTR, viral YouTube Thumbnail.
    STRATEGY ROLE: ${concept.role_type}

    COMPOSITION GEOMETRY (CRITICAL - STRICT LAYER ADHERENCE):
    1. **LAYER 1 (EXTREME FOREGROUND):** ${concept.composition_layer_1}. The human emotion (${concept.emotion_profile}) must be painfully clear.
    2. **LAYER 2 (MIDGROUND/INTERACTION):** ${concept.composition_layer_2}.
    3. **LAYER 3 (ENVIRONMENT):** ${concept.composition_layer_3}.

    CINEMATOGRAPHY & REALISM:
    - Style: Photorealistic YouTube vlog aesthetic. High vibrancy, dramatic contrast to separate the subject from the background.
    - Quality: Must look like a real photograph taken on a Sony A7S III. No cheap CGI, 3D renders, or cartoon filters.
    STRICT VALIDATION RULES (MUST OBEY):
    - THE 2-ACTOR RULE: There MUST be one clearly reacting human and one clearly visible story element interacting in the frame.
    - CROP SAFETY: No important subject, face, or focal object may touch the edges of the image. Maintain a 15% safe margin on all sides.
    - NEGATIVE SPACE: Leave the ${concept.text_safe_zone} completely empty and uncluttered for future text overlay.

    THUMBNAIL TYPOGRAPHY (CRITICAL):
    - **TEXT CONTENT:** Render the exact phrase: "${title}"
    - **STYLE:** Big, BOLD, High-Impact YouTube font. High contrast (e.g., Yellow/White with black outline).
    - **PLACEMENT:** ${concept.text_safe_zone}. Ensure absolutely NO text covers the Hero's face.

    CINEMATOGRAPHY:
    - Photorealistic YouTube vlog aesthetic. High vibrancy, dramatic contrast.

    (If an identity reference image is provided, apply that exact facial structure to the hero in Layer 1).
  `;
}

// ============================================================================
// STAGE 3: THE EVALUATOR (QA & CTR Scoring)
// ============================================================================
// async function evaluateThumbnail(imageBuffer: Buffer, promptContext: string, mimeType: string): Promise<ThumbnailScore> {
//   const model = google('gemini-2.5-flash');
  
//   const systemPrompt = `
//     ROLE: YouTube Thumbnail CTR Analyst.
//     TASK: Grade this generated thumbnail based on the core prompt: "${promptContext}".
    
//     SCORING RUBRIC (1-100 for each):
//     1. face_clarity_score: Is there a human face? Is it sharp, expressive, and easily readable at small mobile sizes? (Score < 40 if no face is visible).
//     2. story_clarity_score: Does the image instantly communicate the action or emotion?
//     3. mobile_readability_score: Is there strong contrast? Are the subjects separated clearly from the background?
    
//     Calculate 'total_ctr_score' as the average of the three.

//     OUTPUT FORMAT (RAW JSON ONLY):
//     {
//       "face_clarity_score": 85,
//       "story_clarity_score": 90,
//       "mobile_readability_score": 80,
//       "total_ctr_score": 85,
//       "feedback": "One short sentence explaining the score."
//     }
//   `;

//   try {
//     const imageDataUrl = toDataURL(imageBuffer, mimeType);
    
//     const result = await generateText({
//       model,
//       messages: [
//         { 
//           role: 'user', 
//           content: [
//             { type: 'text', text: systemPrompt },
//             { type: 'image', image: imageDataUrl }
//           ]
//         }
//       ],
//       temperature: 0.1, 
//     });
    
//     const cleanJson = result.text.replace(/```json/g, '').replace(/```/g, '').trim();
//     return JSON.parse(cleanJson) as ThumbnailScore;
//   } catch (e) {
//     console.error("[Stage 3 Error] Evaluator failed.", e);
//     return { face_clarity_score: 75, story_clarity_score: 75, mobile_readability_score: 75, total_ctr_score: 75, feedback: "Evaluation unavailable." };
//   }
// }
// Replaces the old evaluateThumbnail function
async function evaluateThumbnail(imageBuffer: Buffer, promptContext: string, mimeType: string, roleType: string): Promise<ThumbnailScore> {
  const model = google('gemini-2.5-flash');
  
  const systemPrompt = `
    ROLE: YouTube Thumbnail CTR Analyst.
    TASK: Grade this thumbnail against the prompt: "${promptContext}".
    
    SCORING RUBRIC (1-100 for each):
    1. face_clarity_score: Is the human face sharp, expressive, and readable? (Score severely low if missing or cut off).
    2. story_clarity_score: Is the core event instantly recognizable?
    3. mobile_readability_score: Is there strong contrast? Are subjects separated from the background?

    OUTPUT FORMAT (RAW JSON ONLY):
    {
      "face_clarity_score": 85,
      "story_clarity_score": 90,
      "mobile_readability_score": 80,
      "feedback": "Reasoning here."
    }
  `;

  try {
    const result = await generateText({
      model,
      messages: [{ role: 'user', content: [{ type: 'text', text: systemPrompt }, { type: 'image', image: toDataURL(imageBuffer, mimeType) }] }],
      temperature: 0.1, 
    });
    
    const rawScores = JSON.parse(result.text.replace(/```json/g, '').replace(/```/g, '').trim());
    
    // APPLY ROLE-SPECIFIC WEIGHTS (PRD Feature 4)
    let weightedCtr = 0;
    if (roleType === "HERO_FIRST") {
      weightedCtr = (rawScores.face_clarity_score * 1.4) + (rawScores.story_clarity_score * 0.8) + (rawScores.mobile_readability_score * 0.8);
    } else if (roleType === "STORY_FIRST") {
      weightedCtr = (rawScores.face_clarity_score * 0.8) + (rawScores.story_clarity_score * 1.4) + (rawScores.mobile_readability_score * 0.8);
    } else if (roleType === "DIFFERENTIATOR") {
      weightedCtr = (rawScores.face_clarity_score * 0.8) + (rawScores.story_clarity_score * 0.8) + (rawScores.mobile_readability_score * 1.4);
    } else {
      weightedCtr = rawScores.face_clarity_score + rawScores.story_clarity_score + rawScores.mobile_readability_score;
    }

    // Normalize back to a 100-point scale
    const finalCtrScore = Math.round(weightedCtr / 3);

    return {
      ...rawScores,
      total_ctr_score: finalCtrScore,
      feedback: rawScores.feedback
    };
  } catch (e) {
    return { face_clarity_score: 70, story_clarity_score: 70, mobile_readability_score: 70, total_ctr_score: 70, feedback: "Evaluation unavailable." };
  }
}

// ============================================================================
// MASTER ORCHESTRATOR (Strictly returns Promise<Buffer[]>)
// ============================================================================
// export const generateThumbnailBatch = async (options: GenerateOptions): Promise<Buffer[]> => {
//   const { prompt, title, count = 3, subjectImage, styleImage, mimeType = 'image/jpeg' } = options;
  
//   if (!title) throw new Error("Title is required for thumbnail generation.");

//   console.log(`[AI Engine] 🧠 Diagnosing strategy for: "${prompt}"...`);
  
//   // 1. Get Strategies
//   const concepts = await generateStoryConcepts(prompt, title, count);
  
//   const subjectDataUrl = subjectImage ? toDataURL(subjectImage, mimeType) : null;
//   const styleDataUrl = styleImage ? toDataURL(styleImage, mimeType) : null;

//   // 2. Render Images Concurrently
//   const generationPromises = concepts.map(async (concept, index) => {
//     const systemInstruction = buildEngineeringPrompt(concept, title);

//     const userContent: Array<{ type: 'text'; text: string } | { type: 'image'; image: string }> = [
//       { type: 'text', text: systemInstruction }
//     ];

//     if (subjectDataUrl) {
//       userContent.push({ type: 'text', text: "REFERENCE 1 (IDENTITY): Lock this face to the hero." });
//       userContent.push({ type: 'image', image: subjectDataUrl });
//     }
//     if (styleDataUrl) {
//       userContent.push({ type: 'text', text: "REFERENCE 2 (STYLE): Match this aesthetic." });
//       userContent.push({ type: 'image', image: styleDataUrl });
//     }

//     try {
//       console.log(`[Worker ${index + 1}] 📸 Rendering Role: ${concept.role_type}...`);
      
//       const result = await generateText({
//         model: google('gemini-2.5-flash-image'),
//         messages: [{ role: 'user', content: userContent }],
//         providerOptions: {
//           google: {
//             responseModalities: ["IMAGE"],
//             imageConfig: { aspectRatio: "16:9" },
//             safetySettings: [{ category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }]
//           },
//         },
//       });

//       let imageBuffer: Buffer | null = null;
//       // @ts-ignore
//       if (result.experimental_output?.files?.[0]) {
//         // @ts-ignore
//         imageBuffer = Buffer.from(result.experimental_output.files[0].data, 'base64');
//       } else {
//         // @ts-ignore
//         const f = result.files?.find(file => file.mediaType?.startsWith('image/'));
//         if (f) {
//           if (f.uint8Array) {
//             imageBuffer = Buffer.from(f.uint8Array);
//           } else if (typeof f === 'string') {
//             imageBuffer = Buffer.from(f, 'base64');
//           }
//         }
//       }

//       if (!imageBuffer) throw new Error("No image data returned.");
//       return { buffer: imageBuffer, concept };

//     } catch (error: any) {
//       console.error(`[Worker ${index + 1}] ❌ Render Failed: ${error.message}`);
//       return null;
//     }
//   });

//   const rawResults = await Promise.allSettled(generationPromises);
//   const successfulRenders = rawResults
//     .filter((res): res is PromiseFulfilledResult<{buffer: Buffer, concept: PRDConcept}> => res.status === 'fulfilled' && res.value !== null)
//     .map(res => res.value);

//   if (successfulRenders.length === 0) throw new Error("All rendering pipelines failed.");

//   console.log(`[AI Engine] 📊 Stage 3: Running Vision Evaluator on ${successfulRenders.length} images...`);

//   // 3. Evaluate each image to get a CTR score
//   const evaluatedResults = await Promise.all(
//     successfulRenders.map(async ({ buffer }) => {
//       const score = await evaluateThumbnail(buffer, prompt, mimeType);
//       return { buffer, score };
//     })
//   );

//   // 4. Sort internally by Highest CTR Score
//   evaluatedResults.sort((a, b) => b.score.total_ctr_score - a.score.total_ctr_score);

//   console.log(`[AI Engine] ✅ Batch complete. Returning purely sorted Buffers. Top score was: ${evaluatedResults[0].score.total_ctr_score}/100`);
  
//   // 5. Return strictly the Promise<Buffer[]> array
//   return evaluatedResults.map(res => res.buffer);
// };

// ============================================================================
// MASTER ORCHESTRATOR (Strictly returns Promise<Buffer[]>)
// ============================================================================
export const generateThumbnailBatch = async (options: GenerateOptions): Promise<Buffer[]> => {
  const { prompt, title, count = 3, subjectImage, styleImage, mimeType = 'image/jpeg' } = options;
  
  if (!title) throw new Error("Title is required for thumbnail generation.");

  console.log(`[AI Engine] 🧠 Diagnosing strategy for: "${prompt}"...`);
  
  // 1. Get Strategies
  const concepts = await generateStoryConcepts(prompt, title, count);
  
  const toDataURL = (buf: Buffer, mime: string) => `data:${mime};base64,${buf.toString('base64')}`;
  const subjectDataUrl = subjectImage ? toDataURL(subjectImage, mimeType) : null;
  const styleDataUrl = styleImage ? toDataURL(styleImage, mimeType) : null;

  // 2. Render Images Concurrently
  const generationPromises = concepts.map(async (concept, index) => {
    // Stage 1.5 - Build the prompt (No text overlay, strict 2-actor rule)
    const systemInstruction = buildEngineeringPrompt(concept, title);

    const userContent: Array<{ type: 'text'; text: string } | { type: 'image'; image: string }> = [
      { type: 'text', text: systemInstruction }
    ];

    if (subjectDataUrl) {
      userContent.push({ type: 'text', text: "REFERENCE 1 (IDENTITY): Lock this face to the hero." });
      userContent.push({ type: 'image', image: subjectDataUrl });
    }
    if (styleDataUrl) {
      userContent.push({ type: 'text', text: "REFERENCE 2 (STYLE): Match this aesthetic." });
      userContent.push({ type: 'image', image: styleDataUrl });
    }

    try {
      console.log(`[Worker ${index + 1}] 📸 Rendering Role: ${concept.role_type}...`);
      
      const result = await generateText({
        model: google('gemini-2.5-flash-image'),
        messages: [{ role: 'user', content: userContent }],
        providerOptions: {
          google: {
            responseModalities: ["IMAGE"],
            imageConfig: { aspectRatio: "16:9" },
            safetySettings: [{ category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }]
          },
        },
      });

      let imageBuffer: Buffer | null = null;
      // @ts-ignore
      if (result.experimental_output?.files?.[0]) {
        // @ts-ignore
        imageBuffer = Buffer.from(result.experimental_output.files[0].data, 'base64');
      } else {
        // @ts-ignore
        const f = result.files?.find(file => file.mediaType?.startsWith('image/'));
        if (f) {
          if (f.uint8Array) {
            imageBuffer = Buffer.from(f.uint8Array);
          } else if (typeof f === 'string') {
            imageBuffer = Buffer.from(f, 'base64');
          }
        }
      }

      if (!imageBuffer) throw new Error("No image data returned.");
      
      // We pass the concept alongside the buffer so the Evaluator knows the role!
      return { buffer: imageBuffer, concept };

    } catch (error: any) {
      console.error(`[Worker ${index + 1}] ❌ Render Failed: ${error.message}`);
      return null;
    }
  });

  const rawResults = await Promise.allSettled(generationPromises);
  const successfulRenders = rawResults
    .filter((res): res is PromiseFulfilledResult<{buffer: Buffer, concept: any}> => res.status === 'fulfilled' && res.value !== null)
    .map(res => res.value);

  if (successfulRenders.length === 0) throw new Error("All rendering pipelines failed.");

  console.log(`[AI Engine] 📊 Stage 3: Running Vision Evaluator on ${successfulRenders.length} images...`);

  // 3. Evaluate each image to get a CTR score (NOW PASSING ROLE TYPE)
  const evaluatedResults = await Promise.all(
    successfulRenders.map(async ({ buffer, concept }) => {
      // FIX: Passing concept.role_type as the 4th parameter
      const score = await evaluateThumbnail(buffer, prompt, mimeType, concept.role_type);
      return { buffer, score };
    })
  );

  // 4. Sort internally by Highest Weighted CTR Score
  evaluatedResults.sort((a, b) => b.score.total_ctr_score - a.score.total_ctr_score);

  console.log(`[AI Engine] ✅ Batch complete. Returning sorted Buffers. Top score: ${evaluatedResults[0].score.total_ctr_score}/100`);
  
  // 5. Return strictly the Promise<Buffer[]> array
  return evaluatedResults.map(res => res.buffer);
};
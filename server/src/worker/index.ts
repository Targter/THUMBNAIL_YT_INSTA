

// import dotenv from "dotenv";
// import path from "path";
// dotenv.config({
//   path: path.resolve(__dirname, "../../.env"),
// });
// // console.log("ENV CHECK:", {
// //   cwd: process.cwd(),
// //   dirname: __dirname,
// //   SUPABASE_URL: process.env.SUPABASE_URL,
// // });
// import { Worker } from 'bullmq';
// import { createRedisClient } from '../config/redis';
// import { supabaseAdmin } from '../config/supabase';
// import { JobData } from '../types/db';
// import { generateThumbnailBatch } from './aiService'; // <--- NEW IMPORT



// const WORKER_NAME = 'thumbnail-generation';
// const redisConnection = createRedisClient('bull');

// const worker = new Worker<JobData>(WORKER_NAME, async (job) => {
//   console.log(`[Worker] Starting Job ${job.id}`);
//   const { jobId, userId, prompt, count, contextImagePath ,  isEdit, sourceImageUrl } = job.data;
//   const publisher = createRedisClient('producer');
//   console.log(prompt,count,contextImagePath,isEdit,sourceImageUrl)
//   try {
//     // 1. Notify Processing
//     await supabaseAdmin.from('jobs').update({ status: 'processing' }).eq('id', jobId);
//     await publisher.publish(`job:${jobId}`, JSON.stringify({ status: 'processing', progress: 10 }));

//     // 2. Download Context Image (If exists)
//     // let contextBuffer: Buffer | undefined;
//     let mimeType = 'image/png';
//     let contextBuffer: Buffer | undefined;

//     try{

    
//     if (sourceImageUrl) {
//       console.log(`[Worker] Downloading source image for context: ${sourceImageUrl}`);
//       try {
//         // We use fetch because the URL might be a Supabase Public URL or an External URL
//         const response = await fetch(sourceImageUrl);
//         if (!response.ok) throw new Error("Failed to download source image");
//         const arrayBuffer = await response.arrayBuffer();
//         contextBuffer = Buffer.from(arrayBuffer);
//         // 
//         const contentType = response.headers.get('content-type');
//         if (contentType) mimeType = contentType;
//       } catch (err) {
//         console.error("Error downloading context image:", err);
//         // We continue without context, or throw error depending on strictness
//         throw new Error("Could not retrieve the image to edit.");
//       }
//     }

//     else if (contextImagePath) {
//       const { data } = await supabaseAdmin.storage.from('uploads').download(contextImagePath);
//       if (data) contextBuffer = Buffer.from(await data.arrayBuffer());
//        if (contextImagePath.match(/\.(jpg|jpeg)$/i)) mimeType = 'image/jpeg';
//     }
//   }
//     catch (err) {
//       console.warn(`[Worker] Warning: Context image download failed. Proceeding without image.`, err);
//       // We do not throw here to allow text-only generation if image fails
//     }

//     // 3. Generate Images (The AI Step)
//     await publisher.publish(`job:${jobId}`, JSON.stringify({ status: 'processing', progress: 30 }));
    
//     // NOTE: If using the Vercel AI SDK Google provider, ensure the model name matches what you have access to.
    
//     // e.g., 'gemini-1.5-pro' (multimodal) or specific image models.
//     const generatedBuffers = await generateThumbnailBatch({
//       prompt,
//       count: count || 3,
//       contextImage: contextBuffer,
//       mimeType,
//        isEdit: isEdit || false
//     });
//     // const generatedBuffers : any  = [];
//     console.log("gettign the iamge : and chekcing the fixes..")

//     if (generatedBuffers.length === 0) {
//       console.warn("[Worker] AI returned no images, using placeholders for Dev.");
//     }

//     // 4. Upload Results to Supabase
//     const generations = [];
    
//     for (let i = 0; i < generatedBuffers.length; i++) {
//       const fileName = `${userId}/${jobId}/gen_${i}_${Date.now()}.png`;
      
//       const { error: upErr } = await supabaseAdmin.storage
//         .from('thumbnails')
//         .upload(fileName, generatedBuffers[i], { 
//           contentType: 'image/png',
//           upsert: true
//         });

//       if (upErr) throw upErr;
      

//       generations.push({
//         job_id: jobId,
//         user_id: userId,
//         image_path: fileName,
//         seed: 0,
//         cfg_scale: 0,
//         steps: 0
//       });

//       // Update progress
//       const progress = 30 + ((i + 1) / generatedBuffers.length * 60);
//       await publisher.publish(`job:${jobId}`, JSON.stringify({ status: 'processing', progress }));
//     }

//     // 5. Save Metadata & Complete
//     if (generations.length > 0) {
//         await supabaseAdmin.from('generations').insert(generations);
//     }
    
//     await supabaseAdmin.from('jobs').update({ status: 'completed' }).eq('id', jobId);
//     await publisher.publish(`job:${jobId}`, JSON.stringify({ status: 'completed', progress: 100 }));

//     console.log(`[Worker] Job ${jobId} Completed`);

//   } catch (error: any) {
//     console.error(`[Worker] Job ${jobId} Failed`, error);
//     await supabaseAdmin.from('jobs').update({ status: 'failed', error_message: error.message }).eq('id', jobId);
//     await publisher.publish(`job:${jobId}`, JSON.stringify({ status: 'failed', error: error.message }));
//   } finally {
//     publisher.quit();
//   }
// }, { connection: redisConnection, concurrency: 2 });

import dotenv from "dotenv";
import path from "path";
const envPath = path.resolve(__dirname, "../../.env"); 
dotenv.config({ path: envPath });

// Debug Log to confirm it worked
console.log("Worker Env Loaded Project ID:", process.env.GCP_PROJECT_ID); 
// console.log("ENV CHECK:", {
//   cwd: process.cwd(),
//   dirname: __dirname,
//   SUPABASE_URL: process.env.SUPABASE_URL,
// });
import { Worker } from 'bullmq';
import fetch from 'node-fetch';
import { createRedisClient } from '../config/redis';
import { supabaseAdmin } from '../config/supabase';
import { JobData } from '../types/db';
import { generateThumbnailBatch } from './aiServicessss';

const WORKER_NAME = 'thumbnail-generation';
const redisConnection = createRedisClient('bull');

const worker = new Worker<JobData>(WORKER_NAME, async (job) => {
  console.log(`[Worker] Starting Job ${job.id}`);
  
  const { 
    jobId, userId, prompt, count, isEdit, 
    contextImagePath, // Subject (Face/Product)
    styleImagePath,   // Style (Favorite)
    sourceImageUrl    // Edit Target
  } = job.data;
  // console.log("jobData:",job.data)
  const publisher = createRedisClient('producer');

  try {
    // 1. Processing Status
    await supabaseAdmin.from('jobs').update({ status: 'processing' }).eq('id', jobId);
    await publisher.publish(`job:${jobId}`, JSON.stringify({ status: 'processing', progress: 10 }));

    // ---------------------------------------------------------
    // 2. DOWNLOAD ASSETS
    // ---------------------------------------------------------
    
    // A. SUBJECT (Context)
    let subjectBuffer: any ;
    console.log("contextImage:",contextImagePath)
    if (contextImagePath) {
      console.log(`[Worker] Fetching Subject: ${contextImagePath}`);
      const { data } = await supabaseAdmin.storage.from('uploads').download(contextImagePath);
      console.log("dataofsubjectImage;",data)
      console.log("data:contextImage:",data)
      if (data) subjectBuffer = Buffer.from(await data.arrayBuffer());
    }


    // B. STYLE (Favorite)
    let styleBuffer: Buffer | undefined;
    if (styleImagePath) {
      console.log(`[Worker] Fetching Style: ${styleImagePath}`);
      // Try thumbnails bucket first (generated), then uploads
      let { data } = await supabaseAdmin.storage.from('uploads').download(styleImagePath);
      console.log("data in styleimagepath:",styleImagePath)
      
      if (!data) {
        const res = await supabaseAdmin.storage.from('uploads').download(styleImagePath);
        data = res.data;
        console.log("styleImagePath Not found so hceck from uploads : ",data)
      }
      console.log("style image exit")
      if (data) styleBuffer = Buffer.from(await data.arrayBuffer());
    }

    // C. EDIT SOURCE
    let sourceBuffer: Buffer | undefined;
    if (sourceImageUrl) {
      const res = await fetch(sourceImageUrl);
      if (res.ok) sourceBuffer = Buffer.from(await res.arrayBuffer());
      console.log("source:imaegOfund: for editing....",res)
    }

    // ---------------------------------------------------------
    // 3. EXECUTE VERTEX AI PIPELINE
    // ---------------------------------------------------------
    await publisher.publish(`job:${jobId}`, JSON.stringify({ status: 'processing', progress: 40 }));

    // const generatedBuffers = await generateThumbnailBatch({
    //   prompt,
    //   count: count || 3,
    //   contextImage: subjectBuffer, // The Face
    //   // subjectImage: subjectBuffer, // The Face
    //   // styleImage: styleBuffer,     // The Vibe
    //   // sourceImage: sourceBuffer,   // The Edit
    //   isEdit: isEdit
    // });

    const generatedBuffers = await generateThumbnailBatch({
    prompt: prompt,
    title: "Went to manali",
    count: 3,
    subjectImage: subjectBuffer,   // THE FACE (Identity)
    styleImage: styleBuffer,     // The Face (Identity Lock)
    // contextImage: subjectBuffer
    // styleImage: coolStyle, // The Vibe (Style Lock)
  });
  //  const generatedBuffers = await generateThumbnailBatch({
  //   prompt: prompt,
  //   // title: "Living with a lion for a Day",
  //   count: 1,
  //   contextImage: subjectBuffer,   // THE FACE (Identity)
  //   // styleImage: styleBuffer,     // The Face (Identity Lock)
  //   // styleImage: coolStyle, // The Vibe (Style Lock)
  // });

    // ---------------------------------------------------------
    // 4. UPLOAD RESULTS
    // ---------------------------------------------------------
    const generations = [];
    for (let i = 0; i < generatedBuffers.length; i++) {
      const buffer = generatedBuffers[i];
      if (!buffer) {
        console.warn(`[Worker] Generated buffer ${i} is null, skipping upload`);
        continue;
      }

      const fileName = `${userId}/${jobId}/gen_${i}_${Date.now()}.png`;
      const { error: upErr } = await supabaseAdmin.storage
        .from('thumbnails')
        .upload(fileName, buffer, { contentType: 'image/png' });

      if (upErr) throw upErr;

      generations.push({
        job_id: jobId,
        user_id: userId,
        image_path: fileName,
        seed: 0, cfg_scale: 0, steps: 0
      });
      
      const progress = 40 + ((i + 1) / generatedBuffers.length * 50);
      await publisher.publish(`job:${jobId}`, JSON.stringify({ status: 'processing', progress }));
    }

    await supabaseAdmin.from('generations').insert(generations);
    await supabaseAdmin.from('jobs').update({ status: 'completed' }).eq('id', jobId);
    await publisher.publish(`job:${jobId}`, JSON.stringify({ status: 'completed', progress: 100 }));
    
    console.log(`[Worker] Job ${jobId} Completed`);

  } catch (error: any) {
    console.error(`[Worker] Job ${jobId} Failed`, error);
    await supabaseAdmin.from('jobs').update({ status: 'failed', error_message: error.message }).eq('id', jobId);
    await publisher.publish(`job:${jobId}`, JSON.stringify({ status: 'failed', error: error.message }));
  } finally {
    publisher.quit();
  }
}, { connection: redisConnection, concurrency: 5 });
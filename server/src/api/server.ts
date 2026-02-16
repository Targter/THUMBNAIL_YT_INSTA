
import dotenv from "dotenv";
import path from "path";
import multer from 'multer';
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});
console.log("ENV CHECK:", {
  cwd: process.cwd(),
  dirname: __dirname,
  SUPABASE_URL: process.env.SUPABASE_URL,
});

// server\.env server\.env
// dotenv.config({ path: "../.env" });
// dotenv.config({path:".././env"})
// dotenv.config()
import express from 'express';
import cors from 'cors';
import { Queue } from 'bullmq';
import { sseManager } from './sse';
import { supabaseAdmin } from '../config/supabase';
import { createRedisClient } from '../config/redis';

const app = express();

const upload = multer({ storage: multer.memoryStorage() });

// 
app.use(cors({origin: 'http://localhost:5173', // Allow your frontend
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']}));
app.use(express.json());

// Job Queue Producer
const jobQueue = new Queue('thumbnail-generation', { 
  connection: createRedisClient('producer') 
});

// --- MIDDLEWARE: Auth Guard ---
const requireAuth = async (req: any, res: any, next: any) => {
  console.log("auth called")
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "Missing Token" });

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: "Unauthorized" });

  req.user = user;
  next();
};

// // --- ROUTE 1: GENERATE (POST) ---
// app.post('/api/generate', requireAuth,upload.single('contextImage'), async (req: any, res: any) => {
//   console.log("generatefunction Called...")
//   const { prompt, platform ,userUpload} = req.body;
//   const file = req.file;

  
//   console.log(prompt,platform,userUpload)
  
//   console.log("response from generate.")
//   console.log("file:",file)
//   const userId = req.user.id;
//   const COST = 1;
//  // 1. Upload Context Image (if exists)
//   let contextImagePath = null;
//   if (file) {
//     const ext = file.originalname.split('.').pop();
//     const path = `${userId}/uploads/${Date.now()}.${ext}`;
    
//     const { error: uploadError } = await supabaseAdmin.storage
//       .from('uploads') // Make sure this bucket exists in Supabase
//       .upload(path, file.buffer, { contentType: file.mimetype });
      
//     if (!uploadError) contextImagePath = path;
//   }
//   console.log("Image:",contextImagePath)
//   // 1. Deduct Credits (Atomic RPC)
//   const { data: success, error: rpcError } = await supabaseAdmin.rpc('handle_generation_request', {
//     p_user_id: userId,
//     p_cost: COST,
//     p_description: `Generated 3 variations for ${platform}`
//   });

//   console.log("supabase:data:",success)

//   if (rpcError) return res.status(500).json({ error: rpcError.message });
//   if (!success) return res.status(402).json({ error: "Insufficient credits" });

//   // 2. Create Job Record
//   console.log("Job Recorded starting.. ")

//   // add in db.. 
//   const { data: job, error: jobError } = await supabaseAdmin
//     .from('jobs')
//     .insert({
//       user_id: userId,
//       prompt,
//       platform,
//       context_image_path:contextImagePath,
//       status: 'pending'
//     })
//     .select()
//     .single();

//     console.log("Job Recorded Ending...")
//   // if (jobError) return res.status(500).json({ error: "Failed to create job" });

//   // 3. Enqueue Job
//   // in the redis ioredis tab
//   // console.log("ioredis Addition:",job.id,userId,prompt,platform)
//   await jobQueue.add('generate-batch', {
//     jobId: job.id,
//     userId,
//     prompt,
//     contextImagePath,
//     platform,
//     count: 3
//   });

//   console.log("job Queuedd return and return the data to the frontend")

//   res.status(202).json({ jobId: job.id });
//   // res.status(202).json({ jobId: "image verify"});
// });

// // ROUTE: EDIT POST 
// app.post('/api/edit', requireAuth, multer().none(),async (req: any, res: any) => {
//   // console.log("called... api edit called..")
//   // console.log(req.body)
//   const { prompt, platform, imageUrl } = req.body; // <--- Accepting URL now
//   const userId = req.user.id;
//   const COST = 1;

//   // console.log("imageUrl:",imageUrl)

//   if (!imageUrl) return res.status(400).json({ error: "No image URL provided" });

//   // 1. Deduct Credits
//   const { data: success } = await supabaseAdmin.rpc('handle_generation_request', {
//     p_user_id: userId,
//     p_cost: COST,
//     p_description: `AI Edit Request`
//   });

//   if (!success) return res.status(402).json({ error: "Insufficient credits" });

//   // 2. Create Job Record
//   // We store the 'imageUrl' in context_image_path so we know what was edited
//   const { data: job, error: jobError } = await supabaseAdmin
//     .from('jobs')
//     .insert({
//       user_id: userId,
//       prompt: prompt,
//       platform: platform,
//       context_image_path: imageUrl, // Storing the Source URL
//       status: 'pending'
//     })
//     .select()
//     .single();

//   if (jobError) return res.status(500).json({ error: "Failed to create job" });

//   console.log("job Adding to queue")
//   // 3. Queue Job
//   await jobQueue.add('generate-batch', {
//     jobId: job.id,
//     userId,
//     prompt,
//     platform,
//     count: 1, // Edits usually produce 1 result
//     isEdit: true, // Flag for Worker
//     sourceImageUrl: imageUrl // <--- Pass the URL to the worker
//   });
//   console.log("job added to queueu")

//   res.status(202).json({ jobId: job.id });
// });

// // --- ROUTE 2: STREAM (SSE) ---
// app.get('/api/jobs/:jobId/stream', (req, res) => {
//   const { jobId } = req.params;
  
//   // Headers for SSE
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');
//   res.flushHeaders();

//   sseManager.subscribe(jobId, res);
// });


// // --- ROUTE 3: GET RESULTS ---
// app.get('/api/jobs/:jobId', requireAuth, async (req: any, res: any) => {
//   const { jobId } = req.params;

//   // 1. Get Job
//   console.log("jobId:",jobId)
  
//   const { data: job, error } = await supabaseAdmin
//     .from('jobs')
//     .select('*')
//     .eq('id', jobId)
//     .single();
//     // console.log("job: JOb :",job)

//   if (error) return res.status(404).json({ error: "Job not found" });

//   // 2. Get Generations (if completed)
//   let imageUrls: string[] = [];
  
//   if (job.status === 'completed') {
//     const { data: gens } = await supabaseAdmin
//       .from('generations')
//       .select('image_path, seed') // or public_url if you stored it
//       .eq('job_id', jobId);

//     // MOCK: In production, generate Signed URLs here if bucket is private
//     // For now, we mock the return since the worker saved mock paths
//     imageUrls = gens?.map(g => {
//         // If it starts with http (from our mock worker), use it
//         if(g.image_path.startsWith('http')) return g.image_path;
//         // Else construct supabase storage url
//         return `${process.env.SUPABASE_URL}/storage/v1/object/public/thumbnails/${g.image_path}`;
//     }) || [];
//   }
//   console.log("johbIlajurLs",imageUrls)

//   res.json({
//     jobId: job.id,
//     status: job.status,
//     result: job.status === 'completed' ? { imageUrls, creditsRemaining: 0 } : null
//   });
// });
// // route 4 : uplaod and get images 
// // --- 3. GET FAVORITES ROUTE ---

// // ... imports (express, multer, supabaseAdmin, etc)

// // --- 1. GET FAVORITES (The Join Logic) ---
// app.get('/api/favorites', requireAuth, async (req: any, res: any) => {
//   try {
//     const userId = req.user.id;

//     // FIX: Nested join. 
//     // Favorites -> links to Generations -> links to Jobs (where the prompt is)
//     const { data, error } = await supabaseAdmin
//       .from('favorites')
//       .select(`
//         *,
//         generations (
//           jobs (
//             prompt,
//             platform
//           )
//         )
//       `)
//       .eq('user_id', userId)
//       .order('created_at', { ascending: false });

//     if (error) throw error;

//     // MAPPING: Dig deeper into the nested object
//     const formattedData = data.map((fav: any) => {
//       // Safely access the nested job data
//       // Note: Depending on your foreign keys, 'jobs' might be an object or an array. 
//       // Usually usually it's an object if generation belongs to one job.
//       const aiData = fav.generations?.jobs;
      
//       // Handle case where jobs might be an array (rare but possible in Supabase types)
//       const jobDetails = Array.isArray(aiData) ? aiData[0] : aiData;

//       return {
//         id: fav.id,
//         image_url: fav.public_url,
//         created_at: fav.created_at,
//         is_uploaded: fav.is_uploaded,
        
//         // Logic: If uploaded, use text. If AI, look inside generations -> jobs
//         prompt: fav.is_uploaded 
//           ? "User Uploaded Asset" 
//           : (jobDetails?.prompt || "Saved AI Asset"),

//         platform: fav.is_uploaded 
//           ? "custom" 
//           : (jobDetails?.platform || "youtube")
//       };
//     });

//     // console.log("formamatedData:",formattedData)

//     res.json(formattedData);

//   } catch (error: any) {
//     console.error("Fetch favorites failed:", error);
//     res.status(500).json({ error: error.message });
//   }
// });
// // --- 2. UPLOAD FAVORITE (User Uploads) ---
// // --- 2. UPLOAD FAVORITE (User Manually Uploads an Image) ---
// app.post('/api/favorites', requireAuth, upload.single('image'), async (req: any, res: any) => {
//   try {
//     const userId = req.user.id;
//     const file = req.file;

//     if (!file) return res.status(400).json({ error: "No image provided" });

//     // 1. Upload to Supabase Storage ('uploads' bucket)
//     const ext = file.originalname.split('.').pop();
//     const storagePath = `${userId}/favorites/${Date.now()}.${ext}`;

//     const { error: uploadError } = await supabaseAdmin.storage
//       .from('uploads') // Make sure you created 'uploads' bucket in Supabase
//       .upload(storagePath, file.buffer, {
//         contentType: file.mimetype,
//         upsert: true
//       });

//     if (uploadError) throw uploadError;

//     // 2. Get Public URL
//     const { data: urlData } = supabaseAdmin.storage
//       .from('uploads')
//       .getPublicUrl(storagePath);

//     // 3. Insert into DB
//     const { data: insertedData, error: dbError } = await supabaseAdmin
//       .from('favorites')
//       .insert({
//         user_id: userId,
//         image_path: storagePath,
//         public_url: urlData.publicUrl,
//         is_uploaded: true,      // MARK AS UPLOADED
//         generation_id: null     // No AI generation link
//       })
//       .select()
//       .single();

//     if (dbError) throw dbError;

//     res.json(insertedData);

//   } catch (error: any) {
//     console.error("Upload failed:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // --- 3. DELETE FAVORITE ---
// app.delete('/api/favorites/:id', requireAuth, async (req: any, res: any) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;

//     // 1. Fetch the favorite to check its type (Uploaded vs AI)
//     const { data: fav, error: fetchError } = await supabaseAdmin
//       .from('favorites')
//       .select('image_path, is_uploaded')
//       .eq('id', id)
//       .eq('user_id', userId)
//       .single();

//     if (fetchError || !fav) return res.status(404).json({ error: "Not found" });

//     // 2. STORAGE CLEANUP LOGIC
//     // If it was a USER UPLOAD, delete the file to save space.
//     // If it was an AI GENERATION, keep the file (it belongs to generation history), just remove the favorite.
//     if (fav.is_uploaded && fav.image_path) {
//       await supabaseAdmin.storage
//         .from('uploads')
//         .remove([fav.image_path]);
//     }

//     // 3. Delete from Database
//     const { error: deleteError } = await supabaseAdmin
//       .from('favorites')
//       .delete()
//       .eq('id', id);

//     if (deleteError) throw deleteError;

//     res.json({ success: true });

//   } catch (error: any) {
//     console.error("Delete failed:", error);
//     res.status(500).json({ error: error.message });
//   }
// });

// // --- 4. SAVE AI GENERATION TO FAVORITES ---
// app.post('/api/favorites/save', requireAuth, async (req: any, res: any) => {
//   try {
//     const userId = req.user.id;
//     // Expecting these from the frontend when clicking "Heart"
//     const { generationId, imageUrl, storagePath } = req.body;

//     if (!generationId || !imageUrl) {
//       return res.status(400).json({ error: "Missing generation data" });
//     }

//     // Insert into Favorites
//     // We link it to generation_id so the GET route can pull the Prompt later
//     const { data, error } = await supabaseAdmin
//       .from('favorites')
//       .insert({
//         user_id: userId,
//         image_path: storagePath, // Path in 'thumbnails' bucket
//         public_url: imageUrl,
//         is_uploaded: false,      // IT IS AI
//         generation_id: generationId 
//       })
//       .select()
//       .single();

//     if (error) {
//       // Handle duplicate saves gracefully
//       if (error.code === '23505') { // Unique violation
//         return res.status(200).json({ message: "Already saved" });
//       }
//       throw error;
//     }

//     res.json(data);
//   } catch (error: any) {
//     console.error("Save failed:", error);
//     res.status(500).json({ error: error.message });
//   }
// });


// --- ROUTE 1: GENERATE (POST) ---
app.post('/api/generate', requireAuth, upload.single('userFile'), async (req: any, res: any) => {
  const { prompt, platform, useStyleRef, styleId } = req.body;
  const file = req.file; // Context/Subject Image
  const userId = req.user.id;
  const COST = 1;

  // 1. Upload Context Image (Subject)
  let contextImagePath = null;
  if (file) {
    const ext = file.originalname.split('.').pop() || 'png';
    const path = `${userId}/uploads/${Date.now()}.${ext}`;
    
    const { error: uploadError } = await supabaseAdmin.storage
      .from('uploads')
      .upload(path, file.buffer, { contentType: file.mimetype });
      
    if (!uploadError) contextImagePath = path;
  }

  // 2. Resolve Style Reference (Favorite)
  let styleImagePath = null;
  if (useStyleRef === 'true' || useStyleRef === true) {
    let query = supabaseAdmin.from('favorites').select('image_path').eq('user_id', userId);
    
    // If specific ID passed (from "Use Style" button), use it. Else latest.
    if (styleId) query = query.eq('id', styleId);
    else query = query.order('created_at', { ascending: false }).limit(1);
    
    const { data: favs } = await query.single();
    if (favs) styleImagePath = favs.image_path;
  }

  // 3. Deduct Credits
  const { data: success, error: rpcError } = await supabaseAdmin.rpc('handle_generation_request', {
    p_user_id: userId,
    p_cost: COST,
    p_description: `Generated 3 variations for ${platform}`
  });

  if (rpcError) return res.status(500).json({ error: rpcError.message });
  if (!success) return res.status(402).json({ error: "Insufficient credits" });

  // 4. Create Job Record
  const { data: job, error: jobError } = await supabaseAdmin
    .from('jobs')
    .insert({
      user_id: userId,
      prompt,
      platform,
      context_image_path: contextImagePath, // Subject
      status: 'pending'
    })
    .select()
    .single();

  if (jobError) return res.status(500).json({ error: "Failed to create job" });

  // 5. Enqueue Job
  await jobQueue.add('generate-batch', {
    jobId: job.id,
    userId,
    prompt,
    platform,
    count: 3,
    contextImagePath, // SUBJECT
    styleImagePath    // STYLE (New Field)
  });

  res.status(202).json({ jobId: job.id });
});

// --- ROUTE 2: MAGIC EDIT (POST) ---
app.post('/api/edit', requireAuth, async (req: any, res: any) => {
  // Using JSON body since we pass a URL
  const { prompt, platform, imageUrl } = req.body;
  const userId = req.user.id;
  const COST = 1;

  if (!imageUrl) return res.status(400).json({ error: "No image URL provided" });

  // 1. Deduct Credits
  const { data: success } = await supabaseAdmin.rpc('handle_generation_request', {
    p_user_id: userId,
    p_cost: COST,
    p_description: `AI Edit Request`
  });

  if (!success) return res.status(402).json({ error: "Insufficient credits" });

  // 2. Create Job Record
  const { data: job, error: jobError } = await supabaseAdmin
    .from('jobs')
    .insert({
      user_id: userId,
      prompt: prompt,
      platform: platform || 'youtube',
      context_image_path: imageUrl, // Storing source URL for history
      status: 'pending'
    })
    .select()
    .single();

  if (jobError) return res.status(500).json({ error: "Failed to create job" });

  // 3. Queue Job
  await jobQueue.add('generate-batch', {
    jobId: job.id,
    userId,
    prompt,
    platform,
    count: 1, 
    isEdit: true, 
    sourceImageUrl: imageUrl // Explicitly named for worker
  });

  res.status(202).json({ jobId: job.id });
});

// --- ROUTE 3: SSE STREAM ---
app.get('/api/jobs/:jobId/stream', (req, res) => {
  const { jobId } = req.params;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  sseManager.subscribe(jobId, res);
});

// --- ROUTE 4: GET JOB RESULT ---
app.get('/api/jobs/:jobId', requireAuth, async (req: any, res: any) => {
  const { jobId } = req.params;

  // 1. Fetch Job Status
  const { data: job, error } = await supabaseAdmin
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single();

  if (error) return res.status(404).json({ error: "Job not found" });

  // 2. Fetch Generations if complete
  let imageUrls: string[] = [];
  if (job.status === 'completed') {
    const { data: gens } = await supabaseAdmin
      .from('generations')
      .select('image_path')
      .eq('job_id', jobId);

    imageUrls = gens?.map(g => {
        if(g.image_path.startsWith('http')) return g.image_path;
        return `${process.env.SUPABASE_URL}/storage/v1/object/public/thumbnails/${g.image_path}`;
    }) || [];
  }

  res.json({
    jobId: job.id,
    status: job.status,
    result: job.status === 'completed' ? { imageUrls, creditsRemaining: 0 } : null
  });
});

// --- ROUTE 5: FAVORITES (GET) ---
app.get('/api/favorites', requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from('favorites')
      .select(`*, generations (jobs (prompt, platform))`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const formattedData = data.map((fav: any) => {
      // Handle nested array vs object from join
      const jobData = Array.isArray(fav.generations?.jobs) 
        ? fav.generations.jobs[0] 
        : fav.generations?.jobs;

      return {
        id: fav.id,
        image_url: fav.public_url, // Used in frontend grid
        image_path: fav.image_path, // Used for backend references
        created_at: fav.created_at,
        is_uploaded: fav.is_uploaded,
        prompt: fav.is_uploaded ? "User Uploaded Asset" : (jobData?.prompt || "Saved Asset"),
        platform: fav.is_uploaded ? "custom" : (jobData?.platform || "youtube")
      };
    });

    res.json(formattedData);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- ROUTE 6: UPLOAD FAVORITE ---
app.post('/api/favorites/upload', requireAuth, upload.single('file'), async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No image provided" });

    const ext = file.originalname.split('.').pop();
    const storagePath = `${userId}/favorites/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('uploads')
      .upload(storagePath, file.buffer, { contentType: file.mimetype, upsert: true });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabaseAdmin.storage.from('uploads').getPublicUrl(storagePath);

    const { data: insertedData, error: dbError } = await supabaseAdmin
      .from('favorites')
      .insert({
        user_id: userId,
        image_path: storagePath,
        public_url: urlData.publicUrl,
        is_uploaded: true,
        generation_id: null
      })
      .select()
      .single();

    if (dbError) throw dbError;
    res.json(insertedData);

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- ROUTE 7: SAVE GENERATION AS FAVORITE ---
app.post('/api/favorites', requireAuth, async (req: any, res: any) => {
  try {
    const { imagePath, generationId } = req.body;
    const userId = req.user.id;

    // Generate Public URL for storage
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('thumbnails')
      .getPublicUrl(imagePath);

    const { data, error } = await supabaseAdmin
      .from('favorites')
      .insert({
        user_id: userId,
        image_path: imagePath,
        public_url: publicUrl,
        is_uploaded: false,
        generation_id: generationId || null
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return res.status(200).json({ message: "Already saved" });
      throw error;
    }
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- ROUTE 8: DELETE FAVORITE ---
app.delete('/api/favorites/:id', requireAuth, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: fav } = await supabaseAdmin
      .from('favorites')
      .select('image_path, is_uploaded')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (fav) {
      await supabaseAdmin.from('favorites').delete().eq('id', id);
      // Only delete file if user uploaded it (preserve AI history)
      if (fav.is_uploaded && fav.image_path) {
        await supabaseAdmin.storage.from('uploads').remove([fav.image_path]);
      }
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/",(req,res)=>{
  return res.json({message:"Hello World!"})
})

app.listen(3000, () => console.log("API Server running on port 3000"));
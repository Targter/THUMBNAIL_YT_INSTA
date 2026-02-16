import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(), // keeps file in RAM
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

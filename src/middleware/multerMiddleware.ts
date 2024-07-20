// src/middlewares/multerMiddleware.ts

import multer from 'multer';
import path from 'path';

// Define the uploads directory
const UPLOADS_DIR = path.join(__dirname, '../../uploads');

 
// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

// Create multer instance with the defined storage configuration
const upload = multer({ storage });

export default upload;

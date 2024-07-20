// src/controllers/imageController.ts

import { Request, Response, NextFunction } from "express";
import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

const UPLOADS_DIR = path.join(__dirname, "../../uploads");

// Middleware to ensure upload directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// const uploadImage = async (req: Request, res: Response , next: NextFunction) => {
//     try {

//         // Extracts the uploaded file information from req.file and casts it to Express.Multer.File.
//         // This allows access to properties like originalname, path, etc.
//         const imageFile = req.file as Express.Multer.File;
//         const imagePath = path.join(UPLOADS_DIR, imageFile.originalname);

//         if (!fs.existsSync(imagePath)) {
//           return res.status(400).send(' image was not uploaded.');
//       }
//         // Move the uploaded file to the uploads directory
//         await fs.promises.rename(imageFile.path, imagePath);
//         next();
//           } catch (err) {
//         console.error(err);
//         next(err);
//     }
// };

const uploadImage = async (req: Request, res: Response) => {
  try {
    // Extracts the uploaded file information from req.file and casts it to Express.Multer.File.
    // This allows access to properties like originalname, path, etc.
    const imageFile = req.file as Express.Multer.File;
    const imagePath = path.join(UPLOADS_DIR, imageFile.originalname);

    // Move the uploaded file to the uploads directory
    await fs.promises.rename(imageFile.path, imagePath);

    if (!fs.existsSync(imagePath)) {
      return res.status(400).send("Image was not uploaded.");
    }
    res.status(200).send("File uploaded successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to upload image.");
  }
};

// const resizeImage = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const imageFile = req.file as Express.Multer.File;
//     const { width, height } = req.body;
//     const resizedImagePath = path.join(
//       UPLOADS_DIR,
//       `resized_${imageFile.originalname}`
//     );
//     //   if (!fs.existsSync(resizedImagePath)) {
//     //     return res.status(400).send('resized image was not created.');
//     // }
//     await sharp(imageFile.path)
//       .resize({ width: parseInt(width), height: parseInt(height) })
//       .toFile(resizedImagePath);
//     next();
//   } catch (err) {
//     console.error(err);
//     next(err);
//   }
// };


const resizeImage = async (req: Request, res: Response, next: Function) => {
  try { 

    const imageFile = req.file as Express.Multer.File; 
    const { width, height } = req.body;

    const resizedImagePath = path.join(UPLOADS_DIR, `resized_${imageFile.originalname}`);

    await sharp(imageFile.path)
      .resize({ width: parseInt(width), height: parseInt(height) })
      .toFile(resizedImagePath);

    res.status(200).send('File resized successfully.');
  } catch (err) {
    console.error(err); 
    res.status(500).send("Failed to resize image.");
  }
};

const cropImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageFile = req.file as Express.Multer.File;
    const { left, top, width, height } = req.body;
    const inputPath = path.join(UPLOADS_DIR, imageFile.filename);
    const croppedImagePath = path.join(
      UPLOADS_DIR,
      `cropped_${imageFile.filename}`
    );
    // if (!fs.existsSync(croppedImagePath)) {
    //     return res.status(400).send('cropped image was not created.');
    // }
    await sharp(inputPath)
      .extract({
        left: parseInt(left, 10),
        top: parseInt(top, 10),
        width: parseInt(width, 10),
        height: parseInt(height, 10),
      })
      .toFile(croppedImagePath);
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const downloadImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const filterImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const imageFile = req.file as Express.Multer.File;
    const { filterType } = req.body;
    const inputPath = path.join(UPLOADS_DIR, imageFile.originalname);
    let filteredImageName: string;
    switch (filterType) {
      case "grayscale":
        filteredImageName = `filtered_grayscale_${imageFile.originalname}`;
        break;
      case "blur":
        filteredImageName = `filtered_blur_${imageFile.originalname}`;
        break;
      default:
        return res.status(400).send("Invalid filter type.");
    }
    const filteredImagePath = path.join(UPLOADS_DIR, filteredImageName);
    let sharpInstance = sharp(inputPath);
    switch (filterType) {
      case "grayscale":
        sharpInstance = sharpInstance.grayscale();
        break;
      case "blur":
        sharpInstance = sharpInstance.blur(5);
        break;
    }
    await sharpInstance.toFile(filteredImagePath);
    if (!fs.existsSync(filteredImagePath)) {
      return res.status(400).send("Filtered image was not created.");
    }
    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const watermarkImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageFile = req.file as Express.Multer.File;
    const { watermarkText } = req.body;

    const inputPath = path.join(UPLOADS_DIR, imageFile.originalname);
    const watermarkedImagePath = path.join(
      UPLOADS_DIR,
      `watermarked_${imageFile.originalname}`
    );

    // Create the SVG buffer for watermarking
    const svgBuffer = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="100">
             <text y="70" font-family="Arial" font-size="100" fill="white">${watermarkText}</text>
           </svg>`
    );

    // Apply the watermark to the image
    await sharp(inputPath)
      .composite([{ input: svgBuffer, gravity: "southeast" }])
      .toFile(watermarkedImagePath);

    // Check if the watermarked file was created successfully
    if (!fs.existsSync(watermarkedImagePath)) {
      return res.status(400).send("Watermarked image was not created.");
    }

    next();
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export {
  uploadImage,
  resizeImage,
  cropImage,
  downloadImage,
  filterImage,
  watermarkImage,
};

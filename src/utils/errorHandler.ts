// src/utils/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

const checkFileUpload = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }
  next();
};
 

const errorHandler = (action: string) => (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  const errorMessages: { [key: string]: string } = {
      upload: 'Failed to upload image.',
      resize: 'Failed to resize image.',
      crop: `Failed to crop image: ${err.message}`,
      download: 'Failed to download image.',
      filter: `Failed to apply filter to image: ${err.message}`,
      watermark: `Failed to watermark image: ${err.message}`,
  };

  const message = errorMessages[action] || 'Internal Server Error';
  res.status(500).send(message);
};


export { errorHandler  , checkFileUpload };
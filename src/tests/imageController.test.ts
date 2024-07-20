const request = require ('supertest');
import express from 'express';
import multer from 'multer';
import * as fs from 'fs';
import * as path from 'path'; 
const { uploadImage, resizeImage, cropImage, filterImage, watermarkImage } = require ( '../controllers/imageController');

// Initialize express app
const app = express();
app.use(express.json());
app.use(multer({ dest: 'uploads/' }).single('image'));

// Route handlers
app.post('/api/images/upload', uploadImage);
app.post('/api/images/resize', resizeImage);
app.post('/api/images/crop', cropImage);
app.post('/api/images/filter', filterImage);
app.post('/api/images/watermark', watermarkImage);

describe('Image Controller Tests', () => {
    const imagePath = path.join(__dirname, './images/aqsa.png');
      const testImageBuffer = Buffer.from('test image content'); 

  // Create test image file
  beforeAll(() => {
    fs.writeFileSync(imagePath, testImageBuffer);
  });

  afterAll(() => { 
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  });

  test('POST /api/images/upload - Upload Image', async () => {
    const response = await request(app)
      .post('/api/images/upload')
      .attach('image', imagePath);

    expect(response.status).toBe(200);
    expect(response.text).toBe('File uploaded successfully.');
  });

  test('POST /api/images/resize - Resize Image', async () => {
    const response = await request(app)
      .post('/api/images/resize')
      .field('width', 100)
      .field('height', 100)
      .attach('image', imagePath) 

    expect(response.status).toBe(200);
    expect(response.text).toBe('File resized successfully.');
  });

//   test('POST /api/images/crop - Crop Image', async () => {
//     const response = await request(app)
//       .post('/api/images/crop')
//       .field('width', 100)
//       .field('height', 100)
//       .field('left', 10)
//       .field('top', 10)
//       .attach('image', imagePath) 

//     expect(response.status).toBe(200);
//     expect(response.text).toBe('File cropped successfully.');
//   });

//   test('POST /api/images/filter - Filter Image', async () => {
//     const response = await request(app)
//       .post('/api/images/filter')
//       .field('filterType', 'grayscale')
//       .attach('image', imagePath) 

//     expect(response.status).toBe(200);
//     expect(response.text).toBe('File filtered successfully.');
//   });

//   test('POST /api/images/watermark - Watermark Image', async () => {
//     const response = await request(app)
//       .post('/api/images/watermark')
//       .field('watermarkText', 'Test Watermark')
//       .attach('image', imagePath) 

//     expect(response.status).toBe(200);
//     expect(response.text).toBe('File Watermarked successfully.');
//   });
});

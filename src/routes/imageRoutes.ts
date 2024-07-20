// src/routes/imageRoutes.ts

import { Router } from 'express'; 
import * as imageController from '../controllers/imageController';
import { checkFileUpload, errorHandler } from '../utils/errorHandler';
import successHandler from '../middleware/successHandler';
import upload from '../middleware/multerMiddleware'; 
import {
  validateFields,
  resizeValidationRules,
  cropValidationRules,
  filterValidationRules,
  watermarkValidationRules,
} from '../middleware/validationMiddleware';


const router = Router(); 

router.post('/upload', upload.single('image'), checkFileUpload,imageController.uploadImage, successHandler('upload'), errorHandler('upload'));
router.post('/resize', upload.single('image'), checkFileUpload,  validateFields(resizeValidationRules), imageController.resizeImage, successHandler('resize'), errorHandler('resize'));
router.post('/crop', upload.single('image'), checkFileUpload,  validateFields(cropValidationRules), imageController.cropImage, successHandler('crop'), errorHandler('crop'));
router.get('/download/:filename', imageController.downloadImage, successHandler('download'), errorHandler('download'));
router.post('/filter', upload.single('image'), checkFileUpload,  validateFields(filterValidationRules), imageController.filterImage, successHandler('filter'), errorHandler('filter'));
router.post('/watermark', upload.single('image'), checkFileUpload,  validateFields(watermarkValidationRules), imageController.watermarkImage, successHandler('watermark'), errorHandler('watermark'));

export default router;

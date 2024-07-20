// src/middlewares/validationMiddleware.ts

import { Request, Response, NextFunction } from 'express';

// Type to define validation rules
type ValidationRules = {
  [key: string]: (req: Request) => boolean | string;
};

const validateFields = (rules: ValidationRules) => (req: Request, res: Response, next: NextFunction) => {
  for (const [key, validation] of Object.entries(rules)) {
    const result = validation(req);
    if (result !== true) {
      return res.status(400).send(result);
    }
  }
  next();
};

// Define validation rules for each action

const resizeValidationRules: ValidationRules = {
  width: (req) => req.body.width ? true : 'Width is required.',
  height: (req) => req.body.height ? true : 'Height is required.',
};

const cropValidationRules: ValidationRules = {
  left: (req) => req.body.left ? true : 'Left coordinate is required.',
  top: (req) => req.body.top ? true : 'Top coordinate is required.',
  width: (req) => req.body.width ? true : 'Width is required.',
  height: (req) => req.body.height ? true : 'Height is required.',
};

const filterValidationRules: ValidationRules = {
  filterType: (req) => req.body.filterType ? true : 'Filter type is required.',
};

const watermarkValidationRules: ValidationRules = {
  watermarkText: (req) => req.body.watermarkText ? true : 'Watermark text is required.',
};

export {
  validateFields,
  resizeValidationRules,
  cropValidationRules,
  filterValidationRules,
  watermarkValidationRules,
};

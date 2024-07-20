// src/routes/index.ts

import express, { Request, Response } from 'express'; 

const router = express.Router();

// Route to render index.ejs
router.get('/', (req: Request, res: Response) => {
    try {
      const message = ' Wellcome to our Image Proccessing API';
      res.status(200).send(message);
    } catch (err) {
        console.error('Error rendering index.ejs:', err);
        res.status(500).send('Internal Server Error');
    }
});

export default router;

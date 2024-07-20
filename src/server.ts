// src/server.ts

import express from 'express';
import path from 'path';
import indexRouter from './routes/indexRouter';
import imageRoutes from './routes/imageRoutes';
const {errorHandler } = require( './utils/errorHandler');


const app = express();

// View engine setup (EJS example)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'uploads' directory
app.use('/api/images', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/', indexRouter); // Mount the indexRouter at the root path '/'
app.use('/api/images', imageRoutes); // Mount the imageRoutes under the '/api/images' path

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

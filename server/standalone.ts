import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { registerRoutes } from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Register API routes
registerRoutes(app).then((server) => {
  server.listen(PORT, () => {
    console.log(`🚀 Standalone API server running on port ${PORT}`);
    console.log(`📚 API Documentation:`);
    console.log(`  Health: GET http://localhost:${PORT}/api/health`);
    console.log(`  Auth: POST http://localhost:${PORT}/api/auth/register`);
    console.log(`  Auth: POST http://localhost:${PORT}/api/auth/login`);
    console.log(`  Products: GET/POST http://localhost:${PORT}/api/products`);
    console.log(`  Ingredients: GET/POST http://localhost:${PORT}/api/ingredients`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
});
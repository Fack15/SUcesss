import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import ingredientRoutes from "./routes/ingredients";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.use("/api/auth", authRoutes);
  
  // Product routes
  app.use("/api/products", productRoutes);
  
  // Ingredient routes
  app.use("/api/ingredients", ingredientRoutes);

  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      message: "Server is running",
      endpoints: {
        auth: "/api/auth",
        products: "/api/products", 
        ingredients: "/api/ingredients"
      }
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}

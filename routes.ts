import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  forecastRequestSchema, 
  simulationRequestSchema,
  type ForecastRequest,
  type SimulationRequest 
} from "@shared/schema";
import { generateForecast, getForecastData } from "./services/forecast";
import { runSimulation, getSimulationHistory } from "./services/simulation";
import { generateInsights, getInsights } from "./services/insights";
import { analyzeChatQuestion } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Pet Nutrition Data Routes
  app.get("/api/nutrition-data", async (req, res) => {
    try {
      const data = await storage.getPetNutritionData();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nutrition data" });
    }
  });

  app.get("/api/nutrition-data/:upc", async (req, res) => {
    try {
      const { upc } = req.params;
      const data = await storage.getPetNutritionDataByUpc(upc);
      if (!data) {
        return res.status(404).json({ message: "Data not found for UPC" });
      }
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nutrition data" });
    }
  });

  // Forecast Routes
  app.post("/api/forecast", async (req, res) => {
    try {
      const validatedData = forecastRequestSchema.parse(req.body);
      const results = await generateForecast(validatedData);
      res.json(results);
    } catch (error) {
      console.error("Forecast error:", error);
      res.status(400).json({ message: "Invalid forecast request" });
    }
  });

  app.get("/api/forecast", async (req, res) => {
    try {
      const { upc } = req.query;
      const results = await getForecastData(upc as string);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch forecast data" });
    }
  });

  // Simulation Routes
  app.post("/api/simulate", async (req, res) => {
    try {
      const validatedData = simulationRequestSchema.parse(req.body);
      const result = await runSimulation(validatedData);
      res.json(result);
    } catch (error) {
      console.error("Simulation error:", error);
      res.status(400).json({ message: "Invalid simulation request" });
    }
  });

  app.get("/api/simulations", async (req, res) => {
    try {
      const results = await getSimulationHistory();
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch simulation history" });
    }
  });

  // Customer Segments Routes
  app.get("/api/customer-segments", async (req, res) => {
    try {
      const segments = await storage.getCustomerSegments();
      res.json(segments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer segments" });
    }
  });

  // Insights Routes
  app.post("/api/insights/generate", async (req, res) => {
    try {
      await generateInsights();
      const insights = await getInsights();
      res.json(insights);
    } catch (error) {
      console.error("Insights generation error:", error);
      res.status(500).json({ message: "Failed to generate insights" });
    }
  });

  app.get("/api/insights", async (req, res) => {
    try {
      const { type } = req.query;
      const insights = type 
        ? await storage.getInsightsByType(type as string)
        : await getInsights();
      res.json(insights);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch insights" });
    }
  });

  // AI Chat Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { question } = req.body;
      if (!question) {
        return res.status(400).json({ message: "Question is required" });
      }

      // Get context data
      const nutritionData = await storage.getPetNutritionData();
      const customerSegments = await storage.getCustomerSegments();
      
      const contextData = {
        nutrition: nutritionData[0],
        segments: customerSegments
      };

      const answer = await analyzeChatQuestion(question, contextData);
      res.json({ answer });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process chat question" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

import { storage } from "../storage";
import type { ForecastRequest, InsertForecastResult } from "@shared/schema";

// Simplified Prophet-like forecasting algorithm
class SimpleForecastModel {
  private trend: number;
  private seasonality: number[];
  private noise: number;

  constructor() {
    this.trend = 0.02; // 2% monthly growth trend
    this.seasonality = [1.0, 0.95, 1.05, 1.1, 1.08, 1.12, 1.15, 1.13, 1.06, 1.02, 0.98, 1.03]; // Monthly seasonality
    this.noise = 0.05; // 5% noise factor
  }

  forecast(historicalData: number[], periods: number): {
    values: number[];
    lower: number[];
    upper: number[];
  } {
    const lastValue = historicalData[historicalData.length - 1];
    const values: number[] = [];
    const lower: number[] = [];
    const upper: number[] = [];

    for (let i = 0; i < periods; i++) {
      const monthIndex = (new Date().getMonth() + i) % 12;
      const seasonalFactor = this.seasonality[monthIndex];
      const trendFactor = Math.pow(1 + this.trend, i + 1);
      
      const baseValue = lastValue * trendFactor * seasonalFactor;
      const noiseRange = baseValue * this.noise;
      
      values.push(baseValue);
      lower.push(baseValue - noiseRange * 1.96); // 95% confidence interval
      upper.push(baseValue + noiseRange * 1.96);
    }

    return { values, lower, upper };
  }
}

export async function generateForecast(request: ForecastRequest): Promise<InsertForecastResult[]> {
  try {
    // Get historical data
    const historicalData = await storage.getPetNutritionDataByUpc(request.upc);
    
    if (!historicalData) {
      throw new Error(`No historical data found for UPC: ${request.upc}`);
    }

    // Create simplified historical sales trend (in a real implementation, this would come from a time series database)
    const historicalSales = [
      historicalData.salesValue * 0.85,
      historicalData.salesValue * 0.92,
      historicalData.salesValue * 0.96,
      historicalData.salesValue
    ];

    const historicalUnits = [
      historicalData.salesUnits * 0.87,
      historicalData.salesUnits * 0.93,
      historicalData.salesUnits * 0.97,
      historicalData.salesUnits
    ];

    const model = new SimpleForecastModel();
    
    // Generate forecasts for sales value and units
    const salesForecast = model.forecast(historicalSales, request.periods);
    const unitsForecast = model.forecast(historicalUnits, request.periods);

    const results: InsertForecastResult[] = [];
    const startDate = new Date(request.dateRange.start);

    for (let i = 0; i < request.periods; i++) {
      const forecastDate = new Date(startDate);
      forecastDate.setMonth(forecastDate.getMonth() + i + 1);

      const result: InsertForecastResult = {
        upc: request.upc,
        forecastDate: forecastDate.toISOString().split('T')[0],
        predictedSalesValue: Math.round(salesForecast.values[i]),
        predictedSalesUnits: Math.round(unitsForecast.values[i]),
        confidenceLower: Math.round(salesForecast.lower[i]),
        confidenceUpper: Math.round(salesForecast.upper[i])
      };

      results.push(result);
    }

    // Store results
    for (const result of results) {
      await storage.createForecastResult(result);
    }

    return results;
  } catch (error) {
    console.error("Error generating forecast:", error);
    throw new Error("Failed to generate forecast");
  }
}

export async function getForecastData(upc?: string) {
  return await storage.getForecastResults(upc);
}

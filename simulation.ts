import { storage } from "../storage";
import type { SimulationRequest, InsertSimulationResult } from "@shared/schema";

// Price elasticity and impact models
class SimulationEngine {
  private priceElasticity: number;
  private distributionImpactFactor: number;

  private marketingEfficiency: number;

  constructor() {
    this.priceElasticity = -0.8; // -0.8 elasticity (typical for CPG)
    this.distributionImpactFactor = 0.6; // 60% of distribution change converts to sales
    this.marketingEfficiency = 0.3; // 30% of marketing spend converts to sales lift
  }

  simulate(baselineData: any, parameters: SimulationRequest): {
    projectedSalesValue: number;
    projectedSalesUnits: number;
    incrementalRevenue: number;
    roi: number;
    investmentCost: number;
  } {
    const baseline = {
      salesValue: baselineData.salesValue,
      salesUnits: baselineData.salesUnits,
      averagePrice: baselineData.averagePricePerUnit
    };

    // Calculate individual impacts
    const priceImpact = this.calculatePriceImpact(baseline, parameters.priceChange);
    const distributionImpact = this.calculateDistributionImpact(baseline, parameters.distributionChange);
    const marketingImpact = this.calculateMarketingImpact(baseline, parameters.marketingSpendChange);

    // Calculate total projected sales
    const totalImpactFactor = 1 + priceImpact.factor + distributionImpact.factor + marketingImpact.factor;
    const projectedSalesValue = baseline.salesValue * totalImpactFactor;
    const projectedSalesUnits = baseline.salesUnits * totalImpactFactor;

    // Calculate incremental revenue and costs
    const incrementalRevenue = projectedSalesValue - baseline.salesValue;
    const investmentCost = distributionImpact.cost + marketingImpact.cost;
    const roi = investmentCost > 0 ? incrementalRevenue / investmentCost : 0;

    return {
      projectedSalesValue: Math.round(projectedSalesValue),
      projectedSalesUnits: Math.round(projectedSalesUnits),
      incrementalRevenue: Math.round(incrementalRevenue),
      roi: Math.round(roi * 100) / 100,
      investmentCost: Math.round(investmentCost)
    };
  }

  private calculatePriceImpact(baseline: any, priceChange: number) {
    const factor = (priceChange / 100) * this.priceElasticity;
    return { factor, cost: 0 };
  }

  private calculateDistributionImpact(baseline: any, distributionChange: number) {
    const factor = (distributionChange / 100) * this.distributionImpactFactor;
    const cost = Math.max(0, distributionChange) * baseline.salesValue * 0.02; // 2% cost for expansion
    return { factor, cost };
  }



  private calculateMarketingImpact(baseline: any, marketingSpendChange: number) {
    const factor = (marketingSpendChange / 100) * this.marketingEfficiency;
    const cost = (marketingSpendChange / 100) * baseline.salesValue * 0.05; // 5% of baseline sales
    return { factor, cost };
  }
}

export async function runSimulation(parameters: SimulationRequest): Promise<InsertSimulationResult> {
  try {
    // Get baseline data (using the sample data)
    const petData = await storage.getPetNutritionData();
    const baselineData = petData[0]; // Use first record as baseline

    if (!baselineData) {
      throw new Error("No baseline data available for simulation");
    }

    const engine = new SimulationEngine();
    const results = engine.simulate(baselineData, parameters);

    const simulationResult: InsertSimulationResult = {
      scenarioName: `Simulation_${Date.now()}`,
      priceChange: parameters.priceChange,
      distributionChange: parameters.distributionChange,
      marketingSpendChange: parameters.marketingSpendChange,
      projectedSalesValue: results.projectedSalesValue,
      projectedSalesUnits: results.projectedSalesUnits,
      incrementalRevenue: results.incrementalRevenue,
      roi: results.roi
    };

    // Store simulation result
    const storedResult = await storage.createSimulationResult(simulationResult);
    return storedResult;

  } catch (error) {
    console.error("Error running simulation:", error);
    throw new Error("Failed to run simulation");
  }
}

export async function getSimulationHistory() {
  return await storage.getSimulationResults();
}

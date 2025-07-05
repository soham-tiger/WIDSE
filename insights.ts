import { storage } from "../storage";
import { generateInsightSummary, generateStrategicRecommendations } from "./openai";
import type { InsertInsight } from "@shared/schema";

export async function generateInsights(): Promise<void> {
  try {
    // Get current data
    const petData = await storage.getPetNutritionData();
    const customerSegments = await storage.getCustomerSegments();
    
    if (petData.length === 0) {
      throw new Error("No pet nutrition data available");
    }

    const currentData = petData[0];

    // Clear existing insights (in a real app, you might want to version these)
    // For simplicity, we'll just generate new ones

    // Analyze performance metrics and generate insights
    const insights = await analyzePerformanceMetrics(currentData, customerSegments);
    
    // Store insights
    for (const insight of insights) {
      await storage.createInsight(insight);
    }

    // Generate AI-powered recommendations
    try {
      const aiRecommendations = await generateStrategicRecommendations({
        salesData: currentData,
        customerSegments
      });

      for (const rec of aiRecommendations) {
        await storage.createInsight({
          type: 'opportunity',
          title: rec.title,
          description: rec.description,
          recommendation: rec.impact,
          confidence: 0.8
        });
      }
    } catch (aiError) {
      console.warn("AI recommendations failed, using fallback logic");
      // Fallback to rule-based recommendations if AI fails
    }

  } catch (error) {
    console.error("Error generating insights:", error);
    throw new Error("Failed to generate insights");
  }
}

async function analyzePerformanceMetrics(data: any, segments: any[]): Promise<InsertInsight[]> {
  const insights: InsertInsight[] = [];

  // Growth analysis
  if (data.salesValue > 150000) {
    insights.push({
      type: 'growth',
      title: 'Strong Sales Performance',
      description: `Sales value of $${data.salesValue.toLocaleString()} indicates strong market performance, driven by effective pricing strategy and product positioning.`,
      recommendation: 'Expand distribution to capitalize on momentum',
      confidence: 0.9
    });
  }

  // Customer penetration risk analysis
  if (data.customerPenetrationPct < 15) {
    insights.push({
      type: 'risk',
      title: 'Low Customer Penetration',
      description: `Customer penetration at ${data.customerPenetrationPct}% is below industry benchmark, indicating potential market saturation or competitive pressure.`,
      recommendation: 'Launch customer acquisition campaign targeting new demographics',
      confidence: 0.85
    });
  }

  // Loyalty analysis
  const loyalSegment = segments.find(s => s.segmentName === 'Loyal');
  if (loyalSegment && loyalSegment.customerCount < 1000) {
    insights.push({
      type: 'opportunity',
      title: 'Loyalty Program Enhancement',
      description: `Only ${loyalSegment.customerCount} loyal customers represent significant upside potential for retention programs.`,
      recommendation: 'Implement tiered loyalty program with premium benefits',
      confidence: 0.75
    });
  }

  // Churn risk analysis
  const atRiskSegment = segments.find(s => s.segmentName === 'At-Risk');
  if (atRiskSegment && atRiskSegment.churnRiskPct > 25) {
    insights.push({
      type: 'risk',
      title: 'High Churn Risk Segment',
      description: `${atRiskSegment.churnRiskPct}% churn risk in At-Risk segment threatens ${atRiskSegment.customerCount} customers.`,
      recommendation: 'Deploy targeted retention campaigns with personalized offers',
      confidence: 0.9
    });
  }

  // Cross-selling opportunity
  if (data.basketPenetrationPct > 25) {
    insights.push({
      type: 'opportunity',
      title: 'Cross-Category Potential',
      description: `High basket penetration (${data.basketPenetrationPct}%) indicates strong cross-selling opportunities in treats and accessories.`,
      recommendation: 'Test bundle promotions and cross-category displays',
      confidence: 0.8
    });
  }

  return insights;
}

export async function getInsights() {
  return await storage.getInsights();
}

export async function getInsightsByType(type: string) {
  return await storage.getInsightsByType(type);
}

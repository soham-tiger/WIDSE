// Mock AI service that provides realistic responses without requiring OpenAI API
// This simulates what OpenAI would return based on data patterns and business logic

export async function generateInsightSummary(
  salesData: any, 
  customerData: any, 
  performanceMetrics: any
): Promise<string> {
  // Analyze data patterns to generate realistic insights
  const salesTrend = salesData?.salesValue > 160000 ? "strong growth" : salesData?.salesValue > 140000 ? "moderate growth" : "declining performance";
  const penetrationStatus = salesData?.customerPenetrationPct < 15 ? "low market penetration" : "healthy market presence";
  const loyaltyStatus = salesData?.loyalPenetrationPct > 8 ? "strong loyalty metrics" : "loyalty challenges";

  const insights = [
    `Q1 2025 demonstrates ${salesTrend} with sales reaching $${salesData?.salesValue?.toLocaleString() || '168,000'}, driven by effective pricing strategy and product mix optimization.`,
    `Customer penetration at ${salesData?.customerPenetrationPct || 13.6}% indicates ${penetrationStatus}, while ${loyaltyStatus} present both opportunities and risks for sustainable growth.`,
    `High-value customer segments continue to drive disproportionate revenue impact, suggesting focused retention and acquisition strategies will yield optimal ROI.`
  ];

  return insights.join(' ');
}

export async function generateStrategicRecommendations(data: any): Promise<{
  title: string;
  description: string;
  impact: string;
}[]> {
  // Generate data-driven recommendations based on actual metrics
  const salesData = data.salesData || data;
  const segments = data.customerSegments || [];
  
  const recommendations = [];

  // Price optimization recommendation
  if (salesData?.averagePricePerUnit < 5.0) {
    recommendations.push({
      title: "Premium Positioning Strategy",
      description: "Current average price of $" + (salesData?.averagePricePerUnit || 4.9) + " suggests opportunity for premium positioning. Implement value-based pricing for high-performing SKUs.",
      impact: "Projected 8-12% revenue increase with minimal volume impact due to strong brand loyalty."
    });
  }

  // Distribution expansion
  if (salesData?.acvWeightedRosDistributionPct < 85) {
    recommendations.push({
      title: "Targeted Distribution Expansion",
      description: "Current distribution at " + (salesData?.acvWeightedRosDistributionPct || 78.5) + "% ACV presents growth opportunity. Focus on independent pet specialty channels.",
      impact: "15% distribution increase could drive $23,000+ in incremental quarterly revenue."
    });
  }

  // Customer acquisition based on penetration
  if (salesData?.customerPenetrationPct < 15) {
    recommendations.push({
      title: "Digital Customer Acquisition",
      description: "Low customer penetration (" + (salesData?.customerPenetrationPct || 13.6) + "%) indicates untapped market potential. Launch targeted social media campaigns for millennial pet owners.",
      impact: "25% increase in marketing spend targeting 25-40 age group could acquire 1,200+ new customers."
    });
  }

  // Loyalty program if low loyal penetration
  if (salesData?.loyalPenetrationPct < 10) {
    recommendations.push({
      title: "Tiered Loyalty Program Launch",
      description: "Loyal customer base at " + (salesData?.loyalPenetrationPct || 9.2) + "% shows retention opportunity. Implement points-based system with premium tier benefits.",
      impact: "18% improvement in customer retention rate, increasing lifetime value by $47 per customer."
    });
  }

  // Cross-selling based on basket penetration
  if (salesData?.basketPenetrationPct > 25) {
    recommendations.push({
      title: "Cross-Category Bundle Strategy",
      description: "High basket penetration (" + (salesData?.basketPenetrationPct || 26.8) + "%) indicates strong cross-selling potential. Create treat and accessory bundles.",
      impact: "Bundle promotions could increase average transaction value by 22% and improve customer stickiness."
    });
  }

  return recommendations.slice(0, 3); // Return top 3 recommendations
}

export async function analyzeChatQuestion(question: string, contextData: any): Promise<string> {
  // Analyze question patterns and provide relevant answers based on available data
  const lowerQuestion = question.toLowerCase();
  const salesData = contextData?.nutrition || {};
  const segments = contextData?.segments || [];

  // Sales performance questions
  if (lowerQuestion.includes('sales') || lowerQuestion.includes('revenue')) {
    if (lowerQuestion.includes('growth') || lowerQuestion.includes('increase')) {
      return `Sales performance shows strong momentum with current quarterly revenue at $${salesData.salesValue?.toLocaleString() || '168,000'}. The 12.5% growth is primarily driven by price optimization and improved product mix. Adult Complete continues to be the top performer, representing 53% of total sales value.`;
    }
    if (lowerQuestion.includes('decline') || lowerQuestion.includes('down')) {
      return `While overall sales are strong, some segments show challenges. The Senior Complete line declined 2.3% this quarter, likely due to increased competition and pricing pressure. However, this represents only 18% of total portfolio value.`;
    }
    return `Current sales performance indicates $${salesData.salesValue?.toLocaleString() || '168,000'} in quarterly revenue with ${salesData.salesUnits?.toLocaleString() || '8,650'} units sold. Average price per unit is $${salesData.averagePricePerUnit || '4.90'}, showing healthy pricing power.`;
  }

  // Customer penetration questions
  if (lowerQuestion.includes('customer') && (lowerQuestion.includes('penetration') || lowerQuestion.includes('decline'))) {
    return `Customer penetration at ${salesData.customerPenetrationPct || 13.6}% declined 2.1% this quarter, primarily due to increased competitive pressure and market saturation in key demographics. Focus should shift to retention of high-value customers and acquisition in underserved segments like millennials aged 25-40.`;
  }

  // Loyalty questions
  if (lowerQuestion.includes('loyal') || lowerQuestion.includes('retention')) {
    const loyalSegment = segments.find((s: any) => s.segmentName === 'Loyal');
    return `Loyalty metrics show ${salesData.loyalPenetrationPct || 9.2}% loyal customer penetration with ${loyalSegment?.customerCount || 809} loyal customers. These customers have a significantly higher spend per transaction ($${salesData.spendPerLoyalCustomer || '27.30'} vs $${salesData.spendPerCustomer || '19.10'} average), indicating strong value in retention programs.`;
  }

  // Product performance questions
  if (lowerQuestion.includes('product') || lowerQuestion.includes('adult complete') || lowerQuestion.includes('puppy')) {
    return `Product performance varies significantly: Adult Complete drives 53% of sales value with strong 15.2% growth, while Puppy Complete shows 8.7% growth representing 28% of sales. Senior Complete faces headwinds with -2.3% decline, suggesting need for reformulation or repositioning strategy.`;
  }

  // Distribution questions
  if (lowerQuestion.includes('distribution') || lowerQuestion.includes('stores')) {
    return `Distribution performance shows ${salesData.acvWeightedRosDistributionPct || 78.5}% ACV weighted distribution across ${salesData.storesSelling || 245} stores. This indicates opportunity for expansion, particularly in independent pet specialty channels where brand loyalty typically runs higher.`;
  }

  // Pricing questions
  if (lowerQuestion.includes('price') || lowerQuestion.includes('pricing')) {
    return `Pricing strategy appears effective with average price per unit at $${salesData.averagePricePerUnit || '4.90'}, up 3.8% from last quarter. The price elasticity seems favorable as volume growth (8.3%) outpaced price increases, indicating strong brand value perception among customers.`;
  }

  // Recommendations questions
  if (lowerQuestion.includes('recommend') || lowerQuestion.includes('strategy') || lowerQuestion.includes('should')) {
    return `Based on current performance, I recommend: 1) Expanding distribution by 15% targeting independent pet stores, 2) Launching a tiered loyalty program to improve retention, and 3) Increasing digital marketing spend by 25% to acquire younger pet owners. These initiatives could drive 15-20% incremental revenue growth.`;
  }

  // Forecast questions
  if (lowerQuestion.includes('forecast') || lowerQuestion.includes('predict') || lowerQuestion.includes('future')) {
    return `Forecasting models indicate continued growth trajectory with Q2 projected sales of $185,000 (+10% QoQ) and Q3 at $198,000. Key drivers include expanded distribution, improved customer acquisition efficiency, and strong seasonality patterns in premium pet nutrition products.`;
  }

  // Competition questions
  if (lowerQuestion.includes('competition') || lowerQuestion.includes('market share')) {
    return `Market position shows strong performance with ${salesData.categoryShareSpendPct || 19.4}% share of category spend and ${salesData.categoryShareUnitsPct || 17.9}% unit share. The slight value premium indicates successful brand differentiation, though competitive pressure is evident in the customer penetration decline.`;
  }

  // Default response for unmatched questions
  return `Based on your current data, here are the key insights: Sales are strong at $${salesData.salesValue?.toLocaleString() || '168,000'} with good growth momentum. Customer penetration needs attention at ${salesData.customerPenetrationPct || 13.6}%, while loyal customers show excellent value at $${salesData.spendPerLoyalCustomer || '27.30'} average spend. Could you be more specific about what aspect you'd like me to analyze?`;
}

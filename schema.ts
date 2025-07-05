import { pgTable, text, serial, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const petNutritionData = pgTable("pet_nutrition_data", {
  id: serial("id").primaryKey(),
  upc: text("upc").notNull(),
  reportStartDate: text("report_start_date").notNull(),
  reportEndDate: text("report_end_date").notNull(),
  acvWeightedRosDistributionPct: real("acv_weighted_ros_distribution_pct").notNull(),
  acvWeightedRosSales: real("acv_weighted_ros_sales").notNull(),
  acvWeightedRosUnits: real("acv_weighted_ros_units").notNull(),
  associatedCategorySpend: real("associated_category_spend").notNull(),
  associatedCategorySpendPerTransaction: real("associated_category_spend_per_transaction").notNull(),
  associatedRetailerSpend: real("associated_retailer_spend").notNull(),
  associatedRetailerSpendPerTransaction: real("associated_retailer_spend_per_transaction").notNull(),
  averagePricePerUnit: real("average_price_per_unit").notNull(),
  basketPenetrationPct: real("basket_penetration_pct").notNull(),
  categoryShareSpendPct: real("category_share_spend_pct").notNull(),
  categoryShareUnitsPct: real("category_share_units_pct").notNull(),
  customerPenetrationPct: real("customer_penetration_pct").notNull(),
  customers: integer("customers").notNull(),
  discontinuedProductsSalesValue: real("discontinued_products_sales_value").notNull(),
  frequencyOfPurchase: real("frequency_of_purchase").notNull(),
  loyalPenetrationPct: real("loyal_penetration_pct").notNull(),
  repeatRatePct: real("repeat_rate_pct").notNull(),
  newProductsSalesValue: real("new_products_sales_value").notNull(),
  numberOfProducts: integer("number_of_products").notNull(),
  retailerCustomers: integer("retailer_customers").notNull(),
  retailerTransactions: integer("retailer_transactions").notNull(),
  salesPerStore: real("sales_per_store").notNull(),
  salesUnitContinuousProducts: real("sales_unit_continuous_products").notNull(),
  salesUnits: real("sales_units").notNull(),
  salesValue: real("sales_value").notNull(),
  storesSelling: integer("stores_selling").notNull(),
  transactions: integer("transactions").notNull(),
  spendPerCustomer: real("spend_per_customer").notNull(),
  spendPerLoyalCustomer: real("spend_per_loyal_customer").notNull(),
  spendPerTransaction: real("spend_per_transaction").notNull(),
  unitsPerCustomer: real("units_per_customer").notNull(),
  unitsPerStore: real("units_per_store").notNull(),
  unitsPerTransaction: real("units_per_transaction").notNull(),
});

export const forecastResults = pgTable("forecast_results", {
  id: serial("id").primaryKey(),
  upc: text("upc").notNull(),
  forecastDate: text("forecast_date").notNull(),
  predictedSalesValue: real("predicted_sales_value").notNull(),
  predictedSalesUnits: real("predicted_sales_units").notNull(),
  confidenceLower: real("confidence_lower").notNull(),
  confidenceUpper: real("confidence_upper").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const simulationResults = pgTable("simulation_results", {
  id: serial("id").primaryKey(),
  scenarioName: text("scenario_name").notNull(),
  priceChange: real("price_change").notNull(),
  distributionChange: real("distribution_change").notNull(),
  marketingSpendChange: real("marketing_spend_change").notNull(),
  projectedSalesValue: real("projected_sales_value").notNull(),
  projectedSalesUnits: real("projected_sales_units").notNull(),
  incrementalRevenue: real("incremental_revenue").notNull(),
  roi: real("roi").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customerSegments = pgTable("customer_segments", {
  id: serial("id").primaryKey(),
  segmentName: text("segment_name").notNull(),
  customerCount: integer("customer_count").notNull(),
  avgSpend: real("avg_spend").notNull(),
  purchaseFrequency: real("purchase_frequency").notNull(),
  churnRiskPct: real("churn_risk_pct").notNull(),
  cltv: real("cltv").notNull(),
});

export const insights = pgTable("insights", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'growth', 'risk', 'opportunity'
  title: text("title").notNull(),
  description: text("description").notNull(),
  recommendation: text("recommendation").notNull(),
  impact: text("impact"),
  confidence: real("confidence").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertPetNutritionDataSchema = createInsertSchema(petNutritionData).omit({
  id: true,
});

export const insertForecastResultSchema = createInsertSchema(forecastResults).omit({
  id: true,
  createdAt: true,
});

export const insertSimulationResultSchema = createInsertSchema(simulationResults).omit({
  id: true,
  createdAt: true,
});

export const insertCustomerSegmentSchema = createInsertSchema(customerSegments).omit({
  id: true,
});

export const insertInsightSchema = createInsertSchema(insights).omit({
  id: true,
  createdAt: true,
});

// Types
export type PetNutritionData = typeof petNutritionData.$inferSelect;
export type InsertPetNutritionData = z.infer<typeof insertPetNutritionDataSchema>;

export type ForecastResult = typeof forecastResults.$inferSelect;
export type InsertForecastResult = z.infer<typeof insertForecastResultSchema>;

export type SimulationResult = typeof simulationResults.$inferSelect;
export type InsertSimulationResult = z.infer<typeof insertSimulationResultSchema>;

export type CustomerSegment = typeof customerSegments.$inferSelect;
export type InsertCustomerSegment = z.infer<typeof insertCustomerSegmentSchema>;

export type Insight = typeof insights.$inferSelect;
export type InsertInsight = z.infer<typeof insertInsightSchema>;

// Request/Response schemas
export const forecastRequestSchema = z.object({
  upc: z.string(),
  dateRange: z.object({
    start: z.string(),
    end: z.string(),
  }),
  periods: z.number().default(4),
});

export const simulationRequestSchema = z.object({
  priceChange: z.number().min(-20).max(20),
  distributionChange: z.number().min(-15).max(15),
  marketingSpendChange: z.number().min(0).max(50),
});

export const globalFiltersSchema = z.object({
  category: z.string().default("all"),
  brand: z.string().default("all"),
  timePeriod: z.string().default("last_3_months"),
  region: z.string().default("all"),
});

export type ForecastRequest = z.infer<typeof forecastRequestSchema>;
export type SimulationRequest = z.infer<typeof simulationRequestSchema>;
export type GlobalFilters = z.infer<typeof globalFiltersSchema>;

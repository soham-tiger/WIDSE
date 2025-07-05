import { 
  petNutritionData, 
  forecastResults, 
  simulationResults, 
  customerSegments, 
  insights,
  type PetNutritionData,
  type InsertPetNutritionData,
  type ForecastResult,
  type InsertForecastResult,
  type SimulationResult,
  type InsertSimulationResult,
  type CustomerSegment,
  type InsertCustomerSegment,
  type Insight,
  type InsertInsight
} from "@shared/schema";

export interface IStorage {
  // Pet Nutrition Data
  getPetNutritionData(): Promise<PetNutritionData[]>;
  getPetNutritionDataByUpc(upc: string): Promise<PetNutritionData | undefined>;
  createPetNutritionData(data: InsertPetNutritionData): Promise<PetNutritionData>;
  
  // Forecast Results
  getForecastResults(upc?: string): Promise<ForecastResult[]>;
  createForecastResult(data: InsertForecastResult): Promise<ForecastResult>;
  
  // Simulation Results
  getSimulationResults(): Promise<SimulationResult[]>;
  createSimulationResult(data: InsertSimulationResult): Promise<SimulationResult>;
  
  // Customer Segments
  getCustomerSegments(): Promise<CustomerSegment[]>;
  createCustomerSegment(data: InsertCustomerSegment): Promise<CustomerSegment>;
  updateCustomerSegment(id: number, data: Partial<InsertCustomerSegment>): Promise<CustomerSegment>;
  
  // Insights
  getInsights(): Promise<Insight[]>;
  createInsight(data: InsertInsight): Promise<Insight>;
  getInsightsByType(type: string): Promise<Insight[]>;
}

export class MemStorage implements IStorage {
  private petNutritionDataMap: Map<number, PetNutritionData>;
  private forecastResultsMap: Map<number, ForecastResult>;
  private simulationResultsMap: Map<number, SimulationResult>;
  private customerSegmentsMap: Map<number, CustomerSegment>;
  private insightsMap: Map<number, Insight>;
  private currentId: number;

  constructor() {
    this.petNutritionDataMap = new Map();
    this.forecastResultsMap = new Map();
    this.simulationResultsMap = new Map();
    this.customerSegmentsMap = new Map();
    this.insightsMap = new Map();
    this.currentId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample pet nutrition data
    const sampleData: PetNutritionData = {
      id: this.currentId++,
      upc: "12345",
      reportStartDate: "2025-01-01",
      reportEndDate: "2025-03-31",
      acvWeightedRosDistributionPct: 78.5,
      acvWeightedRosSales: 152000,
      acvWeightedRosUnits: 8450,
      associatedCategorySpend: 290000,
      associatedCategorySpendPerTransaction: 18.2,
      associatedRetailerSpend: 132000,
      associatedRetailerSpendPerTransaction: 14.1,
      averagePricePerUnit: 4.9,
      basketPenetrationPct: 26.8,
      categoryShareSpendPct: 19.4,
      categoryShareUnitsPct: 17.9,
      customerPenetrationPct: 13.6,
      customers: 8800,
      discontinuedProductsSalesValue: 6500,
      frequencyOfPurchase: 2.9,
      loyalPenetrationPct: 9.2,
      repeatRatePct: 68.3,
      newProductsSalesValue: 8700,
      numberOfProducts: 24,
      retailerCustomers: 6100,
      retailerTransactions: 7900,
      salesPerStore: 2650,
      salesUnitContinuousProducts: 7900,
      salesUnits: 8650,
      salesValue: 168000,
      storesSelling: 245,
      transactions: 10100,
      spendPerCustomer: 19.1,
      spendPerLoyalCustomer: 27.3,
      spendPerTransaction: 16.6,
      unitsPerCustomer: 1.8,
      unitsPerStore: 35.3,
      unitsPerTransaction: 1.2
    };
    this.petNutritionDataMap.set(sampleData.id, sampleData);

    // Sample customer segments
    const segments: CustomerSegment[] = [
      {
        id: this.currentId++,
        segmentName: "High-Value",
        customerCount: 1320,
        avgSpend: 43.20,
        purchaseFrequency: 4.2,
        churnRiskPct: 5.2,
        cltv: 183
      },
      {
        id: this.currentId++,
        segmentName: "Loyal",
        customerCount: 809,
        avgSpend: 27.30,
        purchaseFrequency: 3.8,
        churnRiskPct: 8.1,
        cltv: 156
      },
      {
        id: this.currentId++,
        segmentName: "Regular",
        customerCount: 4410,
        avgSpend: 16.80,
        purchaseFrequency: 2.1,
        churnRiskPct: 14.3,
        cltv: 98
      },
      {
        id: this.currentId++,
        segmentName: "At-Risk",
        customerCount: 2261,
        avgSpend: 8.90,
        purchaseFrequency: 1.2,
        churnRiskPct: 28.7,
        cltv: 52
      }
    ];

    segments.forEach(segment => {
      this.customerSegmentsMap.set(segment.id, segment);
    });
  }

  async getPetNutritionData(): Promise<PetNutritionData[]> {
    return Array.from(this.petNutritionDataMap.values());
  }

  async getPetNutritionDataByUpc(upc: string): Promise<PetNutritionData | undefined> {
    return Array.from(this.petNutritionDataMap.values()).find(data => data.upc === upc);
  }

  async createPetNutritionData(data: InsertPetNutritionData): Promise<PetNutritionData> {
    const id = this.currentId++;
    const newData: PetNutritionData = { ...data, id };
    this.petNutritionDataMap.set(id, newData);
    return newData;
  }

  async getForecastResults(upc?: string): Promise<ForecastResult[]> {
    const results = Array.from(this.forecastResultsMap.values());
    return upc ? results.filter(result => result.upc === upc) : results;
  }

  async createForecastResult(data: InsertForecastResult): Promise<ForecastResult> {
    const id = this.currentId++;
    const newResult: ForecastResult = { 
      ...data, 
      id, 
      createdAt: new Date() 
    };
    this.forecastResultsMap.set(id, newResult);
    return newResult;
  }

  async getSimulationResults(): Promise<SimulationResult[]> {
    return Array.from(this.simulationResultsMap.values());
  }

  async createSimulationResult(data: InsertSimulationResult): Promise<SimulationResult> {
    const id = this.currentId++;
    const newResult: SimulationResult = { 
      ...data, 
      id, 
      createdAt: new Date()
    };
    this.simulationResultsMap.set(id, newResult);
    return newResult;
  }

  async getCustomerSegments(): Promise<CustomerSegment[]> {
    return Array.from(this.customerSegmentsMap.values());
  }

  async createCustomerSegment(data: InsertCustomerSegment): Promise<CustomerSegment> {
    const id = this.currentId++;
    const newSegment: CustomerSegment = { ...data, id };
    this.customerSegmentsMap.set(id, newSegment);
    return newSegment;
  }

  async updateCustomerSegment(id: number, data: Partial<InsertCustomerSegment>): Promise<CustomerSegment> {
    const existing = this.customerSegmentsMap.get(id);
    if (!existing) {
      throw new Error(`Customer segment with id ${id} not found`);
    }
    const updated = { ...existing, ...data };
    this.customerSegmentsMap.set(id, updated);
    return updated;
  }

  async getInsights(): Promise<Insight[]> {
    return Array.from(this.insightsMap.values());
  }

  async createInsight(data: InsertInsight): Promise<Insight> {
    const id = this.currentId++;
    const newInsight: Insight = { 
      ...data, 
      id, 
      createdAt: new Date(),
      impact: data.impact || null
    };
    this.insightsMap.set(id, newInsight);
    return newInsight;
  }

  async getInsightsByType(type: string): Promise<Insight[]> {
    return Array.from(this.insightsMap.values()).filter(insight => insight.type === type);
  }
}

export const storage = new MemStorage();

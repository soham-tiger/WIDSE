# Pet Nutrition Analytics App

## Overview

This is a full-stack pet nutrition analytics platform built with React (frontend) and Express.js (backend). The application provides CPG analytics, forecasting capabilities, and AI-driven insights for pet nutrition data. It features a modern dashboard with charts, simulations, and customer segmentation tools.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **Styling**: Tailwind CSS with shadcn/ui component library using the "new-york" style
- **State Management**: React Query (TanStack Query) for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Chart.js for data visualization (sales trends, forecasts, customer segments)
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with structured route handlers
- **Development**: Hot reload with Vite middleware integration

### Key Components

#### Data Layer
- **Drizzle ORM**: Type-safe database schema and queries
- **Schema**: Comprehensive pet nutrition data model including sales metrics, forecasts, simulations, customer segments, and insights
- **Storage**: In-memory storage implementation with interface for future database integration

#### Business Logic Services
- **Forecast Service**: Prophet-like forecasting algorithm with seasonality and trend analysis
- **Simulation Service**: Price elasticity and market impact modeling
- **Insights Service**: AI-powered strategic recommendations using OpenAI GPT-4o
- **OpenAI Integration**: Natural language processing for chat and insights generation

#### Frontend Pages
- **Overview**: Performance dashboard with key metrics and charts
- **Drivers**: Interactive scenario simulation with sliders and controls
- **Customers**: Customer segmentation analysis and behavioral insights
- **Insights**: AI-generated recommendations and chat interface

## Data Flow

1. **Data Ingestion**: Pet nutrition data is stored in PostgreSQL tables
2. **API Layer**: Express routes handle CRUD operations and business logic
3. **Frontend Queries**: React Query manages API calls with caching and state synchronization
4. **Chart Rendering**: Chart.js components display real-time data visualizations
5. **AI Processing**: OpenAI API processes data for insights and chat responses

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (PostgreSQL serverless)
- **AI**: OpenAI API for GPT-4o chat and insights
- **UI**: Radix UI components for accessible interface elements
- **Charts**: Chart.js for data visualization
- **Validation**: Zod for runtime type checking and API validation

### Development Tools
- **Build**: Vite for fast development and optimized production builds
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast backend compilation for production
- **Tailwind CSS**: Utility-first styling with custom design system

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with hot module replacement
- **Backend**: tsx for TypeScript execution with auto-restart
- **Database**: Drizzle Kit for schema migrations and development

### Production
- **Frontend**: Static build output served by Express
- **Backend**: Compiled JavaScript bundle with ESBuild
- **Database**: Production PostgreSQL with connection pooling
- **Environment**: Node.js with ES modules support

### Build Process
1. Frontend builds to `dist/public` directory
2. Backend compiles to `dist/index.js`
3. Static assets served by Express in production
4. Database migrations applied via Drizzle Kit

## Changelog
- July 05, 2025: Initial setup and architecture implementation
- July 05, 2025: Implemented comprehensive data science models without OpenAI API dependency
- July 05, 2025: Created mock AI services with realistic business intelligence responses
- July 05, 2025: Added driver impact visualization and enhanced simulation engine

## Recent Changes

✓ **Data Science Models**: Implemented forecasting (Prophet-like), simulation (elasticity-based), customer segmentation, and insights generation
✓ **Mock AI Services**: Created sophisticated pattern-matching responses for chat and insights without requiring OpenAI API
✓ **Driver Impact Chart**: Added visualization component for simulation results breakdown
✓ **Documentation**: Created comprehensive technical documentation for data science team
✓ **API Integration**: Full RESTful API with validation and error handling
→ **In Progress**: Final testing and refinement of simulation accuracy

## User Preferences

Preferred communication style: Simple, everyday language.
Current focus: Building realistic data science models without external API dependencies.
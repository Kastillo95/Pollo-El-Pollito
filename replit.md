# Pollo Fresco El Pollito - Farm Management System

## Overview

This is a comprehensive poultry farm management system for "Pollo Fresco El Pollito," a chicken farm operation. The application provides complete farm management capabilities including inventory tracking, purchase management, expense tracking, activity scheduling, sales with invoice generation, and mortality monitoring.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom theme variables
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Form Management**: React Hook Form with Zod validation
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API**: RESTful API with JSON responses
- **Session Management**: Express sessions with PostgreSQL storage

### Database Schema
The system uses PostgreSQL with the following main entities:
- **Coops**: Farm buildings/housing units with chicken inventory
- **Purchases**: Record of all purchases (chickens, feed, medicine, equipment)
- **Expenses**: Operating expenses categorized by type
- **Activities**: Scheduled farm activities (cleaning, feeding, vaccination)
- **Invoices**: Sales invoices with WhatsApp integration
- **Mortalities**: Death records for livestock tracking

## Key Components

### Farm Management
- **Inventory System**: Track chicken quantities across 7 coops with age calculations
- **Activity Scheduler**: Manage recurring and one-time farm activities
- **Mortality Tracking**: Monitor and record livestock deaths

### Financial Management
- **Purchase Tracking**: Record purchases with supplier information
- **Expense Management**: Categorize and track operational expenses
- **Sales & Invoicing**: Generate invoices with automatic WhatsApp sharing

### User Interface
- **Dashboard**: Overview of farm status with notifications
- **Tab-based Navigation**: Clean interface for different management areas
- **Responsive Design**: Mobile-friendly layout
- **Theme**: Custom poultry-themed color scheme with orange/brown palette

## Data Flow

1. **Client Interaction**: User interacts with React components
2. **State Management**: TanStack Query manages API calls and caching
3. **API Layer**: Express.js handles HTTP requests
4. **Data Validation**: Zod schemas validate input data
5. **Database Operations**: Drizzle ORM executes SQL queries
6. **Response**: JSON data flows back through the stack

## External Dependencies

### Core Technologies
- **Database**: Neon Database (PostgreSQL)
- **UI Framework**: React with TypeScript
- **Styling**: Tailwind CSS + Radix UI
- **ORM**: Drizzle with PostgreSQL dialect
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Fetch API with React Query

### Development Tools
- **Build**: Vite with React plugin
- **Development**: tsx for TypeScript execution
- **Production**: esbuild for server bundling
- **Database**: Drizzle Kit for migrations

### External Services
- **WhatsApp Integration**: Web API for invoice sharing
- **Image Assets**: Unsplash for placeholder images
- **Deployment**: Replit with autoscale deployment

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20
- **Port**: 5000 (internal) mapped to 80 (external)
- **Hot Reload**: Vite development server with HMR
- **Database**: Neon Database connection via environment variables

### Production Build
- **Client**: Vite builds React app to `dist/public`
- **Server**: esbuild bundles Express server to `dist/index.js`
- **Assets**: Static files served from build directory
- **Process**: Single Node.js process handling both API and static files

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: development/production environment flag
- **PORT**: Server port (defaults to 5000)

## Changelog
```
Changelog:
- December 25, 2024. Initial setup and migration
- December 25, 2024. Fixed inventory update validation and improved invoice preview
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```
# Portfolio Management System API Documentation

## Overview
This document outlines the API endpoints required for the Portfolio Management System, which manages portfolio companies, acquisition targets, and synergy analysis.

## Base URL
```
https://vantagesourcing.politegrass-fa8c30a6.eastus.azurecontainerapps.io
```

## Swagger Documentation
Interactive API documentation is available at:
```
https://vantagesourcing.politegrass-fa8c30a6.eastus.azurecontainerapps.io/swagger-ui/index.htm
```

## Authentication
All API endpoints require authentication. Include the following header:
```
Authorization: Bearer {access_token}
```

## Data Models

### PortfolioCompany
```typescript
interface PortfolioCompany {
  id: number;                    // Unique identifier
  name: string;                  // Company name
  icon: string;                  // Material icon name
  industry: string;              // Industry sector
  description: string;           // Company description
  revenue: string;               // Annual revenue (e.g., "$125M")
  ebitda: string;                // EBITDA (e.g., "$38M")
  employees: number;             // Number of employees
  headquarters: string;          // Company headquarters
  logo: string;                  // Company logo/emoji
  synergyScore: number;          // Synergy score (0-10)
  keyProducts: string[];         // Array of key products/services
  sponsor: string;               // Private equity sponsor
  portfolioDuration: string;     // Time in portfolio (e.g., "2 years, 8 months")
  addonHistory: string[];        // Array of add-on acquisition history
}
```

### AcquisitionTarget
```typescript
interface AcquisitionTarget {
  id: number;                    // Unique identifier
  name: string;                  // Company name
  description: string;           // Company description
  score: number;                 // Acquisition score (0-10)
  industry: string;              // Industry sector
  revenue: string;               // Annual revenue
  ebitda: string;                // EBITDA
  employees: number;             // Number of employees
  headquarters: string;          // Company headquarters
  synergyScore: number;          // Synergy score (0-10)
  keyProducts: string[];         // Array of key products/services
}
```

### TargetCompanySynergy
```typescript
interface TargetCompanySynergy {
  companyName: string;           // Company name
  name: string;                  // Company name (for template compatibility)
  industry: string;              // Industry sector
  description: string;           // Company description
  revenue: string;               // Annual revenue
  ebitda: string;                // EBITDA
  employees: number;             // Number of employees
  headquarters: string;          // Company headquarters
  synergyScore: number;          // Synergy score (0-10)
  keyProducts: string[];         // Array of key products/services
  synergies: SynergyDetail[];    // Array of synergy details
  financialMetrics: FinancialMetrics; // Financial metrics
  risks: string[];               // Array of risk factors
  sponsor: string;               // Private equity sponsor
  portfolioDuration: string;     // Time in portfolio
  addonHistory: string[];        // Array of add-on acquisition history
}
```

### SynergyDetail
```typescript
interface SynergyDetail {
  type: string;                  // Synergy type (e.g., "Product Integration")
  description: string;           // Detailed description
  impact: 'High' | 'Medium' | 'Low'; // Impact level
  timeline: string;              // Implementation timeline (e.g., "6-12 months")
  value: string;                 // Expected value (e.g., "$15M annual revenue increase")
}
```

### FinancialMetrics
```typescript
interface FinancialMetrics {
  valuation: string;             // Company valuation (e.g., "$120M")
  multiple: string;              // EBITDA multiple (e.g., "4.3x EBITDA")
  growthRate: string;            // Growth rate (e.g., "25% YoY")
  profitMargin: string;          // Profit margin (e.g., "33%")
}
```

### ApiResponse
```typescript
interface ApiResponse<T> {
  success: boolean;              // Request success status
  data: T;                      // Response data
  message: string;               // Response message
}
```

## API Endpoints

### 1. Get All Portfolio Companies
**Endpoint:** `GET /api/dashboard/portfolio/all`

**Description:** Retrieves a list of all portfolio companies.

**Response:**
```typescript
ApiResponse<PortfolioCompany[]>
```

**Example Request:**
```bash
curl -X 'GET' \
  'https://vantagesourcing.politegrass-fa8c30a6.eastus.azurecontainerapps.io/api/dashboard/portfolio/all' \
  -H 'accept: */*'
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "OptiCore Solutions",
      "icon": "business",
      "industry": "Enterprise Software",
      "description": "OptiCore Solutions is a leading provider of cloud-based project management and collaboration software...",
      "revenue": "$125M",
      "ebitda": "$38M",
      "employees": 450,
      "headquarters": "San Francisco, CA",
      "logo": "🏢",
      "synergyScore": 8.5,
      "keyProducts": [
        "Cloud Project Management",
        "Team Collaboration Tools",
        "Project Analytics Platform",
        "Workflow Automation"
      ],
      "sponsor": "TechVentures Capital",
      "portfolioDuration": "2 years, 8 months",
      "addonHistory": [
        "2022: Initial acquisition",
        "2023: Launched cloud platform",
        "2024: Expanded to enterprise clients"
      ]
    }
  ],
  "message": "Portfolio companies retrieved successfully"
}
```

### 2. Get Portfolio Company with Acquisition Targets
**Endpoint:** `GET /portfolio?companyId={id}&companyName={name}`

**Description:** Retrieves portfolio company details along with potential acquisition targets.

**Query Parameters:**
- `companyId` (required): Portfolio company ID
- `companyName` (required): Portfolio company name (URL encoded)

**Response:**
```typescript
interface PortfolioCompanyResponse {
  portfolioCompany: PortfolioCompany;
  acquisitionTargets: AcquisitionTarget[];
}
```

**Example Request:**
```bash
curl -X 'GET' \
  'https://vantagesourcing.politegrass-fa8c30a6.eastus.azurecontainerapps.io/portfolio?companyId=1&companyName=Abc' \
  -H 'accept: */*'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "portfolioCompany": {
      "id": 1,
      "name": "OptiCore Solutions",
      // ... portfolio company details
    },
    "acquisitionTargets": [
      {
        "id": 1,
        "name": "DataStream Analytics",
        "description": "Real-time data processing and business intelligence solutions",
        "score": 9.2,
        "industry": "Data Analytics",
        "revenue": "$85M",
        "ebitda": "$28M",
        "employees": 320,
        "headquarters": "Austin, TX",
        "synergyScore": 9.2,
        "keyProducts": [
          "Real-time Analytics Platform",
          "Machine Learning Models",
          "Business Intelligence Tools",
          "Data Visualization Suite"
        ]
      }
    ]
  },
  "message": "Portfolio company and acquisition targets retrieved successfully"
}
```

### 3. Get Target Company Synergies
**Endpoint:** `GET /portfolio/target?buyerCompanyId={id}&targetCompanyId={id}`

**Description:** Retrieves detailed synergy information for a specific acquisition target.

**Query Parameters:**
- `buyerCompanyId` (required): Portfolio company ID (buyer)
- `targetCompanyId` (required): Target company ID (format: T1, T2, etc.)

**Response:**
```typescript
interface TargetCompanyResponse {
  targetCompany: TargetCompanySynergy;
  buyerCompanyId: string;
  targetCompanyId: string;
}
```

**Example Request:**
```bash
curl -X 'GET' \
  'https://vantagesourcing.politegrass-fa8c30a6.eastus.azurecontainerapps.io/portfolio/target?buyerCompanyId=1&targetCompanyId=T1' \
  -H 'accept: */*'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "targetCompany": {
      "companyName": "DataStream Analytics",
      "name": "DataStream Analytics",
      "industry": "Data Analytics",
      "description": "Real-time data processing and business intelligence solutions",
      "revenue": "$85M",
      "ebitda": "$28M",
      "employees": 320,
      "headquarters": "Austin, TX",
      "synergyScore": 9.2,
      "keyProducts": [
        "Real-time Analytics Platform",
        "Machine Learning Models",
        "Business Intelligence Tools",
        "Data Visualization Suite"
      ],
      "sponsor": "Innovation Partners",
      "portfolioDuration": "1 year, 11 months",
      "addonHistory": [
        "2023: Strategic acquisition",
        "2024: Launched AI-powered analytics"
      ],
      "synergies": [
        {
          "type": "Product Integration",
          "description": "Integrate real-time analytics into OptiCore's project management platform",
          "impact": "High",
          "timeline": "6-12 months",
          "value": "$15M annual revenue increase"
        },
        {
          "type": "Market Expansion",
          "description": "Access to DataStream's enterprise analytics customer base",
          "impact": "Medium",
          "timeline": "12-18 months",
          "value": "$8M new market opportunity"
        }
      ],
      "financialMetrics": {
        "valuation": "$120M",
        "multiple": "4.3x EBITDA",
        "growthRate": "25% YoY",
        "profitMargin": "33%"
      },
      "risks": [
        "Integration complexity with existing systems",
        "Cultural alignment between companies",
        "Regulatory compliance in data handling"
      ]
    },
    "buyerCompanyId": "1",
    "targetCompanyId": "T1"
  },
  "message": "Target company synergy details retrieved successfully"
}
```

### 4. Search Portfolio Companies
**Endpoint:** `GET /portfolio/search?q={query}`

**Description:** Searches portfolio companies by name or industry.

**Query Parameters:**
- `q` (required): Search query

**Response:**
```typescript
ApiResponse<PortfolioCompany[]>
```

**Example Request:**
```
GET /portfolio/search?q=analytics
```

### 5. Get Portfolio Companies by Industry
**Endpoint:** `GET /portfolio/industry/{industry}`

**Description:** Retrieves portfolio companies filtered by industry.

**Path Parameters:**
- `industry` (required): Industry name

**Response:**
```typescript
ApiResponse<PortfolioCompany[]>
```

**Example Request:**
```
GET /portfolio/industry/Enterprise%20Software
```

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

### HTTP Status Codes
- `200 OK`: Request successful
- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

### Common Error Codes
- `INVALID_COMPANY_ID`: Invalid company ID format
- `COMPANY_NOT_FOUND`: Company does not exist
- `INVALID_QUERY_PARAMS`: Missing or invalid query parameters
- `SYNERGY_DATA_UNAVAILABLE`: Synergy data not available for target company

## Rate Limiting
- **Standard endpoints**: 100 requests per minute per user
- **Search endpoints**: 50 requests per minute per user
- **Heavy endpoints**: 20 requests per minute per user

## Pagination
For endpoints that return large datasets, implement pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response Headers:**
- `X-Total-Count`: Total number of items
- `X-Page-Count`: Total number of pages
- `X-Current-Page`: Current page number

## Data Validation Rules

### PortfolioCompany
- `id`: Positive integer, unique
- `name`: Non-empty string, max 100 characters
- `synergyScore`: Number between 0 and 10
- `revenue`: String matching pattern `^\$\d+[KMB]$` (e.g., $125M, $50K, $2B)
- `employees`: Positive integer, max 100,000

### AcquisitionTarget
- `score`: Number between 0 and 10
- `synergyScore`: Number between 0 and 10

### SynergyDetail
- `impact`: Must be one of: "High", "Medium", "Low"
- `timeline`: String matching pattern `^\d+-\d+\s+months?$` or similar

## Testing

### Test Data
The system should include test data for development and testing purposes:
- Portfolio companies with IDs 1-6
- Acquisition targets with IDs 1-5
- Target company synergies with IDs T1-T5

### Sample Test Scenarios
1. **Dashboard Load**: `GET /api/dashboard/portfolio/all` should return 6 portfolio companies
2. **Company Selection**: `GET /portfolio?companyId=1&companyName=Abc` should return OptiCore with 5 acquisition targets
3. **Synergy Analysis**: `GET /portfolio/target?buyerCompanyId=1&targetCompanyId=T1` should return DataStream Analytics synergy details

## Implementation Notes

### Database Schema
- Use appropriate data types for monetary values (DECIMAL for financial data)
- Implement proper indexing on frequently queried fields (company ID, industry, name)
- Consider using JSON fields for complex nested data (synergies, keyProducts, addonHistory)

### Caching Strategy
- Cache portfolio company list for 5 minutes
- Cache company details for 10 minutes
- Cache synergy data for 15 minutes
- Implement cache invalidation on data updates

### Security Considerations
- Validate all input parameters
- Implement proper SQL injection prevention
- Use parameterized queries
- Implement request logging for audit trails

## Support
For questions or clarifications about this API specification, contact the development team.

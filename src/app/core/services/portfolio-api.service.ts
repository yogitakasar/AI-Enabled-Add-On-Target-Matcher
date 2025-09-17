import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// New Organization interface based on the API response
export interface Organization {
  organizationId: number;
  orgExternalId: string;
  name: string;
  country: string;
  headquarters: string;
  industry: string;
}

// Updated PortfolioCompany interface to match new API response structure
export interface PortfolioCompany {
  companyId: number;
  companyExternalId: string;
  name: string;
  icon: string;
  industry: string;
  description: string;
  revenue: string;
  ebitda: string;
  employees: number;
  headquarters: string;
  logo: string;
  synergyScore: number;
  sponsor: string;
  portfolioDuration: string;
  sector: string;
  subSector: string;
  country: string;
  website: string;
  founderLed: boolean;
  vcBacked: boolean;
  keyProducts: KeyProduct[];
  addonHistory: AddonHistory[];
  buyerPairs: BuyerPair[];
  targetPairs: any[];
  portfolio: boolean;
}

export interface KeyProduct {
  productId: number;
  companyId: number;
  productName: string;
  description: string;
}

export interface AddonHistory {
  addonId: number;
  companyId: number;
  addonName: string;
  details: string;
}

export interface BuyerPair {
  companyPairId: number;
  externalPairId: string;
  buyerCompanyId: number;
  targetCompanyId: number;
  synergyScore: number;
  synergyRationale: string;
  buyerAppetite: number;
  targetReadiness: number | null;
  sectorOverlap: string;
  runId: string;
  geo: GeoInfo[];
  evidence: Evidence[];
}

export interface GeoInfo {
  id: {
    companyPairId: number;
    countryCode: string;
  };
  countryCode: string;
}

export interface Evidence {
  evidenceId: number;
  source: string;
  details: string;
  createdUtc: string | null;
}

// New interface for portfolio response from /portfolio/all endpoint
export interface PortfolioResponse {
  portfolioCompany: PortfolioCompany;
  acquisitionTargets: any;
  buyers: any;
}

// Updated AcquisitionTarget interface to match new API response structure
// This is the same as PortfolioCompany since acquisition targets have the same structure
export interface AcquisitionTarget {
  companyId: number;
  companyExternalId: string;
  name: string;
  icon: string;
  industry: string;
  description: string;
  revenue: string;
  ebitda: string;
  employees: number;
  headquarters: string;
  logo: string;
  synergyScore: number;
  sponsor: string;
  portfolioDuration: string;
  sector: string;
  subSector: string;
  country: string;
  website: string;
  founderLed: boolean;
  vcBacked: boolean;
  keyProducts: KeyProduct[];
  addonHistory: AddonHistory[];
  buyerPairs: BuyerPair[];
  targetPairs: any[];
  portfolio: boolean;
}

export interface SynergyDetail {
  type: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  timeline: string;
  value: string;
}

export interface FinancialMetrics {
  valuation: string;
  multiple: string;
  growthRate: string;
  profitMargin: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

// Updated PortfolioCompanyResponse interface to match the new API response structure
export interface PortfolioCompanyResponse {
  portfolioCompany: PortfolioCompany;
  acquisitionTargets: AcquisitionTarget[];
  buyers: any[];
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioApiService {
  private readonly baseUrl = 'https://vantagesourcing.kindwater-5fa69381.eastus.azurecontainerapps.io';
  private readonly portfolioUrl = 'https://vantagesourcing.purplebay-2788e3f9.eastus.azurecontainerapps.io/portfolio';

  constructor(private http: HttpClient) {}

  /**
   * Get all organizations
   */
  getAllOrganizations(): Observable<ApiResponse<Organization[]>> {
    return this.http.get<ApiResponse<Organization[]>>(`${this.baseUrl}/api/dashboard/getAllOrg`);
  }

  /**
   * Get portfolio companies by organization ID
   */
  getPortfolioCompaniesByOrgId(orgId: number): Observable<ApiResponse<PortfolioResponse[]>> {
    return this.http.get<ApiResponse<PortfolioResponse[]>>(`${this.baseUrl}/portfolio/all?orgId=${orgId}`);
  }

  /**
   * Get all portfolio companies (legacy method - keeping for backward compatibility)
   */
  getAllPortfolioCompanies(): Observable<ApiResponse<PortfolioCompany[]>> {
    return this.http.get<ApiResponse<PortfolioCompany[]>>(`${this.portfolioUrl}/all`);
  }

  /**
   * Get portfolio company details and acquisition targets - Updated to use new endpoint
   */
  getPortfolioCompanyWithTargets(
    companyId: number, 
    companyName: string
  ): Observable<ApiResponse<PortfolioCompanyResponse>> {
    const params = {
      companyId: companyId.toString(),
      companyName: companyName
    };
    
    const queryString = new URLSearchParams(params).toString();
    return this.http.get<ApiResponse<PortfolioCompanyResponse>>(`${this.baseUrl}/portfolio?${queryString}`);
  }

  /**
   * Search portfolio companies
   */
  searchPortfolioCompanies(query: string): Observable<ApiResponse<PortfolioCompany[]>> {
    return this.http.get<ApiResponse<PortfolioCompany[]>>(`${this.portfolioUrl}/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Get portfolio companies by industry
   */
  getPortfolioCompaniesByIndustry(industry: string): Observable<ApiResponse<PortfolioCompany[]>> {
    return this.http.get<ApiResponse<PortfolioCompany[]>>(`${this.portfolioUrl}/industry/${encodeURIComponent(industry)}`);
  }
}

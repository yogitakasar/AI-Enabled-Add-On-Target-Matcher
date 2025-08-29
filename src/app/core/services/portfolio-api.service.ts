import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PortfolioCompany {
  id: number;
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
  keyProducts: string[];
  sponsor: string;
  portfolioDuration: string;
  addonHistory: string[];
}

export interface AcquisitionTarget {
  id: number;
  name: string;
  description: string;
  score: number;
  industry: string;
  revenue: string;
  ebitda: string;
  employees: number;
  headquarters: string;
  synergyScore: number;
  keyProducts: string[];
}

export interface TargetCompanySynergy {
  companyName: string;
  name: string; // Add this for template compatibility
  industry: string;
  description: string;
  revenue: string;
  ebitda: string;
  employees: number;
  headquarters: string;
  synergyScore: number;
  keyProducts: string[];
  synergies: SynergyDetail[];
  financialMetrics: FinancialMetrics;
  risks: string[];
  sponsor: string; // Add this for template compatibility
  portfolioDuration: string; // Add this for template compatibility
  addonHistory: string[]; // Add this for template compatibility
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

export interface PortfolioCompanyResponse {
  portfolioCompany: PortfolioCompany;
  acquisitionTargets: AcquisitionTarget[];
}

export interface TargetCompanyResponse {
  targetCompany: TargetCompanySynergy;
  buyerCompanyId: string;
  targetCompanyId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortfolioApiService {
  private readonly baseUrl = '/portfolio';

  constructor(private http: HttpClient) {}

  /**
   * Get all portfolio companies
   */
  getAllPortfolioCompanies(): Observable<ApiResponse<PortfolioCompany[]>> {
    return this.http.get<ApiResponse<PortfolioCompany[]>>(`${this.baseUrl}/all`);
  }

  /**
   * Get portfolio company details and acquisition targets
   */
  getPortfolioCompanyWithTargets(
    companyId: number, 
    companyName: string
  ): Observable<ApiResponse<PortfolioCompanyResponse>> {
    const params = {
      companyId: companyId.toString(),
      companyName: encodeURIComponent(companyName)
    };
    
    const queryString = new URLSearchParams(params).toString();
    return this.http.get<ApiResponse<PortfolioCompanyResponse>>(`${this.baseUrl}?${queryString}`);
  }

  /**
   * Get target company synergy details
   */
  getTargetCompanySynergies(
    buyerCompanyId: string, 
    targetCompanyId: string
  ): Observable<ApiResponse<TargetCompanyResponse>> {
    const params = {
      buyerCompanyId: buyerCompanyId,
      targetCompanyId: targetCompanyId
    };
    
    const queryString = new URLSearchParams(params).toString();
    return this.http.get<ApiResponse<TargetCompanyResponse>>(`${this.baseUrl}?${queryString}`);
  }

  /**
   * Search portfolio companies
   */
  searchPortfolioCompanies(query: string): Observable<ApiResponse<PortfolioCompany[]>> {
    return this.http.get<ApiResponse<PortfolioCompany[]>>(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Get portfolio companies by industry
   */
  getPortfolioCompaniesByIndustry(industry: string): Observable<ApiResponse<PortfolioCompany[]>> {
    return this.http.get<ApiResponse<PortfolioCompany[]>>(`${this.baseUrl}/industry/${encodeURIComponent(industry)}`);
  }
}

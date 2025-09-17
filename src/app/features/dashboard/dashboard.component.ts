import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { 
  PortfolioApiService, 
  PortfolioCompany, 
  Organization, 
  PortfolioResponse 
} from '../../core/services/portfolio-api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  organizations: Organization[] = [];
  selectedOrganization: Organization | null = null;
  portfolioCompanies: PortfolioCompany[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    public authService: AuthService,
    private router: Router,
    private portfolioApiService: PortfolioApiService
  ) {}

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations(): void {
    this.loading = true;
    this.error = null;
    
    this.portfolioApiService.getAllOrganizations().subscribe({
      next: (response) => {
        if (response.success) {
          this.organizations = response.data;
          console.log('Organizations loaded:', this.organizations);
          
          // Select first organization by default
          if (this.organizations.length > 0) {
            this.selectedOrganization = this.organizations[0];
            this.loadPortfolioCompanies();
          }
        } else {
          this.error = response.message || 'Failed to load organizations';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading organizations:', err);
        this.error = 'Failed to load organizations. Please try again.';
        this.loading = false;
      }
    });
  }

  onOrganizationChange(): void {
    if (this.selectedOrganization) {
      this.loadPortfolioCompanies();
    }
  }

  loadPortfolioCompanies(): void {
    if (!this.selectedOrganization) return;
    
    this.loading = true;
    this.error = null;
    
    this.portfolioApiService.getPortfolioCompaniesByOrgId(this.selectedOrganization.organizationId).subscribe({
      next: (response) => {
        if (response.success) {
          // Extract portfolio companies from the response structure
          this.portfolioCompanies = response.data.map((item: PortfolioResponse) => item.portfolioCompany);
          console.log('Portfolio companies loaded:', this.portfolioCompanies);
        } else {
          this.error = response.message || 'Failed to load portfolio companies';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading portfolio companies:', err);
        this.error = 'Failed to load portfolio companies. Please try again.';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  onCompanyClick(company: PortfolioCompany): void {
    console.log('Company clicked:', company);
    
    // Use the updated company ID field
    this.portfolioApiService.getPortfolioCompanyWithTargets(company.companyId, company.name).subscribe({
      next: (response) => {
        console.log('API response received:', response);
        if (response.success) {
          // Navigate to synergy analysis with the data
          this.router.navigate(['/synergy-analysis', company.companyId], {
            queryParams: { companyName: company.name },
            state: { 
              portfolioCompany: response.data.portfolioCompany,
              acquisitionTargets: response.data.acquisitionTargets
            }
          });
        } else {
          console.error('Failed to load company data:', response.message);
          // Fallback to old navigation
          this.router.navigate(['/synergy-analysis', company.companyId]);
        }
      },
      error: (err) => {
        console.error('Error loading company data:', err);
        // Fallback to old navigation
        this.router.navigate(['/synergy-analysis', company.companyId]);
      }
    });
  }
}

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
import { PortfolioApiService, PortfolioCompany } from '../../core/services/portfolio-api.service';

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
    MatFormFieldModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  portfolioCompanies: PortfolioCompany[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    public authService: AuthService,
    private router: Router,
    private portfolioApiService: PortfolioApiService
  ) {}

  ngOnInit(): void {
    this.loadPortfolioCompanies();
  }

  loadPortfolioCompanies(): void {
    this.loading = true;
    this.error = null;
    
    this.portfolioApiService.getAllPortfolioCompanies().subscribe({
      next: (response) => {
        if (response.success) {
          this.portfolioCompanies = response.data;
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
    
    this.portfolioApiService.getPortfolioCompanyWithTargets(company.id, company.name).subscribe({
      next: (response) => {
        console.log('API response received:', response);
        if (response.success) {
          // Navigate to synergy analysis with the data
          this.router.navigate(['/synergy-analysis', company.id], {
            state: { 
              portfolioCompany: response.data.portfolioCompany,
              acquisitionTargets: response.data.acquisitionTargets
            }
          });
        } else {
          console.error('Failed to load company data:', response.message);
          // Fallback to old navigation
          this.router.navigate(['/synergy-analysis', company.id]);
        }
      },
      error: (err) => {
        console.error('Error loading company data:', err);
        // Fallback to old navigation
        this.router.navigate(['/synergy-analysis', company.id]);
      }
    });
  }
}

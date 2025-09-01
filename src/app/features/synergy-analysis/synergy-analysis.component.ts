import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PortfolioApiService, AcquisitionTarget, PortfolioCompany } from '../../core/services/portfolio-api.service';


@Component({
  selector: 'app-synergy-analysis',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './synergy-analysis.component.html',
  styleUrls: ['./synergy-analysis.component.scss']
})
export class SynergyAnalysisComponent implements OnInit {
  selectedCompany: PortfolioCompany | null = null;
  potentialAcquisitions: AcquisitionTarget[] = [];
  loading = false;
  error: string | null = null;
  lastCompanyId: number = 1;
  lastCompanyName: string = 'OptiCore Solutions';

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private portfolioApiService: PortfolioApiService
  ) {}

  ngOnInit() {
    // Use any navigation state for immediate display, but still fetch fresh data
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as any;
      if (state.portfolioCompany && state.acquisitionTargets) {
        console.log('Using data from navigation state:', state);
        this.selectedCompany = state.portfolioCompany;
        this.potentialAcquisitions = state.acquisitionTargets;
      }
    }

    // Always fetch based on current route/query params and keep them updated
    this.route.paramMap.subscribe(paramMap => {
      const idStr = paramMap.get('id') || '1';
      this.lastCompanyId = parseInt(idStr, 10);
      const companyName = this.route.snapshot.queryParamMap.get('companyName') || this.selectedCompany?.name || 'OptiCore Solutions';
      this.lastCompanyName = companyName;
      console.log(`Fetching data for company ID: ${this.lastCompanyId}, Name: ${this.lastCompanyName}`);
      this.loadCompanyData(this.lastCompanyId, this.lastCompanyName);
    });
  }

  loadCompanyData(companyId: number, companyName: string): void {
    this.loading = true;
    this.error = null;

    this.portfolioApiService.getPortfolioCompanyWithTargets(
      companyId,
      companyName
    ).subscribe({
      next: (response) => {
        console.log('API response:', response);
        this.loading = false;
        
        if (response.success && response.data) {
          this.selectedCompany = response.data.portfolioCompany;
          this.potentialAcquisitions = response.data.acquisitionTargets;
        } else {
          this.error = response.message || 'Failed to load company data';
          console.error('API error:', response.message);
        }
      },
      error: (err) => {
        console.error('Error fetching company data:', err);
        this.loading = false;
        this.error = 'Failed to load company data. Please try again.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  onAcquisitionClick(acquisition: AcquisitionTarget): void {
    console.log('Acquisition target clicked:', acquisition);
    
    // Get the current portfolio company ID from the route
    const portfolioCompanyId = this.route.snapshot.paramMap.get('id') || '1';
    
    // Create target company ID (T1, T2, etc.)
    const targetCompanyId = `${acquisition.id}`;
    
    console.log(`Calling API: /portfolio?buyerCompanyId=${portfolioCompanyId}&targetCompanyId=${targetCompanyId}`);
    
    // Call the new API endpoint to get target company synergy details
    this.portfolioApiService.getTargetCompanySynergies(portfolioCompanyId, targetCompanyId).subscribe({
      next: (response) => {
        console.log('Target company synergy API response:', response);
                 if (response.success) {
           // Navigate to company analysis with the synergy data
           const navigationState = { 
             targetCompany: response.data.targetCompany,
             buyerCompanyId: response.data.buyerCompanyId,
             buyerCompanyName: this.selectedCompany?.name || 'Portfolio Company',
             targetCompanyId: response.data.targetCompanyId
           };
           
           console.log('Navigation state being sent:', navigationState);
           
           this.router.navigate(['/company-analysis', acquisition.id], {
             state: navigationState
           });
        } else {
          console.error('Failed to load target company synergy data:', response.message);
          // Fallback to old navigation
          this.router.navigate(['/company-analysis', acquisition.id]);
        }
      },
      error: (err) => {
        console.error('Error loading target company synergy data:', err);
        // Fallback to old navigation
        this.router.navigate(['/company-analysis', acquisition.id]);
      }
    });
  }
}

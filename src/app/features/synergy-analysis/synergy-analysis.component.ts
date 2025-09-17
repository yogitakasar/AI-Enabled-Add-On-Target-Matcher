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

  ngOnInit(): void {
    // Get company ID from route parameters
    const companyId = this.route.snapshot.paramMap.get('id');
    const companyName = this.route.snapshot.queryParamMap.get('companyName');
    
    if (companyId) {
      this.lastCompanyId = parseInt(companyId, 10);
    }
    
    if (companyName) {
      this.lastCompanyName = companyName;
    }

    // Check if we have data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const state = navigation.extras.state as any;
      this.selectedCompany = state.portfolioCompany;
      this.potentialAcquisitions = state.acquisitionTargets || [];
      console.log('Loaded data from navigation state:', { 
        selectedCompany: this.selectedCompany, 
        acquisitions: this.potentialAcquisitions 
      });
    } else {
      // Fallback: load data from API
      this.loadCompanyData();
    }
  }

  loadCompanyData(): void {
    this.loading = true;
    this.error = null;
    
    this.portfolioApiService.getPortfolioCompanyWithTargets(this.lastCompanyId, this.lastCompanyName).subscribe({
      next: (response) => {
        if (response.success) {
          this.selectedCompany = response.data.portfolioCompany;
          this.potentialAcquisitions = response.data.acquisitionTargets;
          console.log('Company data loaded:', { 
            selectedCompany: this.selectedCompany, 
            acquisitions: this.potentialAcquisitions 
          });
        } else {
          this.error = response.message || 'Failed to load company data';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading company data:', err);
        this.error = 'Failed to load company data. Please try again.';
        this.loading = false;
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  onAcquisitionClick(acquisition: AcquisitionTarget): void {
    console.log('Acquisition target clicked:', acquisition);
    
    // Navigate directly to company analysis with the acquisition target data
    // Since we already have all the data from the portfolio API response
    const navigationState = { 
      targetCompany: acquisition,
      buyerCompanyId: this.selectedCompany?.companyId?.toString() || '1',
      buyerCompanyName: this.selectedCompany?.name || 'Portfolio Company',
      targetCompanyId: acquisition.companyId?.toString() || '1'
    };
    
    console.log('Navigation state being sent:', navigationState);
    
    this.router.navigate(['/company-analysis', acquisition.companyId], {
      state: navigationState
    });
  }
}

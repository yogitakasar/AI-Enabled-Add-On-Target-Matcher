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
import { AcquisitionTarget, SynergyDetail } from '../../core/services/portfolio-api.service';

@Component({
  selector: 'app-company-analysis',
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
  templateUrl: './company-analysis.component.html',
  styleUrls: ['./company-analysis.component.scss']
})
export class CompanyAnalysisComponent implements OnInit {
  selectedCompany: AcquisitionTarget | null = null;
  buyerCompanyName: string = '';
  targetCompanyName: string = '';
  loading = false;
  error: string | null = null;
  portfolioCompanies = [
    { name: 'GreenTech Solutions Inc.', isSelected: true },
    { name: 'Global Logistics Corp.' },
    { name: 'HealthBridge Medical' },
    { name: 'EduPath Online Learning' }
  ];

  synergyTypes: Array<{
    title: string;
    icon: string;
    description: string;
    impact?: string;
    timeline?: string;
    value?: string;
    examples: string[];
    synergyScore?: number;
    synergyRationale?: string;}>=[]
  // }> = [
  //   {
  //     title: 'Cost Synergy',
  //     icon: 'attach_money',
  //     description: 'Reduction in operational expenses through economies of scale, shared services, or optimized procurement.',
  //     examples: [
  //       'Consolidated IT infrastructure for 15% savings.',
  //       'Bulk purchasing agreements for raw materials.',
  //       'Streamlined administrative functions.'
  //     ]
  //   },
  //   {
  //     title: 'Revenue Synergy',
  //     icon: 'trending_up',
  //     description: 'Increase in revenue through cross-selling, market expansion, or new product development leveraging combined strengths.',
  //     examples: [
  //       'Cross-selling products to existing customer bases.',
  //       'Entry into new geographic markets.',
  //       'Development of hybrid product offerings.'
  //     ]
  //   },
  //   {
  //     title: 'Sector Expansion',
  //     icon: 'public',
  //     description: 'Diversification and strengthening of portfolio in new or adjacent sectors, reducing market concentration risk.',
  //     examples: [
  //       'Acquisition providing access to emerging technologies.',
  //       'Strategic entry into high-growth healthcare sub-sectors.',
  //       'Cross-sector technology transfer opportunities.'
  //     ]
  //   },
  //   {
  //     title: 'Technology Integration',
  //     icon: 'psychology',
  //     description: 'Leveraging combined technological capabilities to create innovative solutions and improve operational efficiency.',
  //     examples: [
  //       'Integration of AI/ML capabilities across portfolio.',
  //       'Shared cloud infrastructure and data platforms.',
  //       'Unified customer experience platforms.'
  //     ]
  //   },
  //   {
  //     title: 'Operational Efficiency',
  //     icon: 'speed',
  //     description: 'Streamlining operations and reducing redundancies through shared resources and best practices.',
  //     examples: [
  //       'Centralized back-office functions.',
  //       'Shared manufacturing facilities.',
  //       'Unified supply chain management.'
  //     ]
  //   }
  // ];

  portfolioData: any;
  buyers: AcquisitionTarget[] = [];
  acquisitionTargets: AcquisitionTarget[] = [];

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadAnalysisData();
  }

  loadAnalysisData(): void {
    this.loading = true;
    this.error = null;

    // Check if we have data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const state = navigation.extras.state as any;
      this.selectedCompany = state.targetCompany;
      this.buyerCompanyName = state.buyerCompanyName || 'Portfolio Company';
      this.targetCompanyName = state.targetCompany?.name || 'Target Company';
      
      // Load portfolio data if available
      if (state.portfolioData) {
        this.portfolioData = state.portfolioData;
        this.processPortfolioData();
      }
      
      console.log('Loaded data from navigation state:', {
        selectedCompany: this.selectedCompany,
        buyerCompanyName: this.buyerCompanyName,
        targetCompanyName: this.targetCompanyName,
        portfolioData: this.portfolioData
      });
      
      this.loading = false;
    } else {
      // No data available - show error
      this.error = 'No company data available. Please navigate from the dashboard.';
      this.loading = false;
    }
  }

  private processPortfolioData(): void {
    if (!this.portfolioData) return;

    this.buyers = this.portfolioData.buyers || [];
    this.acquisitionTargets = this.portfolioData.acquisitionTargets || [];
    
    // Update acquisition targets with synergy data from targetPairs
    this.acquisitionTargets.forEach(target => {
      if (target.targetPairs && target.targetPairs.length > 0) {
        // Find matching targetPair where targetCompanyId matches the target's companyId
        const matchingPair = target.targetPairs.find(pair => 
          pair.targetCompanyId === target.companyId
        );
        
        if (matchingPair) {
          // Add synergy data to the target
          target.synergyScore = matchingPair.synergyScore;
          target.description = matchingPair.synergyRationale;
        }
      }
    });

    // Update buyers with synergy data from buyerPairs
    this.buyers.forEach(buyer => {
      if (buyer.buyerPairs && buyer.buyerPairs.length > 0) {
        // Find matching buyerPair where buyerCompanyId matches the buyer's companyId
        const matchingPair = buyer.buyerPairs.find(pair => 
          pair.buyerCompanyId === buyer.companyId
        );
        
        if (matchingPair) {
          // Add synergy data to the buyer
          buyer.synergyScore = matchingPair.synergyScore;
          buyer.description = matchingPair.synergyRationale;
        }
      }
    });
  }



 

  private getImpactFromScore(score: number): string {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
  }

  getBuyerSynergyScore(buyer: AcquisitionTarget): number {
    if (!this.selectedCompany || !buyer.buyerPairs) return 0;
    
    // Find the synergy score for this buyer-target pair
    const matchingPair = buyer.buyerPairs.find(pair => 
      pair.targetCompanyId === this.selectedCompany?.companyId
    );
    
    return matchingPair?.synergyScore || 0;
  }

  logout(): void {
    this.authService.logout();
  }
}

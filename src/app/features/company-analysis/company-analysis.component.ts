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
  }> = [
    {
      title: 'Cost Synergy',
      icon: 'attach_money',
      description: 'Reduction in operational expenses through economies of scale, shared services, or optimized procurement.',
      examples: [
        'Consolidated IT infrastructure for 15% savings.',
        'Bulk purchasing agreements for raw materials.',
        'Streamlined administrative functions.'
      ]
    },
    {
      title: 'Revenue Synergy',
      icon: 'trending_up',
      description: 'Increase in revenue through cross-selling, market expansion, or new product development leveraging combined strengths.',
      examples: [
        'Cross-selling products to existing customer bases.',
        'Entry into new geographic markets.',
        'Development of hybrid product offerings.'
      ]
    },
    {
      title: 'Sector Expansion',
      icon: 'public',
      description: 'Diversification and strengthening of portfolio in new or adjacent sectors, reducing market concentration risk.',
      examples: [
        'Acquisition providing access to emerging technologies.',
        'Strategic entry into high-growth healthcare sub-sectors.',
        'Cross-sector technology transfer opportunities.'
      ]
    },
    {
      title: 'Technology Integration',
      icon: 'psychology',
      description: 'Leveraging combined technological capabilities to create innovative solutions and improve operational efficiency.',
      examples: [
        'Integration of AI/ML capabilities across portfolio.',
        'Shared cloud infrastructure and data platforms.',
        'Unified customer experience platforms.'
      ]
    },
    {
      title: 'Operational Efficiency',
      icon: 'speed',
      description: 'Streamlining operations and reducing redundancies through shared resources and best practices.',
      examples: [
        'Centralized back-office functions.',
        'Shared manufacturing facilities.',
        'Unified supply chain management.'
      ]
    }
  ];

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
      
      console.log('Loaded data from navigation state:', {
        selectedCompany: this.selectedCompany,
        buyerCompanyName: this.buyerCompanyName,
        targetCompanyName: this.targetCompanyName
      });
      
      this.loading = false;
    } else {
      // Fallback: load mock data
      this.loadMockData();
    }
  }

  private loadMockData(): void {
    // Mock data for demonstration
    this.selectedCompany = {
      companyId: 1,
      companyExternalId: 'c0001',
      name: 'Acme Data Labs',
      icon: 'business',
      industry: 'Data & AI Platform',
      description: 'AI-driven analytics platform',
      revenue: '$200M',
      ebitda: '$50M',
      employees: 600,
      headquarters: 'Boston, MA',
      logo: '🏢',
      synergyScore: 7.5,
      sponsor: 'TechVentures Capital',
      portfolioDuration: '3 years',
      sector: 'Data & AI',
      subSector: 'Analytics',
      country: 'US',
      website: 'https://acme.com',
      founderLed: true,
      vcBacked: true,
      keyProducts: [],
      addonHistory: [],
      buyerPairs: [],
      targetPairs: [],
      portfolio: true
    };
    
    this.buyerCompanyName = 'Portfolio Company';
    this.targetCompanyName = this.selectedCompany.name;
    this.loading = false;
  }

  logout(): void {
    this.authService.logout();
  }

  private updateSynergyTypesWithRealData(targetCompany: AcquisitionTarget): void {
    // Since AcquisitionTarget doesn't have synergies property, we'll use the existing synergy types
    // The synergy types are already defined in the component, so we don't need to update them
    console.log('Using existing synergy types for company:', targetCompany.name);
  }

  private getSynergyIcon(synergyType: string): string {
    const iconMap: { [key: string]: string } = {
      'Product Integration': 'integration_instructions',
      'Market Expansion': 'public',
      'Technology Synergy': 'psychology',
      'Operational Efficiency': 'speed',
      'AI Enhancement': 'smart_toy',
      'User Experience': 'person',
      'Security Enhancement': 'security',
      'Compliance': 'verified',
      'Integration Capability': 'hub',
      'Developer Experience': 'code'
    };
    return iconMap[synergyType] || 'star';
  }

  private getCompanyData(companyId: string): any {
    const companies: { [key: string]: any } = {
      '1': {
        name: 'Acme Data Labs',
        industry: 'Data & AI Platform',
        description: 'AI-driven analytics platform',
        revenue: '$200M',
        ebitda: '$50M',
        employees: 600,
        headquarters: 'Boston, MA',
        synergyScore: 7.5,
        keyProducts: [
          'Acme Insight Engine',
          'Acme CloudHub'
        ],
        addonHistory: [
          'Acquired DataStream Corp'
        ]
      },
      '2': {
        name: 'Nimbus Analytics',
        industry: 'Data & AI Platform',
        description: 'Cloud-native BI software',
        revenue: '$125M',
        ebitda: '$38M',
        employees: 450,
        headquarters: 'Bangalore, India',
        synergyScore: 8.0,
        keyProducts: [
          'Nimbus BI Pro',
          'Nimbus Lite'
        ],
        addonHistory: [
          'Merged with CloudViz'
        ]
      }
    };
    return companies[companyId] || companies['1'];
  }
}

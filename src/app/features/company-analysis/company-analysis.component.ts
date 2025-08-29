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
import { TargetCompanySynergy, SynergyDetail } from '../../core/services/portfolio-api.service';

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
  selectedCompany: TargetCompanySynergy | null = null;
  buyerCompanyName: string = '';
  targetCompanyName: string = '';
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
        'Broadening service offerings in logistics.'
      ]
    },
    {
      title: 'Other Synergy Types',
      icon: 'star',
      description: 'Additional strategic benefits not categorized, such as talent acquisition, intellectual property, or enhanced brand reputation.',
      examples: [
        'Retention of key management team and talent.',
        'Acquisition of valuable patents and trademarks.',
        'Enhanced brand reputation and market credibility.'
      ]
    }
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('CompanyAnalysisComponent ngOnInit called');
    
    // Check if we have synergy data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as any;
      console.log('Navigation state received:', state);
      
      if (state.targetCompany) {
        console.log('Using synergy data from navigation state:', state);
        console.log('Target company data:', state.targetCompany);
        console.log('Target company name:', state.targetCompany.name);
        console.log('Target company companyName:', state.targetCompany.companyName);
        
        this.selectedCompany = state.targetCompany;
        this.targetCompanyName = state.targetCompany.name || state.targetCompany.companyName;
        this.buyerCompanyName = state.buyerCompanyName || state.buyerCompanyId || 'Portfolio Company';
        
        console.log('Set selectedCompany:', this.selectedCompany);
        console.log('Set targetCompanyName:', this.targetCompanyName);
        console.log('Set buyerCompanyName:', this.buyerCompanyName);
        
        // Update synergy types with actual data from the API
        this.updateSynergyTypesWithRealData(state.targetCompany);
        return;
      }
    }
    
    // Try to get data from history state as fallback
    if (history.state && history.state.targetCompany) {
      console.log('Using history state data:', history.state);
      const state = history.state;
      
      this.selectedCompany = state.targetCompany;
      this.targetCompanyName = state.targetCompany.name || state.targetCompany.companyName;
      this.buyerCompanyName = state.buyerCompanyName || state.buyerCompanyId || 'Portfolio Company';
      
      console.log('Set selectedCompany from history:', this.selectedCompany);
      console.log('Set targetCompanyName from history:', this.targetCompanyName);
      console.log('Set buyerCompanyName from history:', this.buyerCompanyName);
      
      this.updateSynergyTypesWithRealData(state.targetCompany);
      return;
    }
    
         console.log('No navigation state data, using fallback method');
     // Fallback to old method if no state data
     this.route.params.subscribe(params => {
       const companyId = params['id'];
       console.log('Route params companyId:', companyId);
       
       this.selectedCompany = this.getCompanyData(companyId);
       console.log('Fallback selectedCompany:', this.selectedCompany);
       
       this.targetCompanyName = this.selectedCompany?.name || 'Target Company';
       this.buyerCompanyName = 'Portfolio Company';
       
       console.log('Fallback targetCompanyName:', this.targetCompanyName);
       console.log('Fallback buyerCompanyName:', this.buyerCompanyName);
     });
  }

  private updateSynergyTypesWithRealData(targetCompany: TargetCompanySynergy): void {
    if (targetCompany.synergies) {
      this.synergyTypes = targetCompany.synergies.map((synergy: SynergyDetail) => ({
        title: synergy.type,
        icon: this.getSynergyIcon(synergy.type),
        description: synergy.description,
        impact: synergy.impact,
        timeline: synergy.timeline,
        value: synergy.value,
        examples: [
          `Impact: ${synergy.impact}`,
          `Timeline: ${synergy.timeline}`,
          `Value: ${synergy.value}`
        ]
      }));
    }
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
        name: 'GreenTech Solutions Inc.',
        industry: 'Sustainable Energy',
        description: 'A leading provider of sustainable energy solutions, specializing in solar panel installations and smart grid technologies. Focused on reducing carbon footprint and optimizing energy consumption for commercial clients.',
        synergyScore: 8.5,
        keyProducts: [
          'Solar Panel Systems',
          'Smart Grid Management Software',
          'Energy Efficiency Consulting',
          'Battery Storage Solutions'
        ],
        sponsor: 'Evergreen Capital Partners',
        portfolioDuration: '3 years, 6 months',
        addonHistory: [
          '2021: Acquisition by PortfolioCo',
          '2022: Launched new SmartGrid v2.0 platform',
          '2023: Expanded into European markets',
          '2024: Awarded "Innovation in Sustainability" prize'
        ]
      },
      '2': {
        name: 'DataStream Analytics',
        industry: 'Data Analytics',
        description: 'Specializes in real-time data processing and business intelligence solutions. We help organizations transform raw data into actionable insights through advanced analytics, machine learning, and interactive dashboards.',
        synergyScore: 9.2,
        keyProducts: [
          'Real-time Analytics Platform',
          'Machine Learning Models',
          'Business Intelligence Tools',
          'Data Visualization Suite'
        ],
        sponsor: 'TechVentures Capital',
        portfolioDuration: '2 years, 8 months',
        addonHistory: [
          '2022: Initial acquisition',
          '2023: Launched AI-powered analytics',
          '2024: Expanded to enterprise clients'
        ]
      },
      '3': {
        name: 'TaskFlow Automation',
        industry: 'Workflow Automation',
        description: 'Provides intelligent workflow automation solutions that streamline business processes and improve operational efficiency.',
        synergyScore: 8.8,
        keyProducts: [
          'Process Automation Platform',
          'Workflow Designer',
          'Integration APIs',
          'Analytics Dashboard'
        ],
        sponsor: 'Innovation Partners',
        portfolioDuration: '1 year, 11 months',
        addonHistory: [
          '2023: Strategic acquisition',
          '2024: Launched enterprise version'
        ]
      }
    };
    
    return companies[companyId] || companies['1'];
  }

  logout(): void {
    this.authService.logout();
  }

  goBack(): void {
    this.router.navigate(['/synergy-analysis', '1']);
  }

  onCompanySelect(company: any): void {
    this.portfolioCompanies.forEach(c => c.isSelected = false);
    company.isSelected = true;
  }
}

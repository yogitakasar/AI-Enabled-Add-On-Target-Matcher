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
import { PortfolioApiService, AcquisitionTarget } from '../../core/services/portfolio-api.service';


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
    MatFormFieldModule
  ],
  templateUrl: './synergy-analysis.component.html',
  styleUrls: ['./synergy-analysis.component.scss']
})
export class SynergyAnalysisComponent implements OnInit {
  selectedCompany: any;
  potentialAcquisitions: AcquisitionTarget[] = [
    {
      id: 1,
      name: 'DataStream Analytics',
      description: 'Specializes in real-time data analytics and visualization tools.',
      score: 9,
      industry: 'Data Analytics',
      revenue: '$85M',
      ebitda: '$28M',
      employees: 320,
      headquarters: 'Austin, TX',
      synergyScore: 9.2,
      keyProducts: [
        'Real-time Analytics Platform',
        'Machine Learning Models',
        'Business Intelligence Tools',
        'Data Visualization Suite'
      ]
    },
    {
      id: 2,
      name: 'TaskFlow Automation',
      description: 'Provides intelligent workflow automation solutions.',
      score: 9,
      industry: 'Business Process Automation',
      revenue: '$65M',
      ebitda: '$22M',
      employees: 280,
      headquarters: 'Denver, CO',
      synergyScore: 8.8,
      keyProducts: [
        'Workflow Automation Engine',
        'Process Mining Tools',
        'RPA Platform',
        'Business Process Analytics'
      ]
    },
    {
      id: 3,
      name: 'CollaboraHub AI',
      description: 'Develops AI-powered assistants for team collaboration.',
      score: 8,
      industry: 'Collaboration Software',
      revenue: '$75M',
      ebitda: '$25M',
      employees: 350,
      headquarters: 'Seattle, WA',
      synergyScore: 8.5,
      keyProducts: [
        'AI Chat Assistant',
        'Smart Document Collaboration',
        'Team Analytics Dashboard',
        'Workflow Intelligence'
      ]
    },
    {
      id: 4,
      name: 'SecureVault Docs',
      description: 'Offers encrypted document management and version control.',
      score: 7,
      industry: 'Document Management',
      revenue: '$90M',
      ebitda: '$30M',
      employees: 400,
      headquarters: 'Boston, MA',
      synergyScore: 8.9,
      keyProducts: [
        'Secure Document Storage',
        'Advanced Encryption',
        'Compliance Management',
        'Document Workflow'
      ]
    },
    {
      id: 5,
      name: 'AgileSprint Integrations',
      description: 'Focuses on building custom API integrations for Agile development tools.',
      score: 7,
      industry: 'Integration Services',
      revenue: '$70M',
      ebitda: '$24M',
      employees: 320,
      headquarters: 'San Diego, CA',
      synergyScore: 8.7,
      keyProducts: [
        'API Gateway',
        'Workflow Orchestration',
        'Data Transformation',
        'Integration Analytics'
      ]
    }
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private portfolioApiService: PortfolioApiService
  ) {}

  ngOnInit() {
    // Check if we have data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as any;
      if (state.portfolioCompany && state.acquisitionTargets) {
        console.log('Using data from navigation state:', state);
        this.selectedCompany = state.portfolioCompany;
        this.potentialAcquisitions = state.acquisitionTargets;
        return;
      }
    }
    
    console.log('No navigation state data, using fallback method');
    // Fallback to old method if no state data
    this.route.params.subscribe(params => {
      const companyId = params['id'];
      // In a real app, you'd fetch company data from a service
      this.selectedCompany = this.getCompanyData(companyId);
    });
  }

  private getCompanyData(companyId: string): any {
    const companies: { [key: string]: any } = {
      '1': {
        name: 'OptiCore Solutions',
        industry: 'Enterprise Software',
        description: 'OptiCore Solutions is a leading provider of cloud-based project management and collaboration software. Our platform offers comprehensive tools for task tracking, team communication, and project analytics, helping organizations streamline their workflows and improve productivity and efficiency.',
        revenue: '$125M',
        ebitda: '$38M',
        employees: 450,
        headquarters: 'San Francisco, CA',
        logo: '🏢'
      },
      '2': {
        name: 'DataStream Analytics',
        industry: 'Data Analytics',
        description: 'DataStream Analytics specializes in real-time data processing and business intelligence solutions. We help organizations transform raw data into actionable insights through advanced analytics, machine learning, and interactive dashboards.',
        revenue: '$85M',
        ebitda: '$28M',
        employees: 320,
        headquarters: 'Austin, TX',
        logo: '📊'
      },
      '3': {
        name: 'TechForge Dynamics',
        industry: 'Technology Services',
        description: 'TechForge Dynamics is a full-service technology consulting firm that helps businesses modernize their IT infrastructure, implement cloud solutions, and develop custom software applications.',
        revenue: '$95M',
        ebitda: '$32M',
        employees: 380,
        headquarters: 'Seattle, WA',
        logo: '⚡'
      },
      '4': {
        name: 'Apex Analytics',
        industry: 'Business Intelligence',
        description: 'Apex Analytics provides enterprise-grade business intelligence and reporting solutions. Our platform enables data-driven decision making through advanced analytics, predictive modeling, and real-time reporting.',
        revenue: '$110M',
        ebitda: '$35M',
        employees: 420,
        headquarters: 'Boston, MA',
        logo: '🌱'
      },
      '5': {
        name: 'Quantum Ventures',
        industry: 'Investment',
        description: 'Quantum Ventures is a private equity firm focused on technology investments. We partner with innovative companies to accelerate growth and create long-term value through strategic guidance and capital.',
        revenue: '$200M',
        ebitda: '$65M',
        employees: 150,
        headquarters: 'New York, NY',
        logo: '🌍'
      },
      '6': {
        name: 'Pinnacle Holdings',
        industry: 'Holding Company',
        description: 'Pinnacle Holdings is a diversified holding company with investments across technology, healthcare, and financial services sectors. We provide strategic oversight and operational support to our portfolio companies.',
        revenue: '$350M',
        ebitda: '$120M',
        employees: 280,
        headquarters: 'Chicago, IL',
        logo: '🔗'
      }
    };
    
    return companies[companyId] || companies['1'];
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
    const targetCompanyId = `T${acquisition.id}`;
    
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

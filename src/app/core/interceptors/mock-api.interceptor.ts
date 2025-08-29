import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export const mockApiInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  
  // Mock /api/dashboard/portfolio/all endpoint
  if (request.url.includes('/api/dashboard/portfolio/all') && request.method === 'GET') {
    const mockPortfolioCompanies = [
      {
        id: 1,
        name: 'OptiCore Solutions',
        icon: 'business',
        industry: 'Enterprise Software',
        description: 'OptiCore Solutions is a leading provider of cloud-based project management and collaboration software. Our platform offers comprehensive tools for task tracking, team communication, and project analytics, helping organizations streamline their workflows and improve productivity and efficiency.',
        revenue: '$125M',
        ebitda: '$38M',
        employees: 450,
        headquarters: 'San Francisco, CA',
        logo: '🏢',
        synergyScore: 8.5,
        keyProducts: [
          'Cloud Project Management',
          'Team Collaboration Tools',
          'Project Analytics Platform',
          'Workflow Automation'
        ],
        sponsor: 'TechVentures Capital',
        portfolioDuration: '2 years, 8 months',
        addonHistory: [
          '2022: Initial acquisition',
          '2023: Launched cloud platform',
          '2024: Expanded to enterprise clients'
        ]
      },
      {
        id: 2,
        name: 'DataStream Analytics',
        icon: 'analytics',
        industry: 'Data Analytics',
        description: 'DataStream Analytics specializes in real-time data processing and business intelligence solutions. We help organizations transform raw data into actionable insights through advanced analytics, machine learning, and interactive dashboards.',
        revenue: '$85M',
        ebitda: '$28M',
        employees: 320,
        headquarters: 'Austin, TX',
        logo: '📊',
        synergyScore: 9.2,
        keyProducts: [
          'Real-time Analytics Platform',
          'Machine Learning Models',
          'Business Intelligence Tools',
          'Data Visualization Suite'
        ],
        sponsor: 'Innovation Partners',
        portfolioDuration: '1 year, 11 months',
        addonHistory: [
          '2023: Strategic acquisition',
          '2024: Launched AI-powered analytics'
        ]
      },
      {
        id: 3,
        name: 'TechForge Dynamics',
        icon: 'build',
        industry: 'Technology Services',
        description: 'TechForge Dynamics is a full-service technology consulting firm that helps businesses modernize their IT infrastructure, implement cloud solutions, and develop custom software applications.',
        revenue: '$95M',
        ebitda: '$32M',
        employees: 380,
        headquarters: 'Seattle, WA',
        logo: '⚡',
        synergyScore: 8.8,
        keyProducts: [
          'IT Infrastructure Consulting',
          'Cloud Migration Services',
          'Custom Software Development',
          'Digital Transformation'
        ],
        sponsor: 'Growth Capital Partners',
        portfolioDuration: '3 years, 2 months',
        addonHistory: [
          '2021: Initial acquisition',
          '2022: Launched cloud services division',
          '2023: Expanded to enterprise clients',
          '2024: Acquired AI consulting firm'
        ]
      },
      {
        id: 4,
        name: 'Apex Analytics',
        icon: 'trending_up',
        industry: 'Business Intelligence',
        description: 'Apex Analytics provides enterprise-grade business intelligence and reporting solutions. Our platform enables data-driven decision making through advanced analytics, predictive modeling, and real-time reporting.',
        revenue: '$110M',
        ebitda: '$35M',
        employees: 420,
        headquarters: 'Boston, MA',
        logo: '🌱',
        synergyScore: 8.3,
        keyProducts: [
          'Business Intelligence Platform',
          'Predictive Analytics Engine',
          'Real-time Reporting Tools',
          'Data Warehouse Solutions'
        ],
        sponsor: 'Strategic Growth Fund',
        portfolioDuration: '2 years, 5 months',
        addonHistory: [
          '2022: Strategic acquisition',
          '2023: Launched predictive analytics',
          '2024: Expanded to healthcare sector'
        ]
      },
      {
        id: 5,
        name: 'Quantum Ventures',
        icon: 'rocket_launch',
        industry: 'Investment',
        description: 'Quantum Ventures is a private equity firm focused on technology investments. We partner with innovative companies to accelerate growth and create long-term value through strategic guidance and capital.',
        revenue: '$200M',
        ebitda: '$65M',
        employees: 150,
        headquarters: 'New York, NY',
        logo: '🌍',
        synergyScore: 7.8,
        keyProducts: [
          'Growth Capital Investment',
          'Strategic Advisory Services',
          'Portfolio Management',
          'Exit Strategy Planning'
        ],
        sponsor: 'Legacy Capital Group',
        portfolioDuration: '5 years, 3 months',
        addonHistory: [
          '2019: Fund establishment',
          '2020: First portfolio investment',
          '2021: Strategic partnerships formed',
          '2022: Portfolio expansion',
          '2023: Successful exits',
          '2024: New fund launch'
        ]
      },
      {
        id: 6,
        name: 'Pinnacle Holdings',
        icon: 'account_balance',
        industry: 'Holding Company',
        description: 'Pinnacle Holdings is a diversified holding company with investments across technology, healthcare, and financial services sectors. We provide strategic oversight and operational support to our portfolio companies.',
        revenue: '$350M',
        ebitda: '$120M',
        employees: 280,
        headquarters: 'Chicago, IL',
        logo: '🔗',
        synergyScore: 8.1,
        keyProducts: [
          'Strategic Portfolio Management',
          'Operational Excellence Programs',
          'Cross-sector Synergies',
          'Risk Management Services'
        ],
        sponsor: 'Heritage Investment Group',
        portfolioDuration: '4 years, 7 months',
        addonHistory: [
          '2020: Company formation',
          '2021: First acquisitions',
          '2022: Operational improvements',
          '2023: Portfolio optimization',
          '2024: Strategic divestitures'
        ]
      }
    ];

    return of(new Response(JSON.stringify({
      success: true,
      data: mockPortfolioCompanies,
      message: 'Portfolio companies retrieved successfully'
    }))).pipe(delay(500));
  }

  // Mock /portfolio endpoint for portfolio company with acquisition targets
  if (request.url.includes('/portfolio') && request.method === 'GET' && request.url.includes('companyId=') && !request.url.includes('target')) {
    const url = new URL(request.url, 'http://localhost');
    const companyId = url.searchParams.get('companyId');
    
    const mockPortfolioCompany = {
      id: parseInt(companyId || '1'),
      name: 'OptiCore Solutions',
      icon: 'business',
      industry: 'Enterprise Software',
      description: 'OptiCore Solutions is a leading provider of cloud-based project management and collaboration software. Our platform offers comprehensive tools for task tracking, team communication, and project analytics, helping organizations streamline their workflows and improve productivity and efficiency.',
      revenue: '$125M',
      ebitda: '$38M',
      employees: 450,
      headquarters: 'San Francisco, CA',
      logo: '🏢',
      synergyScore: 8.5,
      keyProducts: [
        'Cloud Project Management',
        'Team Collaboration Tools',
        'Project Analytics Platform',
        'Workflow Automation'
      ],
      sponsor: 'TechVentures Capital',
      portfolioDuration: '2 years, 8 months',
      addonHistory: [
        '2022: Initial acquisition',
        '2023: Launched cloud platform',
        '2024: Expanded to enterprise clients'
      ]
    };

    const mockAcquisitionTargets = [
      {
        id: 1,
        name: 'DataStream Analytics',
        description: 'Real-time data processing and business intelligence solutions',
        score: 9.2,
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
        description: 'Provides intelligent workflow automation solutions',
        score: 8.8,
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
        description: 'Develops AI-powered assistants for team collaboration',
        score: 8.5,
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
        description: 'Offers encrypted document management and version control',
        score: 8.9,
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
        description: 'Focuses on building custom API integrations for Agile development tools',
        score: 8.7,
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

    return of(new Response(JSON.stringify({
      success: true,
      data: {
        portfolioCompany: mockPortfolioCompany,
        acquisitionTargets: mockAcquisitionTargets
      },
      message: 'Portfolio company and acquisition targets retrieved successfully'
    }))).pipe(delay(500));
  }

  // Mock /portfolio/target endpoint for target company synergies
  if (request.url.includes('/portfolio/target') && request.method === 'GET' && request.url.includes('targetCompanyId=')) {
    const url = new URL(request.url, 'http://localhost');
    const targetCompanyId = url.searchParams.get('targetCompanyId');
    const buyerCompanyId = url.searchParams.get('buyerCompanyId');
    
    const synergyData = {
      'T1': {
        companyName: 'DataStream Analytics',
        name: 'DataStream Analytics',
        industry: 'Data Analytics',
        description: 'Real-time data processing and business intelligence solutions',
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
        ],
        sponsor: 'Innovation Partners',
        portfolioDuration: '1 year, 11 months',
        addonHistory: [
          '2023: Strategic acquisition',
          '2024: Launched AI-powered analytics'
        ],
        synergies: [
          {
            type: 'Product Integration',
            description: 'Integrate real-time analytics into OptiCore\'s project management platform',
            impact: 'High',
            timeline: '6-12 months',
            value: '$15M annual revenue increase'
          },
          {
            type: 'Market Expansion',
            description: 'Access to DataStream\'s enterprise analytics customer base',
            impact: 'Medium',
            timeline: '12-18 months',
            value: '$8M new market opportunity'
          },
          {
            type: 'Technology Synergy',
            description: 'Leverage DataStream\'s ML capabilities for OptiCore\'s workflow optimization',
            impact: 'High',
            timeline: '9-15 months',
            value: '$12M efficiency gains'
          }
        ],
        financialMetrics: {
          valuation: '$120M',
          multiple: '4.3x EBITDA',
          growthRate: '25% YoY',
          profitMargin: '33%'
        },
        risks: [
          'Integration complexity with existing systems',
          'Cultural alignment between companies',
          'Regulatory compliance in data handling'
        ]
      },
      'T2': {
        companyName: 'TaskFlow Automation',
        name: 'TaskFlow Automation',
        industry: 'Business Process Automation',
        description: 'Provides intelligent workflow automation solutions',
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
        ],
        sponsor: 'Automation Ventures',
        portfolioDuration: '2 years, 3 months',
        addonHistory: [
          '2022: Initial acquisition',
          '2023: Launched enterprise version',
          '2024: Expanded automation capabilities'
        ],
        synergies: [
          {
            type: 'Operational Efficiency',
            description: 'Automate OptiCore\'s internal project management processes',
            impact: 'High',
            timeline: '3-6 months',
            value: '$8M cost savings'
          },
          {
            type: 'Product Enhancement',
            description: 'Add workflow automation to OptiCore\'s project management platform',
            impact: 'Medium',
            timeline: '6-12 months',
            value: '$10M new revenue'
          }
        ],
        financialMetrics: {
          valuation: '$95M',
          multiple: '4.3x EBITDA',
          growthRate: '20% YoY',
          profitMargin: '34%'
        },
        risks: [
          'Technology stack compatibility',
          'Employee training requirements',
          'Process change management'
        ]
      },
      'T3': {
        companyName: 'CollaboraHub AI',
        name: 'CollaboraHub AI',
        industry: 'Collaboration Software',
        description: 'Develops AI-powered assistants for team collaboration',
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
        ],
        sponsor: 'AI Growth Fund',
        portfolioDuration: '1 year, 8 months',
        addonHistory: [
          '2023: Strategic acquisition',
          '2024: Launched enterprise AI features'
        ],
        synergies: [
          {
            type: 'AI Enhancement',
            description: 'Integrate AI-powered collaboration features into OptiCore\'s platform',
            impact: 'High',
            timeline: '9-18 months',
            value: '$20M competitive advantage'
          },
          {
            type: 'User Experience',
            description: 'Enhance user engagement through intelligent collaboration tools',
            impact: 'Medium',
            timeline: '6-12 months',
            value: '$6M user retention improvement'
          }
        ],
        financialMetrics: {
          valuation: '$110M',
          multiple: '4.4x EBITDA',
          growthRate: '30% YoY',
          profitMargin: '33%'
        },
        risks: [
          'AI model training and maintenance',
          'Data privacy and security',
          'User adoption challenges'
        ]
      },
      'T4': {
        companyName: 'SecureVault Docs',
        name: 'SecureVault Docs',
        industry: 'Document Management',
        description: 'Offers encrypted document management and version control',
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
        ],
        sponsor: 'Security Capital Partners',
        portfolioDuration: '2 years, 1 month',
        addonHistory: [
          '2022: Strategic acquisition',
          '2023: Enhanced compliance features',
          '2024: Expanded security offerings'
        ],
        synergies: [
          {
            type: 'Security Enhancement',
            description: 'Add enterprise-grade security to OptiCore\'s document management',
            impact: 'High',
            timeline: '6-12 months',
            value: '$18M security value'
          },
          {
            type: 'Compliance',
            description: 'Meet regulatory requirements for enterprise clients',
            impact: 'Medium',
            timeline: '12-18 months',
            value: '$12M compliance revenue'
          }
        ],
        financialMetrics: {
          valuation: '$135M',
          multiple: '4.5x EBITDA',
          growthRate: '22% YoY',
          profitMargin: '33%'
        },
        risks: [
          'Regulatory compliance complexity',
          'Security certification requirements',
          'Integration with existing security systems'
        ]
      },
      'T5': {
        companyName: 'AgileSprint Integrations',
        name: 'AgileSprint Integrations',
        industry: 'Integration Services',
        description: 'Focuses on building custom API integrations for Agile development tools',
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
        ],
        sponsor: 'Integration Ventures',
        portfolioDuration: '1 year, 6 months',
        addonHistory: [
          '2023: Strategic acquisition',
          '2024: Launched enterprise integration platform'
        ],
        synergies: [
          {
            type: 'Integration Capability',
            description: 'Enable seamless integration with third-party tools and systems',
            impact: 'High',
            timeline: '6-12 months',
            value: '$14M integration revenue'
          },
          {
            type: 'Developer Experience',
            description: 'Improve developer productivity through better integration tools',
            impact: 'Medium',
            timeline: '9-15 months',
            value: '$8M developer efficiency'
          }
        ],
        financialMetrics: {
          valuation: '$100M',
          multiple: '4.2x EBITDA',
          growthRate: '18% YoY',
          profitMargin: '34%'
        },
        risks: [
          'API compatibility challenges',
          'Third-party dependency management',
          'Developer tool adoption'
        ]
      }
    };

    const targetCompany = synergyData[targetCompanyId as keyof typeof synergyData] || synergyData['T1'];

    return of(new Response(JSON.stringify({
      success: true,
      data: {
        targetCompany: targetCompany,
        buyerCompanyId: buyerCompanyId,
        targetCompanyId: targetCompanyId
      },
      message: 'Target company synergy details retrieved successfully'
    }))).pipe(delay(500));
  }

  // If not a mock endpoint, continue with the real request
  return next(request);
};

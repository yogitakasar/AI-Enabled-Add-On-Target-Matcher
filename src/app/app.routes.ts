import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'login', 
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'synergy-analysis/:id', 
    loadComponent: () => import('./features/synergy-analysis/synergy-analysis.component').then(m => m.SynergyAnalysisComponent),
    canActivate: [AuthGuard],
    data: { prerender: false }
  },
  { 
    path: 'company-analysis/:id', 
    loadComponent: () => import('./features/company-analysis/company-analysis.component').then(m => m.CompanyAnalysisComponent),
    canActivate: [AuthGuard],
    data: { prerender: false }
  },

  { path: '**', redirectTo: '/dashboard' }
];

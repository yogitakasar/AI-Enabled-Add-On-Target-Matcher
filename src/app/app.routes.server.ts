import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'register',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'dashboard',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'synergy-analysis/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [
      { id: '1' },
      { id: '2' },
      { id: '3' },
      { id: '4' },
      { id: '5' },
      { id: '6' }
    ]
  },
  {
    path: 'company-analysis/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => [
      { id: 'T1' },
      { id: 'T2' },
      { id: 'T3' },
      { id: 'T4' },
      { id: 'T5' }
    ]
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];

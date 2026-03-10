import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';

export const PrivateRoutes: Routes = [
  /* {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, */
  {
    path: 'dashboard',
    component: Dashboard,
  },
  {
    path: 'adm',
    loadChildren: () =>
      import('./pages/administration/administration.module').then((m) => m.AdministrationModule),
  },
];

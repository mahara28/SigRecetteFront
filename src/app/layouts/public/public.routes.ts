import { Routes } from '@angular/router';

export const PublicRoutes: Routes = [
  {
    path: '',
    redirectTo: 'authentification',
    pathMatch: 'full'
  },

  {
    path: 'authentification',
    loadChildren: () => import('./pages/authentification/authentification-module').then((m) => m.AuthentificationModule)

  }


]

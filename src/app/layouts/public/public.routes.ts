import { Routes } from '@angular/router';

export const PublicRoutes: Routes = [
  {
    path: '',
    redirectTo: 'authentification',
    pathMatch: 'full'
  },

 {
 /*  path: 'authentification',
    loadChildren: () => import('@publicLayout/features/authentification/authentification.module').then((m) => m.AuthentificationModule)
 */
  }


]

import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { NotificationMessageRoutingModule } from './pages/notification-message/notification-message-routing.module';

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

  {
    path: 'notif-msg',
    loadChildren: () =>
      import('./pages/notification-message/notification-message.module').then((m) => m.NotificationMessageModule),
  },
];

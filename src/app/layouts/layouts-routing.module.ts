
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { Private } from './private/private';
import { Public } from './public/public';
import { PublicRoutes } from './public/public.routes';
import { PrivateRoutes } from './private/private.routes';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full'
  },
  {
    path: 'public',
    component: Public,
    children: PublicRoutes,
   /*  canActivate: [NonAuthGuard], */
  },
  {
    path: 'app',
    component: Private,
    children: PrivateRoutes,
    /* canActivate: [AuthGuard], */
    data: {
      title: 'layout.navbar.text'
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutsRoutingModule {
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'users',
    data: {
      title: 'administration.title',
      breadcrumb: 'administration.breadcrumb',
    },
    loadChildren: () =>
      import('./user-management/user-management.module').then((m) => m.UserManagementModule),
  },
  /* {
    path: "access-log",
    data: {
      title: "administration.title",
      breadcrumb: "administration.breadcrumb",
    },
    loadChildren: () =>
      import("./tracage-des-acces/tracage-des-acces.module").then(
        (m) => m.TracageDesAccesModule
      ),
  }, */
  /* {
    path: "data-log",
    data: {
      title: "administration.title",
      breadcrumb: "administration.breadcrumb",
    },
    loadChildren: () =>
      import("./tracage-des-donnes/tracage-des-donnes.module").then(
        (m) => m.TracageDesDonnesModule
      ),
  }, */
  {
    path: 'profil',
    data: {
      title: 'administration.title',
      breadcrumb: 'administration.breadcrumb',
    },
    loadChildren: () =>
      import('./gestion-profils/gestion-profils.module').then((m) => m.GestionProfilsModule),
  },
  /* {
    path: "fonc",
    data: {
      title: "administration.title",
      breadcrumb: "administration.breadcrumb",
    },

    loadChildren: () =>
      import("./function/function.module").then((f) => f.FunctionModule),
  }, */
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}

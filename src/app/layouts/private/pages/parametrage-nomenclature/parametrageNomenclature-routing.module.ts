import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionNomenclature } from './gestion-nomenclature/gestion-nomenclature';

const routes: Routes = [
  {
    path: '',
    children: [],
  },
  {
    path: 'gestNomenclature',

    data: {
      title: 'gestNomenclature.title',
      breadcrumb: 'gestNomenclature.breadcrumb',
    },

    children: [
      {
        path: '',
        component: GestionNomenclature,
      },
      /*{
      path: "detail/:id",
      component: FicheDetailsProfilComponent,
      data: {
             title: 'administration.gp.fichedetailProfil.detail',
              breadcrumb: 'administration.gp.fichedetailProfil.detail',
      },
    },*/
      /* {
        path: 'add',
        component: FicheAjoutModifProfilsComponent,
        data: {
          title: 'profil.add_profil',
          breadcrumb: 'profil.add_profil',
          type: 'a',
        },
      },
      {
        path: 'update/:id',
        component: FicheAjoutModifProfilsComponent,
        data: {
          title: 'profil.update_profil',
          breadcrumb: 'profil.update_profil',
          type: 'e',
        },
      }, */
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class  ParametrageNomenclatureRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FicheListeProfilsComponent } from './fiche-liste-profils/fiche-liste-profils.component';
import { FicheAjoutModifProfilsComponent } from './fiche-ajout-modif-profils/fiche-ajout-modif-profils.component';

const routes: Routes = [
  {
    path: '',
    children: [],
  },
  {
    path: 'userProfil',

    data: {
      title: 'profil.title',
      breadcrumb: 'profil.breadcrumb',
    },

    children: [
      {
        path: '',
        component: FicheListeProfilsComponent,
      },
      /*{
      path: "detail/:id",
      component: FicheDetailsProfilComponent,
      data: {
             title: 'administration.gp.fichedetailProfil.detail',
              breadcrumb: 'administration.gp.fichedetailProfil.detail',
      },
    },*/
      {
        path: 'add',
        component: FicheAjoutModifProfilsComponent,
        data: {
          title: 'administration.gp.ficheAddprofil.add',
          breadcrumb: 'administration.gp.ficheAddprofil.add',
          type: 'a',
        },
      },
      /*{
      path: "update/:id",
      component: FicheAjoutModifProfilsComponent,
      data: {
        title: 'administration.gp.ficheEditProfil.update',
      breadcrumb: 'administration.gp.ficheEditProfil.update',
      type: 'e'
      },
    }, */
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionProfilsRoutingModule {}

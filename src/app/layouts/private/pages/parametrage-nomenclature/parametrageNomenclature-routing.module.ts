import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionNomenclature } from './gestion-nomenclature/gestion-nomenclature';
import { NomenclatureAddEditComponent } from './nomenclature-add-edit/nomenclature-add-edit.component';

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
      {
        path: 'add/:nomTable',
        component: NomenclatureAddEditComponent,
        data: {
          title: 'gestNomenclature.add_nom',
          breadcrumb: 'gestNomenclature.add_nom',
          type: 'a',
        },
      },
      {
        path: 'edit/:nomTable/:id',
        component: NomenclatureAddEditComponent,
        data: {
          title: 'gestNomenclature.update_nom',
          breadcrumb: 'gestNomenclature.update_nom',
          type: 'e',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParametrageNomenclatureRoutingModule { }

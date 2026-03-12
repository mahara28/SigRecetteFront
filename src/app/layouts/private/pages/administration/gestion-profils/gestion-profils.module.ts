import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionProfilsRoutingModule } from './gestion-profils-routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { AppSharedModule } from '../../../../../app-shared/app-shared-module';
import { FicheListeProfilsComponent } from './fiche-liste-profils/fiche-liste-profils.component';
import { FicheAjoutModifProfilsComponent } from './fiche-ajout-modif-profils/fiche-ajout-modif-profils.component';
import { TreeViewMenuComponent } from './fiche-ajout-modif-profils/tree-view-menu/tree-view-menu.component';
import { MatIcon } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { SubmenuComponent } from './fiche-ajout-modif-profils/submenu/submenu.component';
@NgModule({
  declarations: [
    FicheListeProfilsComponent,
    FicheAjoutModifProfilsComponent,

    /*FiltreListeProfilsComponent,
    FicheDetailsProfilComponent,*/
    SubmenuComponent,
    TreeViewMenuComponent,
  ],
  providers: [
    //ChecklistDatabase,
  ],
  imports: [
    CommonModule,
    GestionProfilsRoutingModule,
    AppSharedModule,
    MatIcon,
    ReactiveFormsModule,
    MatTreeModule,
  ],
})
export class GestionProfilsModule {}

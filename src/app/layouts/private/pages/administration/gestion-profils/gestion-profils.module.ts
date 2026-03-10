import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GestionProfilsRoutingModule } from './gestion-profils-routing.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { AppSharedModule } from '../../../../../app-shared/app-shared-module';
import { FicheListeProfilsComponent } from './fiche-liste-profils/fiche-liste-profils.component';

@NgModule({
  declarations: [
    FicheListeProfilsComponent,
    /*FicheAjoutModifProfilsComponent,
    
    FiltreListeProfilsComponent,
    FicheDetailsProfilComponent,
    SubmenuComponent,
    TreeViewMenuComponent,*/
  ],
  providers: [
    //ChecklistDatabase,
  ],
  imports: [CommonModule, GestionProfilsRoutingModule, AppSharedModule],
})
export class GestionProfilsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametrageNomenclatureRoutingModule } from './parametrageNomenclature-routing.module';
import { AppSharedModule } from '../../../../app-shared/app-shared-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GestionNomenclature } from './gestion-nomenclature/gestion-nomenclature';
import { FilterListeNomenclature } from './gestion-nomenclature/filter-liste-nomenclature/filter-liste-nomenclature';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';



@NgModule({
  declarations: [GestionNomenclature, FilterListeNomenclature],
  imports: [
    CommonModule,
    ParametrageNomenclatureRoutingModule,
    CommonModule,
    AppSharedModule,
    ReactiveFormsModule,
    FormsModule,
    AppSharedModule,
    FlexLayoutModule


  ]
})
export class ParametrageNomenclatureModule { }

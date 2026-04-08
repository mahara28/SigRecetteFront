import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParametrageNomenclatureRoutingModule } from './parametrageNomenclature-routing.module';
import { AppSharedModule } from '../../../../app-shared/app-shared-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ParametrageNomenclatureRoutingModule,
    CommonModule,
    AppSharedModule,
    ReactiveFormsModule,
    FormsModule,
    AppSharedModule


  ]
})
export class ParametrageNomenclatureModule { }

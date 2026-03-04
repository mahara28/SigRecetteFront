import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsRoutingModule } from './layouts-routing.module';
import { PublicModule } from './public/public-module';
import { AppSharedModule } from '../app-shared/app-shared-module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LayoutsRoutingModule,
    AppSharedModule,
    PublicModule,
  ]
})
export class LayoutsModule { }

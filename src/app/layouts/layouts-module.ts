import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutsRoutingModule } from './layouts-routing.module';
import { PublicModule } from './public/public-module';
import { AppSharedModule } from '../app-shared/app-shared-module';
import { PrivateModule } from './private/private-layout.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LayoutsRoutingModule,
    AppSharedModule,
    PublicModule,
    PrivateModule,
    
  ],
})
export class LayoutsModule {}

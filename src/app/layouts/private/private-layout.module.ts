import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSharedModule } from '../../app-shared/app-shared-module';
import { Private } from './private';
import { Outlet } from '../../app-shared/widgets/outlet/outlet';

@NgModule({
  exports: [],
  declarations: [Private],
  imports: [CommonModule, AppSharedModule, Outlet],
})
export class PrivateModule {}

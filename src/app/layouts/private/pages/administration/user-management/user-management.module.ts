import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSharedModule } from '../../../../../app-shared/app-shared-module';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UsersListComponent } from './users-list/users-list.component';

@NgModule({
  imports: [CommonModule, AppSharedModule, UserManagementRoutingModule],
  declarations: [UsersListComponent],
})
export class UserManagementModule {}

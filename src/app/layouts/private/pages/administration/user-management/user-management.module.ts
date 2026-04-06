import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSharedModule } from '../../../../../app-shared/app-shared-module';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersAddEditComponent } from './users-add-edit/users-add-edit.component';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

@NgModule({
  imports: [CommonModule, AppSharedModule, UserManagementRoutingModule, MatIconModule, ReactiveFormsModule, FlexLayoutModule],
  declarations: [UsersListComponent, UsersAddEditComponent],
})
export class UserManagementModule { }

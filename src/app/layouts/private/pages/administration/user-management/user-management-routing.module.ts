import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { UsersAddEditComponent } from './users-add-edit/users-add-edit.component';

const routes: Routes = [
  {
    path: '',
    children: [],
  },
  {
    path: 'userManag',
    data: {
      title: 'administration.users.title',
      breadcrumb: 'administration.users.breadcrumb',
    },

    children: [
      {
        path: '',
        component: UsersListComponent,
      },
      /*{
        path: "detail/:id",
        component: UsersDetailsComponent,
        data: {
          title: "administration.users.userDetails.title",
          breadcrumb: "administration.users.userDetails.title",
        },
      },*/
      {
        path: "add",
        component: UsersAddEditComponent,
        data: {
          title: "administration.users.userAdd.add",
          breadcrumb: "administration.users.userAdd.add",
        },
      },
      {
        path: "edit/:id",
        component: UsersAddEditComponent,
        data: {
          title: "administration.users.userEdit.edit",
          breadcrumb: "administration.users.userEdit.edit",
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule { }

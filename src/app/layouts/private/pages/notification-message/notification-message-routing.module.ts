import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NotificationMessagesListComponent } from "./notification-messages-list/notification-messages-list.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'notificationsMessage.list.title',
      breadcrumb: 'notificationsMessage.list.title',
    },

    children: [
      {
        path: '',
        component: NotificationMessagesListComponent,
      },
      /*{
        path: "detail/:id",
        //component: UsersDetailsComponent,
        data: {
          title: "administration.users.userDetails.title",
          breadcrumb: "administration.users.userDetails.title",
        },
      },
      {
        path: "add",
        //component: UsersAddEditComponent,
        data: {
          title: "administration.users.userAdd.add",
          breadcrumb: "administration.users.userAdd.add",
        },
      },
      {
        path: "edit/:id",
        //component: UsersAddEditComponent,
        data: {
          title: "administration.users.userEdit.edit",
          breadcrumb: "administration.users.userEdit.edit",
        },
      },*/
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationMessageRoutingModule { }
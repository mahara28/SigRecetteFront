import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationMessageRoutingModule } from './notification-message-routing.module';
import { NotificationMessagesListComponent } from './notification-messages-list/notification-messages-list.component';
import { AppSharedModule } from '../../../../app-shared/app-shared-module';



@NgModule({
    declarations: [
        NotificationMessagesListComponent
    ],
    imports: [
        CommonModule,
        AppSharedModule,
        NotificationMessageRoutingModule,
    ]
})
export class NotificationMessageModule { }
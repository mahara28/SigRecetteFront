import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { initSearchObject, isEmptyValue, onAction } from '../../../../../app-shared/tools';
import { RequestObject, SearchObject, Sort } from '../../../../../app-shared/models';
import { PermissionService } from '../../../shared/gestion-permission/permission.service';
import { SharedService } from '../../../../../app-shared/services/sharedWs/shared.service';
import { ConfirmDialogService, ToastService } from '../../../../../app-shared/services';
import { ActivatedRoute, Router } from '@angular/router';

import { NotificationListeMetadata } from '../notification-message.metadata';
import { ConstanteWs } from '../../../../../app-shared/constantes/constante-ws';
import { NOTIFICATION_MESSAGE } from '../notification-message-uri';
import { ResponseObject } from '../../../../../app-shared/models/ResponseObject';




@Component({
  selector: 'app-notification-messages-list',
  standalone: false,
  templateUrl: './notification-messages-list.component.html',
  styleUrls: ['./notification-messages-list.component.css']
})
export class NotificationMessagesListComponent implements OnInit, OnDestroy {
  codeTypeNotif?: any;

  subscriptionsList: Subscription[] = [];
    params: any = {};
    protected readonly onAction = onAction;
    //searchObject!: SearchObject;

    private permissionService = inject(PermissionService);
    private sharedService = inject(SharedService);

  constructor(private activatedRoute: ActivatedRoute,
     private toast: ToastService,
        private router: Router,
        private confirmDialogService: ConfirmDialogService,

  ) {  }

  ngOnInit() {

    this.codeTypeNotif = history.state?.code;
    console.log(this.codeTypeNotif)
    this.initMetadata();
    this.initNotificationList();
    this.initNotificationListAll();
  }

  ngOnDestroy() {
      for (const subscription of this.subscriptionsList) {
        if (!isEmptyValue(subscription)) {
          subscription.unsubscribe();
        }
      }
    }



    initMetadata() {
      this.params['notificationListData'] = {
      metadata: this.permissionService.getMetadataWithPermissions(
        NotificationListeMetadata.notificationListTableMetadata,
      ),
      payload: [],
      payloadall: [],
      searchObject: initSearchObject({
        sort: new Sort('id', 'desc'),
      }),
      searchObjectAll: new SearchObject(),
    };
    }


    initNotificationList() {
      //this.params.notificationListData.searchObject.sort = new Sort('id', 'desc');

      const request: RequestObject = <RequestObject>{
        uri: NOTIFICATION_MESSAGE.LISTNotif,
        params: {
          body: this.params.notificationListData.searchObject,
        },

        method: ConstanteWs._CODE_POST,
      };

      this.subscriptionsList.push(
        this.sharedService.commonWs(request).subscribe({
          next: (response: ResponseObject) => {
            if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
              this.params.notificationListData.payload = response.payload;
            } else {
              console.error(
                `Error in notificationListComponent/initnotificationList, error code :: ${response.code}`,
              );
              this.toast.error();
            }
          },
          error: (error) => {
            console.error(
              `Error in notificationListComponent/initnotificationList, error :: ${JSON.stringify(error)}`,
            );
            this.toast.error();
          },
        }),
      );
    }

    initNotificationListAll() {
      //this.params.notificationListData.searchObjectAll.sort = new Sort('id', 'desc');
    const searchAll = new SearchObject();
    searchAll.sort = new Sort('id', 'desc');
      const request: RequestObject = <RequestObject>{
        uri: NOTIFICATION_MESSAGE.LISTNotif,
        params: {
          body: searchAll,
        },

        method: ConstanteWs._CODE_POST,
      };

      this.subscriptionsList.push(
      this.sharedService.commonWs(request).subscribe({
        next: (response: ResponseObject) => {
          if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
            this.params.notificationListData.payloadall = response.payload;
          } else {
            console.error(`Error initNotificationListAll :: ${response.code}`);
            this.toast.error();
          }
        },
        error: (error) => {
          console.error(`Error initNotificationListAll :: ${JSON.stringify(error)}`);
          this.toast.error();
        },
      }),
    );
    }

     onPaginate(event: any) {
    this.params.notificationListData.searchObject.pagination = event;
    this.initNotificationList();
  }

  onSearch($event: any) {
    this.params.notificationListData.searchObject.pagination.offSet = 0;
    this.params.notificationListData.searchObject.pagination.limit = 10;
    this.params.notificationListData.searchObject.dataSearch = $event;
    this.initNotificationList();
  }

  onSort(event: any) {
    let sort = {
      nameCol: event.active,
      direction: event.direction,
    };
    this.params.notificationListData.searchObject.sort = sort;
    this.initNotificationList();
  }
   onTableAction(event: any): void {
    const { action, row } = event;

    if (action?.ref === 'details') {
      this.router.navigate(['/notifications/detail', row.id]);
    }

  }
}

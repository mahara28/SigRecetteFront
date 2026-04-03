import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { filter, forkJoin, Subscription } from 'rxjs';
import { initSearchObject, isEmptyValue, onAction } from '../../../../../app-shared/tools';
import { RequestObject, SearchObject, Sort } from '../../../../../app-shared/models';
import { PermissionService } from '../../../shared/gestion-permission/permission.service';
import { SharedService } from '../../../../../app-shared/services/sharedWs/shared.service';
import { ConfirmDialogService, ToastService } from '../../../../../app-shared/services';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

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
  isLoading = false;
  private permissionService = inject(PermissionService);
  private sharedService = inject(SharedService);
  private cdr = inject(ChangeDetectorRef);

  constructor(private activatedRoute: ActivatedRoute,
    private toast: ToastService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,

  ) { }

  ngOnInit() {
    this.initMetadata();
 this.subscriptionsList.push(
      this.activatedRoute.queryParams.subscribe(params => {
        const newCode = params['code'] ?? null;
        if (newCode !== this.codeTypeNotif) {
          this.codeTypeNotif = newCode;
          this.resetSearchObject();
        }
        // ✅ Toujours charger (même si code identique, ex: refresh)
        this.loadDataOnce();
      })
    );
  }

 // ✅ Réinitialiser la pagination et les filtres au changement de type
  resetSearchObject(): void {
    this.params.notificationListData.searchObject = initSearchObject({
      sort: new Sort('dateEnvoi', 'desc'),
    });
    this.params.notificationListData.searchObjectAll = new SearchObject();
  }

  // ✅ Méthode centrale pour charger les deux listes
  loadData(): void {
    this.initNotificationList();
    this.initNotificationListAll();
  }

  // ✅ Injecter le filtre codeTypeNotif proprement
  loadDataOnce(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    const searchObj = this.buildDataSearch(
      this.params.notificationListData.searchObject
    );

    // Requête paginée (page courante)
    const pagedRequest: RequestObject = <RequestObject>{
      uri: NOTIFICATION_MESSAGE.LISTNotif,
      params: { body: searchObj },
      method: ConstanteWs._CODE_POST,
    };

    // Requête sans pagination (pour total/export)
    const searchAll = this.buildDataSearch(new SearchObject());
    searchAll.sort = new Sort('dateEnvoi', 'desc');

    const allRequest: RequestObject = <RequestObject>{
      uri: NOTIFICATION_MESSAGE.LISTNotif,
      params: { body: searchAll },
      method: ConstanteWs._CODE_POST,
    };

    // ✅ forkJoin — attend les 2 réponses en parallèle
    const sub = forkJoin({
      paged: this.sharedService.commonWs(pagedRequest),
      all: this.sharedService.commonWs(allRequest),
    }).subscribe({
     /*  next: ({ paged, all }: { paged: ResponseObject, all: ResponseObject }) => {
        this.isLoading = false;

        if (paged.code == ConstanteWs._CODE_WS_SUCCESS) {
          const cleanData = (paged.payload?.data || []).filter((i: any) => i);
          this.params.notificationListData.payload = {
            total: paged.payload?.total || cleanData.length,
            data: cleanData,
          };
        }

        if (all.code == ConstanteWs._CODE_WS_SUCCESS) {
          const cleanAll = (all.payload?.data || []).filter((i: any) => i);
          this.params.notificationListData.payloadall = {
            total: all.payload?.total || cleanAll.length,
            data: cleanAll,
          };
        }

        this.cdr.markForCheck(); // ✅ Notifier OnPush
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur loadDataOnce ::', error);
        this.toast.error();
        this.cdr.markForCheck(); */
        next: ({ paged, all }) => {
  this.isLoading = false;

  if (paged.code == ConstanteWs._CODE_WS_SUCCESS) {
    const cleanData = (paged.payload?.data || [])
      .filter((i: any) => i)
      .map((item: any) => ({
        ...item,
        // ✅ Transformer les dates au bon format
        dateEnvoi: item.dateEnvoi
          ? this.formatDate(item.dateEnvoi)
          : null,
        dateReception: item.dateReception
          ? this.formatDate(item.dateReception)
          : null,
      }));

    this.params.notificationListData.payload = {
      total: paged.payload?.total || cleanData.length,
      data: cleanData,
    };
  }
  this.cdr.markForCheck();

      },
    });

    this.subscriptionsList.push(sub);
  }
private formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr.replace(' ', 'T'));
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const HH = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
}
  private buildDataSearch(baseSearch: any): any {
    if (!baseSearch.dataSearch) baseSearch.dataSearch = [];

    baseSearch.dataSearch = baseSearch.dataSearch.filter(
      (f: any) => f.key !== 'codeTypeNotif'
    );

    if (this.codeTypeNotif) {
      baseSearch.dataSearch.push({
        key: 'codeTypeNotif',
        value: this.codeTypeNotif,
        specificSearch: '=',
      });
    }
    return baseSearch;
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptionsList) {
      if (!isEmptyValue(subscription)) {
        subscription.unsubscribe();
      }
    }
  }

  initMetadata(): void {
    this.params['notificationListData'] = {
      metadata: this.permissionService.getMetadataWithPermissions(
        NotificationListeMetadata.notificationListTableMetadata,
      ),
      payload: [],
      payloadall: [],
      searchObject: initSearchObject({
        sort: new Sort('dateEnvoi', 'desc'),
      }),
      searchObjectAll: new SearchObject(),
    };
  }



  initNotificationList() {
     const searchObj = this.params.notificationListData.searchObject;
     if (!searchObj.dataSearch) {
    searchObj.dataSearch = [];
  }
   searchObj.dataSearch = searchObj.dataSearch.filter(
    (f: any) => f.key !== 'codeTypeNotif'
  );
if (this.codeTypeNotif) {
    searchObj.dataSearch.push({
      key: 'codeTypeNotif',
      value: this.codeTypeNotif, // MSG | NOTIF | EMAIL
      specificSearch: '='
    });
  }
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
                      const cleanData = (response.payload?.data || []).filter((item: any) => item);
this.params.notificationListData.payload = {
            total: response.payload?.total || cleanData.length,
            data: cleanData};
            //this.params.notificationListData.payload = response.payload;

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

  const searchObj = this.params.notificationListData.searchObjectAll;

  if (!searchObj.dataSearch) {
    searchObj.dataSearch = [];
  }

  searchObj.dataSearch = searchObj.dataSearch.filter(
    (f: any) => f.key !== 'codeTypeNotif'
  );

  if (this.codeTypeNotif) {
    searchObj.dataSearch.push({
      key: 'codeTypeNotif',
      value: this.codeTypeNotif,
      specificSearch: '='
    });
  }

  const request: RequestObject = {
    uri: NOTIFICATION_MESSAGE.LISTNotif,
    params: {
      body: searchObj,
    },
    method: ConstanteWs._CODE_POST,
  };

  this.subscriptionsList.push(
    this.sharedService.commonWs(request).subscribe({
      next: (response: ResponseObject) => {
        if (response.code == ConstanteWs._CODE_WS_SUCCESS) {

          const cleanData = (response.payload?.data || []).filter((item: any) => item);

          this.params.notificationListData.payloadall = {
            total: response.payload?.total || cleanData.length,
            data: cleanData
          };

        } else {
          this.toast.error();
        }
      },
      error: () => this.toast.error(),
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

}

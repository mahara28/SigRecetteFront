import { Component, inject, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestObject, SearchObject, Sort } from '../../../../../../app-shared/models';
import { isEmptyValue, onAction, initSearchObject } from '../../../../../../app-shared/tools';
import { SharedService } from '../../../../../../app-shared/services/sharedWs/shared.service';
import {
  AppTranslateService,
  ConfirmDialogService,
  ToastService,
} from '../../../../../../app-shared/services';
import { Router } from '@angular/router';
import { UserListMetatdata } from '../user-management.metadata';
import { USERS_DATA_URI } from '../user-management.uri';
import { ConstanteWs } from '../../../../../../app-shared/constantes/constante-ws';
import { ResponseObject } from '../../../../../../app-shared/models/ResponseObject';
import { AppSharedModule } from '../../../../../../app-shared/app-shared-module';
import { PermissionService } from '../../../../shared/gestion-permission/permission.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
  standalone: false,
})
export class UsersListComponent implements OnInit {
  subscriptionsList: Subscription[] = [];
  params: any = {};
  protected readonly onAction = onAction;
  searchObject!: SearchObject;

  private permissionService = inject(PermissionService);
  private sharedService = inject(SharedService);

  constructor(
    private toast: ToastService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService,
  ) {
    this.initParams();
  }

  ngOnInit() {
    this.initMetadata();
    this.initUsersListAll().then(() => {
      this.initUsersList();
    });
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptionsList) {
      if (!isEmptyValue(subscription)) {
        subscription.unsubscribe();
      }
    }
  }

  initParams() {}

  initMetadata() {
    this.params['userListData'] = {
      metadata: UserListMetatdata.userListTableMetadata,
      payload: [],
      payloadall: [],
      searchObject: initSearchObject({
        sort: new Sort('createDate', 'desc nulls last'),
      }),
      searchObjectAll: new SearchObject(),
    };

    //****** Gestion des droit d'accée ****//
    this.params['userListData'] = this.permissionService.getMetadataWithPermissions(
      UserListMetatdata.userListTableMetadata,
    );
    /***************************************/
  }

  /** Manage user data functions */
  initUsersList() {
    this.params.userListData.searchObject.sort = new Sort('id', 'desc');

    const request: RequestObject = <RequestObject>{
      uri: USERS_DATA_URI.V_USER_LIST_DATA,
      params: {
        body: this.params.userListData.searchObject,
      },

      method: ConstanteWs._CODE_POST,
    };

    this.subscriptionsList.push(
      this.sharedService.commonWs(request).subscribe({
        next: (response: ResponseObject) => {
          if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
            this.params.userListData.payload = response.payload;
          } else {
            console.error(
              `Error in UsersListComponent/initUsersList, error code :: ${response.code}`,
            );
            this.toast.error();
          }
        },
        error: (error) => {
          console.error(
            `Error in UsersListComponent/initUsersList, error :: ${JSON.stringify(error)}`,
          );
          this.toast.error();
        },
      }),
    );
  }

  initUsersListAll() {
    this.params.userListData.searchObjectAll.sort = new Sort('id', 'desc');

    const request: RequestObject = <RequestObject>{
      uri: USERS_DATA_URI.V_USER_LIST_DATA,
      params: {
        body: this.params.userListData.searchObjectAll,
      },

      method: ConstanteWs._CODE_POST,
    };

    return new Promise((resolve) => {
      this.subscriptionsList.push(
        this.sharedService.commonWs(request).subscribe({
          next: (response: ResponseObject) => {
            if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
              this.params.userListData.payloadall = response.payload;

              resolve(this.params.userListData.payloadall);
            } else {
              console.error(
                `Error in UsersListComponent/initUsersList, error code :: ${response.code}`,
              );
              this.toast.error();
            }
          },
          error: (error) => {
            console.error(
              `Error in UsersListComponent/initUsersList, error :: ${JSON.stringify(error)}`,
            );
            this.toast.error();
          },
        }),
      );
    });
  }

  onPaginate(event: any) {
    this.params.userListData.searchObject.pagination = event;
    this.initUsersList();
  }

  onSearch($event: any) {
    this.params.userListData.searchObject.pagination.offSet = 0;
    this.params.userListData.searchObject.pagination.limit = 10;
    this.params.userListData.searchObject.dataSearch = $event;
    this.initUsersList();
  }

  onSort(event: any) {
    let sort = {
      nameCol: event.active,
      direction: event.direction,
    };
    this.params.userListData.searchObject.sort = sort;
    this.initUsersList();
  }

  onAddTableUserMangement() {
    this.router.navigate(['app', 'adm', 'users', 'userManag', 'add']);
  }

  onEditTableUserMangement(data: any) {
    this.router.navigate(['app', 'adm', 'users', 'userManag', 'edit', data.item.id]);
  }

  onDeleteTableUserMangement(data: any) {
    this.subscriptionsList.push(
      this.confirmDialogService.confirm('', 'general.delete_confirmation').subscribe((flag) => {
        if (flag) {
          const request: RequestObject = <RequestObject>{
            uri: USERS_DATA_URI.USER_DELETE,
            params: {
              path: [data.item.id],
            },

            method: ConstanteWs._CODE_DELETE,
          };

          this.subscriptionsList.push(
            this.sharedService.commonWs(request).subscribe({
              next: (response) => {
                if (response['code'] == '200') {
                  this.toast.success('administration.users.messages.success.success_delete');
                  this.initUsersList();
                  this.router.navigate(['/app/adm/users/userManag']);
                } else if (response['code'] == '424') {
                  this.toast.error(
                    'administration.users.messages.error.Cetteentitéestreliéàunautrecomposant',
                  );
                } else {
                  console.error(
                    `Error in UsersListComponent/onDeleteTableUserMangement, error code :: ${response.code}`,
                  );
                  this.toast.error();
                }
              },
            }),
          );
        }
      }),
    );
  }
  onExportTableUserMangement(typeExport: any) {
    const searcho: SearchObject = this.params.userListData.searchObject;
    searcho.sort = new Sort('username', 'asc');
    searcho.language = AppTranslateService.getStoredLanguage();
    searcho.typeExport = typeExport.item;
    searcho.metadata = this.params['userListData'].metadata;

    const request: RequestObject = <RequestObject>{
      uri: USERS_DATA_URI.EXPORT,
      params: {
        body: searcho,
      },

      method: ConstanteWs._CODE_POST,
    };
    this.sharedService.exportWs(
      request,
      'FicheListeuserListDataComponent/onExportTableuserListData',
    );
  }
}

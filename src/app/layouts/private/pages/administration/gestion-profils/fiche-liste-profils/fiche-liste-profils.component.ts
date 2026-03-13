import { Component, inject, OnInit } from '@angular/core';
import { RequestObject, SearchObject, Sort } from '../../../../../../app-shared/models';
import { Subscription } from 'rxjs';
import { initSearchObject, isEmptyValue, onAction } from '../../../../../../app-shared/tools';
import { Router } from '@angular/router';
import {
  AppTranslateService,
  ConfirmDialogService,
  ToastService,
} from '../../../../../../app-shared/services';
import { SharedService } from '../../../../../../app-shared/services/sharedWs/shared.service';
import { FicheListeProfilsMetadata } from '../gestion-profils.metadata';
import { ConstanteWs } from '../../../../../../app-shared/constantes/constante-ws';
import { ResponseObject } from '../../../../../../app-shared/models/ResponseObject';
import { FICHE_LISTE_PROFILS } from '../gestion-profils-uri';
import { SessionStorageService } from '../../../../../../app-shared/services/SessionStorage/session-storage.service';
import { Icons } from '../../../../../../app-shared/constantes/Icons';
import { PermissionService } from '../../../../shared/gestion-permission/permission.service';

@Component({
  selector: 'app-fiche-liste-profils',
  standalone: false,
  templateUrl: './fiche-liste-profils.component.html',
  styleUrls: ['./fiche-liste-profils.component.scss'],
})
export class FicheListeProfilsComponent implements OnInit {
  subscriptionsList: Subscription[] = [];
  params: any = {};
  idFonc!: any;
  protected readonly onAction = onAction;
  searchObject!: SearchObject;

  private sessionStorage = inject(SessionStorageService);
  private sharedService = inject(SharedService);
  private toast = inject(ToastService);
  private confirmDialogService = inject(ConfirmDialogService);
  private router = inject(Router);
  private permissionService = inject(PermissionService);

  ngOnInit() {
    this.initMetadata();
    this.initListProfils();
    this.initListProfilsall();
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptionsList) {
      if (!isEmptyValue(subscription)) {
        subscription.unsubscribe();
      }
    }
  }

  initMetadata() {
    this.params['listeProfils'] = {
      metadata: FicheListeProfilsMetadata.tableListProfilsMetadata,
      payload: [],
      payloadall: [],
      searchObject: initSearchObject({
        sort: new Sort('dateUpdate', 'desc nulls last'),
      }),
      searchObjectall: new SearchObject(),
    };
    //****** Gestion des droit d'accée ****//
    this.params['listeProfils'] = this.permissionService.getMetadataWithPermissions(
      FicheListeProfilsMetadata.tableListProfilsMetadata,
    );
  }

  onPaginate(event: any) {
    this.params.listeProfils.searchObject.pagination = event;
    this.initListProfils();
  }

  onSort(event: any) {
    let sort = {
      nameCol: event.active,
      direction: event.direction,
    };

    this.params.listeProfils.searchObject.sort = sort;
    this.initListProfils();
  }

  // init data functions
  initListProfils() {
    const request: RequestObject = <RequestObject>{
      uri: FICHE_LISTE_PROFILS.V_PROFIL_DATA,
      params: {
        body: this.params.listeProfils.searchObject,
      },

      method: ConstanteWs._CODE_POST,
    };

    this.subscriptionsList.push(
      this.sharedService.commonWs(request).subscribe({
        next: (response: ResponseObject) => {
          if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
            for (let item of response.payload.data) {
              if (item['isActive'] == 1) {
                item['isActive'] = AppTranslateService.getStoredLanguage() == 'fr' ? 'Oui' : 'نعم ';
              } else {
                item['isActive'] = AppTranslateService.getStoredLanguage() == 'fr' ? 'Non' : 'لا';
              }
            }
            this.params.listeProfils.payload = response.payload;
          } else {
            console.error(
              `Error in FicheListeProfilsComponent/initListProfils, error code :: ${response.code}`,
            );
            this.toast.error();
          }
        },
        error: (error) => {
          console.error(
            `Error in FicheListeProfilsComponent/initListProfils, error :: ${JSON.stringify(
              error,
            )}`,
          );
          this.toast.error();
        },
      }),
    );
  }

  initListProfilsall() {
    const request: RequestObject = <RequestObject>{
      uri: FICHE_LISTE_PROFILS.V_PROFIL_DATA,
      params: {
        body: this.params.listeProfils.searchObjectall,
      },

      method: ConstanteWs._CODE_POST,
    };

    this.subscriptionsList.push(
      this.sharedService.commonWs(request).subscribe({
        next: (response: ResponseObject) => {
          if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
            for (let item of response.payload.data) {
              if (item['isActive'] == 1) {
                item['isActive'] = AppTranslateService.getStoredLanguage() == 'fr' ? 'Oui' : 'نعم ';
              } else {
                item['isActive'] = AppTranslateService.getStoredLanguage() == 'fr' ? 'Non' : 'لا';
              }
            }

            this.params.listeProfils.payloadall = response.payload;
          } else {
            console.error(
              `Error in FicheListeProfilsComponent/initListProfils, error code :: ${response.code}`,
            );
            this.toast.error();
          }
        },
        error: (error) => {
          console.error(
            `Error in FicheListeProfilsComponent/initListProfils, error :: ${JSON.stringify(
              error,
            )}`,
          );
          this.toast.error();
        },
      }),
    );
  }

  onAddTableGestionProfils(row: any) {
    this.router.navigate(['/app/adm/profil/userProfil/add']);
  }
  openDetailsTableGestionProfils(row: any) {
    this.router.navigate(['/app/adm/profil/userProfil/detail', row.item.id]);
  }
  onEditTableGestionProfils(row: any) {
    this.router.navigate(['/app/adm/profil/userProfil/update', row.item.id]);
  }

  onDeleteTableGestionProfils(row: any) {
    this.subscriptionsList.push(
      this.confirmDialogService.confirm('', 'general.delete_confirmation').subscribe((flag) => {
        if (flag) {
          const request: RequestObject = <RequestObject>{
            uri: FICHE_LISTE_PROFILS.DELETE,
            params: {
              path: [row.item.id],
            },

            method: ConstanteWs._CODE_DELETE,
          };

          this.subscriptionsList.push(
            this.sharedService.commonWs(request).subscribe({
              next: (response) => {
                if (response['code'] == '200') {
                  this.toast.success('general.message.success_delete');
                  this.initListProfils();
                  this.initListProfilsall();
                } else if (response['code'] == '424') {
                  this.toast.error(
                    'administration.users.messages.error.Cetteentitéestreliéàunautrecomposant',
                  );
                } else {
                  console.error(
                    `Error in FicheListeProfilsComponent/onDeleteTableGestionProfils, error code :: ${response.code}`,
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

  onExportTableGestionProfils(typeExport: any) {
    const searcho: SearchObject = new SearchObject();
    searcho.sort = new Sort('code', 'asc');

    searcho.language = AppTranslateService.getStoredLanguage();
    searcho.typeExport = typeExport.item;

    searcho.metadata = this.params['listeProfils'].metadata;

    const request: RequestObject = <RequestObject>{
      uri: FICHE_LISTE_PROFILS.EXPORT,
      params: {
        body: searcho,
      },

      method: ConstanteWs._CODE_POST,
    };
    this.sharedService.exportWs(request, 'FicheListeProfilsComponent/onExportTableGestionProfils');
  }
}

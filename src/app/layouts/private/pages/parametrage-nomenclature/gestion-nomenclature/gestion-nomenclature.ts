import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AppSharedModule } from "../../../../../app-shared/app-shared-module";
import { FilterListeNomenclature } from "./filter-liste-nomenclature/filter-liste-nomenclature";
import { Subscription } from 'rxjs';
import { initSearchObject, isEmptyValue, onAction } from '../../../../../app-shared/tools';
import { SharedService } from '../../../../../app-shared/services/sharedWs/shared.service';
import { AppTranslateService, AuthentificationService, ConfirmDialogService, ToastService } from '../../../../../app-shared/services';
import { Router } from 'express';
import { RequestObject, SearchObject, Sort } from '../../../../../app-shared/models';
import { ConstanteWs } from '../../../../../app-shared/constantes/constante-ws';
import { ResponseObject } from '../../../../../app-shared/models/ResponseObject';
import { ListeNomenclatureMetadata, ParamNomenclatureMetadata } from '../parametrage-nomenclature.metadata';
import { PARAM_NOMENCLATURE_URI } from '../parametrage-nomenclature.uri';
import { PermissionService } from '../../../shared/gestion-permission/permission.service';

@Component({
  selector: 'app-gestion-nomenclature',
  standalone: false,
  templateUrl: './gestion-nomenclature.html',
  styleUrl: './gestion-nomenclature.css',
})
export class GestionNomenclature implements OnInit, OnDestroy {

  subscriptionsList: Subscription[] = [];
  params: any = {};
  selectedNomTable: string | null = null;
  protected readonly onAction = onAction;

  private sharedService = inject(SharedService);
  private toast = inject(ToastService);
  private confirmDialogService = inject(ConfirmDialogService);

constructor(
    private permissionService: PermissionService,

  ) {

  }


  ngOnInit() {
    this.initMetadata();
    this.initListParamNomenclatures();

  }

  ngOnDestroy() {
    for (const subscription of this.subscriptionsList) {
      if (!isEmptyValue(subscription)) {
        subscription.unsubscribe();
      }
    }
  }

  initMetadata() {
    this.params['paramNomenclature'] = {
      metadata: this.permissionService.getMetadataWithPermissions(
              ListeNomenclatureMetadata.nomenclatureListTableMetadata,
            ),
      payload: [],
      payloadall: [],
      searchObject: initSearchObject({
        sort: new Sort('ordrAffi', 'asc nulls last'),
      }),
      searchObjectall: new SearchObject(),
    };

    // Tableau des données dynamiques de la nomenclature sélectionnée
    this.params['nomenclatureData'] = {
      metadata: ListeNomenclatureMetadata.nomenclatureListTableMetadata,
      payload: [],
      payloadall: [],
      searchObject: initSearchObject({
        sort: new Sort('code', 'asc nulls last'),
      }),
      searchObjectall: new SearchObject(),
    };
  }
  initListParamNomenclatures() {
    const request: RequestObject = <RequestObject>{
      uri: PARAM_NOMENCLATURE_URI.V_NOMENCLATURE_LIST_DATA,
      params: { body: this.params.paramNomenclature.searchObject },
      method: ConstanteWs._CODE_POST,
    };

    this.subscriptionsList.push(
      this.sharedService.commonWs(request).subscribe({
        next: (response: ResponseObject) => {
          if (response.code === ConstanteWs._CODE_WS_SUCCESS) {
            this.formatIsActive(response.payload.data);
            this.params.paramNomenclature.payload = response.payload;
          } else {
            console.error(
              `Error FicheListeNomenclatureComponent/initListParamNomenclatures :: ${response.code}`,
            );
            this.toast.error();
          }
        },
        error: (error) => {
          console.error(`Error :: ${JSON.stringify(error)}`);
          this.toast.error();
        },
      }),
    );
  }



  onPaginateParamNomenclature(event: any) {
    this.params.paramNomenclature.searchObject.pagination = event;
    this.initListParamNomenclatures();
  }

  onSortParamNomenclature(event: any) {
    this.params.paramNomenclature.searchObject.sort = {
      nameCol: event.active,
      direction: event.direction,
    };
    this.initListParamNomenclatures();
  }

  // ─── Sélection d'une nomenclature ────────────────────────────────────────

  onViewNomenclatureData(row: any) {
    this.selectedNomTable = row.item.nomTable;
    this.loadNomenclatureData(row.item.nomTable);
  }

  loadNomenclatureData(nomTable: string) {
    if (!nomTable) return;

    const request: RequestObject = <RequestObject>{
      uri: PARAM_NOMENCLATURE_URI.DATA,
      params: { query: { nomTable } },
      method: ConstanteWs._CODE_POST,
    };

    this.subscriptionsList.push(
      this.sharedService.commonWs(request).subscribe({
        next: (response: ResponseObject) => {
          if (response.code === ConstanteWs._CODE_WS_SUCCESS) {
            // les données dynamiques arrivent en tableau simple (pas paginé)
            this.params.nomenclatureData.payload = {
              data: response.payload,
              totalElements: response.payload?.length ?? 0,
            };
            this.params.nomenclatureData.payloadall = {
              data: response.payload,
              totalElements: response.payload?.length ?? 0,
            };
          } else {
            console.error(
              `Error FicheListeNomenclatureComponent/loadNomenclatureData :: ${response.code}`,
            );
            this.toast.error();
          }
        },
        error: (error) => {
          console.error(`Error :: ${JSON.stringify(error)}`);
          this.toast.error();
        },
      }),
    );
  }

  onPaginateNomenclatureData(event: any) {
    this.params.nomenclatureData.searchObject.pagination = event;
    if (this.selectedNomTable) this.loadNomenclatureData(this.selectedNomTable);
  }

  onSortNomenclatureData(event: any) {
    this.params.nomenclatureData.searchObject.sort = {
      nameCol: event.active,
      direction: event.direction,
    };
    if (this.selectedNomTable) this.loadNomenclatureData(this.selectedNomTable);
  }


  onSearch($event: any) {
    this.params.paramNomenclature.searchObject.pagination.offSet = 0;
    this.params.paramNomenclature.searchObject.pagination.limit = 10;
    this.params.paramNomenclature.searchObject.dataSearch = $event;
    this.initListParamNomenclatures();
  }

  // ─── Actions CRUD sur la nomenclature dynamique ──────────────────────────

  onAddNomenclatureData(row: any) {
    // Naviguer vers le formulaire d'ajout (adapter la route)
    // this.router.navigate(['/app/nomenclature/add', this.selectedNomTable]);
  }

  onEditNomenclatureData(row: any) {
    // this.router.navigate(['/app/nomenclature/edit', this.selectedNomTable, row.item.id]);
  }

  onDeleteNomenclatureData(row: any) {
    this.subscriptionsList.push(
      this.confirmDialogService.confirm('', 'general.delete_confirmation').subscribe((flag) => {
        if (flag && this.selectedNomTable) {
          // Appel suppression dynamique à adapter selon l'API
          this.toast.success('general.message.success_delete');
          this.loadNomenclatureData(this.selectedNomTable);
        }
      }),
    );
  }

  onExportNomenclatureData(typeExport: any) {
    if (!this.selectedNomTable) return;

    const request: RequestObject = <RequestObject>{
      uri: PARAM_NOMENCLATURE_URI.DATA,
      params: { query: { nomTable: this.selectedNomTable } },
      method: ConstanteWs._CODE_POST,
    };

    this.sharedService.exportWs(
      request,
      'FicheListeNomenclatureComponent/onExportNomenclatureData',
    );
  }

  // ─── Utilitaires ─────────────────────────────────────────────────────────

  private formatIsActive(data: any[]) {
    const lang = AppTranslateService.getStoredLanguage();
    for (const item of data) {
      if (item['isActive'] == 1) {
        item['isActive'] = lang === 'fr' ? 'Oui' : 'نعم';
      } else {
        item['isActive'] = lang === 'fr' ? 'Non' : 'لا';
      }
    }
  }

}

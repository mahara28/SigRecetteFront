import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AppSharedModule } from "../../../../../app-shared/app-shared-module";
import { FilterListeNomenclature } from "./filter-liste-nomenclature/filter-liste-nomenclature";
import { Subscription } from 'rxjs';
import { initSearchObject, isEmptyValue, onAction } from '../../../../../app-shared/tools';
import { SharedService } from '../../../../../app-shared/services/sharedWs/shared.service';
import { AppTranslateService, AuthentificationService, ConfirmDialogService, ToastService } from '../../../../../app-shared/services';
import { RequestObject, SearchObject, Sort } from '../../../../../app-shared/models';
import { ConstanteWs } from '../../../../../app-shared/constantes/constante-ws';
import { ResponseObject } from '../../../../../app-shared/models/ResponseObject';
import { ListeNomenclatureMetadata, ParamNomenclatureMetadata } from '../parametrage-nomenclature.metadata';
import { PARAM_NOMENCLATURE_URI } from '../parametrage-nomenclature.uri';
import { PermissionService } from '../../../shared/gestion-permission/permission.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
  //protected readonly isEmptyValue = isEmptyValue;
  private sharedService = inject(SharedService);
  private toast = inject(ToastService);
  private confirmDialogService = inject(ConfirmDialogService);

  constructor(
    private permissionService: PermissionService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService,
  ) {

  }


  ngOnInit() {
    this.initMetadata();
    this.initListNomenclatures();


  }

  ngOnDestroy() {
    for (const subscription of this.subscriptionsList) {
      if (!isEmptyValue(subscription)) {
        subscription.unsubscribe();
      }
    }
  }

  initMetadata() {
    this.params['nomenclature'] = {
      metadata: this.permissionService.getMetadataWithPermissions(
        ListeNomenclatureMetadata.nomenclatureListTableMetadata,
      ),
      payload: [],
      payloadall: [],
      searchObject: initSearchObject({
        sort: new Sort('ordrAffi', 'desc nulls last'),
      }),
      searchObjectall: new SearchObject(),
    };

    // Tableau des données dynamiques de la nomenclature sélectionnée
    this.params['nomenclatureData'] = {
      metadata: {
        ...ListeNomenclatureMetadata.nomenclatureListTableMetadata,
        hasAdd: false,
        hasExport: false,
        hasFilter: true,
      },

      payload: { data: [], totalElements: 0 },
      payloadall: { data: [], totalElements: 0 },
      searchObject: initSearchObject({
        sort: new Sort('ordrAffi', 'asc nulls last'),
      }),
      searchObjectall: new SearchObject(),
    };
  }


  initListNomenclatures() {
    this.cdr.detectChanges();
    const request: RequestObject = <RequestObject>{
      uri: PARAM_NOMENCLATURE_URI.DATA,
      params: {
        body: this.params.paramNomenclature.searchObject,
      },
      method: ConstanteWs._CODE_POST,
    };

    this.subscriptionsList.push(
      this.sharedService.commonWs(request).subscribe({
        next: (response: ResponseObject) => {
          if (response.code === ConstanteWs._CODE_WS_SUCCESS) {

            this.params(response.payload.data);

            this.params.paramNomenclature.payload = response.payload;
            this.params.paramNomenclature.payloadall = response.payload;
          } else {
            console.error('Erreur initListNomenclatures', response.code);
            this.toast.error();
          }
        },
        error: (error) => {
          console.error('Erreur WS', error);
          this.toast.error();
        },
      })
    );
  }



  onPaginateNomenclature(event: any) {
    this.params.nomenclature.searchObject.pagination = event;
    this.initListNomenclatures();
  }

  onSortNomenclatures(event: any) {
    this.params.nomenclature.searchObject.sort = {
      nameCol: event.active,
      direction: event.direction,
    };
    this.initListNomenclatures();
  }

  onSelectNomenclature(nomTable: any) {

    this.selectedNomTable = nomTable;

    if (!isEmptyValue(nomTable)) {
      this.loadNomenclatureData(nomTable);
    } else {

      this.params.nomenclatureData.payload = { data: [], totalElements: 0 };

      this.params.nomenclatureData.metadata = {
        ...this.params.nomenclatureData.metadata,
        hasAdd: false,
        hasExport: false,
      };
    }
  }

  loadNomenclatureData(nomTable: string) {
    if (!nomTable) return;

    const request: RequestObject = {
      uri: PARAM_NOMENCLATURE_URI.DATA,
      method: ConstanteWs._CODE_POST,
      params: { query: { nomTable } },
    };

    this.subscriptionsList.push(
      this.sharedService.commonWs(request).subscribe({
        next: (response: ResponseObject) => {
          if (response.code === ConstanteWs._CODE_WS_SUCCESS) {

            const data = (response.payload || []).map((item: any) => ({
              ...item,
              is_active:
                item.is_active == 1
                  ? this.translate.instant('general.active')
                  : this.translate.instant('general.inactive'),
            }));


            this.params.nomenclatureData.payload = { data, totalElements: data.length };
            this.params.nomenclatureData.payloadall = { data, totalElements: data.length };

            this.params.nomenclatureData.metadata = {
              ...this.permissionService.getMetadataWithPermissions(
                ListeNomenclatureMetadata.nomenclatureListTableMetadata,
              ),
              hasFilter: true,
            }
            this.cdr.detectChanges();

          } else {
            this.toast.error();
          }
        },
        error: () => this.toast.error(),
      })
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
    this.params.nomenclatures.searchObject.pagination.offSet = 0;
    this.params.nomenclatures.searchObject.pagination.limit = 10;
    this.params.nomenclatures.searchObject.dataSearch = $event;
    this.initListNomenclatures();
  }

  onAddTableNomenclatureData(row: any) {

    this.router.navigate(
      ['app', 'paranomenc', 'gestNomenclature', 'add', this.selectedNomTable],
    );

  }



  onEditTableNomenclatureData(row: any) {
    this.router.navigate(['/app/paranomenc/gestNomenclature/edit', this.selectedNomTable, row.item.id]);
  }

  onDeleteTableNomenclatureData(row: any) {
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

  onExportTableNomenclatureData(typeExport: any) {
    const searcho: SearchObject = new SearchObject();
    searcho.sort = new Sort('orderAffi', 'asc');

    searcho.language = AppTranslateService.getStoredLanguage();
    searcho.typeExport = typeExport.item;

    searcho.metadata = this.params['listeProfils'].metadata;

    const request: RequestObject = <RequestObject>{
      uri: PARAM_NOMENCLATURE_URI.EXPORT,
      params: {
        body: searcho,
      },

      method: ConstanteWs._CODE_POST,
    };
    this.sharedService.exportWs(request, ' FicheListeNomenclatureComponent/onExportListeNomenclatureData');
  }





  // ─── Utilitaires ─────────────────────────────────────────────────────────

}

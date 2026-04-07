import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { AppSharedModule } from "../../../../../../app-shared/app-shared-module";
import EventEmitter from 'events';
import { FormControl, FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { initSearchObject, isEmptyValue } from '../../../../../../app-shared/tools';
import { SharedService } from '../../../../../../app-shared/services/sharedWs/shared.service';
import { AppTranslateService, ToastService } from '../../../../../../app-shared/services';
import { CriteriaSearch, Pagination, RequestObject, SelectMetadata, Sort } from '../../../../../../app-shared/models';
import { FilterActions } from "../../../../../../app-shared/widgets";
import { Subscription, from } from 'rxjs';
import { ConstanteWs } from '../../../../../../app-shared/constantes/constante-ws';
import { ResponseObject } from '../../../../../../app-shared/models/ResponseObject';
import { PARAM_NOMENCLATURE_URI } from '../../parametrage-nomenclature.uri';
import { NomenclatureMetadata, SelectNomenclatureMetadata } from '../../parametrage-nomenclature.metadata';

@Component({
  selector: 'mc-filter-liste-nomenclature',
  //standalone:false,
  templateUrl: './filter-liste-nomenclature.html',
  styleUrl: './filter-liste-nomenclature.css',
  imports: [AppSharedModule, FilterActions],
})
export class FilterListeNomenclature implements OnInit {
  @Output() searchoptions = new EventEmitter<Partial<any>>();
  @Output() selectionChange = new EventEmitter<any>();
  params: any = {};
  form!: FormGroup;
  subscriptionsList: Subscription[] = [];
  nomenclatureList: any[] = [];


  constructor(
    private toast: ToastService,
    private formBuilder: UntypedFormBuilder,
    private sharedService: SharedService,
  ) {
  }
  ngOnInit() {
    this.form = new FormGroup({
      nomTable: new FormControl('')
    });

    //this.loadNomenclatures();
  }
  initForm() {
     this.form = this.formBuilder.group({
      state: [null],
    });
  }

  initMetadata() {

    this.params.nomenclature = {
      metadata: NomenclatureMetadata.nomenclatureListTableMetadata,
      data: [],
    };
  }
/*
  initNomenclatureList() {
    const request: RequestObject = {
      uri: PARAM_NOMENCLATURE_URI.NOMENCLATURE_LIST_DATA,
      method: ConstanteWs._CODE_POST,
      params: {
        body: initSearchObject({
          pagination: new Pagination(0, 1000),
          sort: new Sort('codeLibe', 'asc'),
          dataSearch: [],
        }),
      },



    };

   this.subscriptionsList.push(
      this.sharedService.commonWs(request).subscribe({
        next: (response: ResponseObject) => {
          if (response.code === ConstanteWs._CODE_WS_SUCCESS) {
            this.params.nomenclature.data = response.payload.data || [];
          } else {
            console.error('Erreur lors de la récupération des nomenclatures', response.code);
            this.toast.error();
          }
        },
        error: (err) => {
          console.error('Erreur WS nomenclature', err);
          this.toast.error();
        },
      })
    );
  }
loadNomenclatures() {
  // Crée l'objet de recherche avec pagination et tri
  const searchObj = initSearchObject({
    pagination: new Pagination(0, 1000),
    sort: new Sort('nomTable', 'asc'),
    dataSearch: []
  });

  // Si l'utilisateur a saisi un nom de table, on l'ajoute dans dataSearch
  const nomTable = this.form.get('nomTable').value;
  if (!isEmptyValue(nomTable)) {
    searchObj.dataSearch.push({
      key: 'nomTable',
      value: nomTable,
      specificSearch: 'upper_like'
    });
  }

  const request: RequestObject = {
    uri: PARAM_NOMENCLATURE_URI.NOMENCLATURE_LIST_DATA, // par exemple '/dynamic-nomenclature/data'
    method: ConstanteWs._CODE_POST,
    params: { body: searchObj }
  };

  this.subscriptionsList.push(
    this.sharedService.commonWs(request).subscribe({
      next: (response: ResponseObject) => {
        if (response.code === ConstanteWs._CODE_WS_SUCCESS) {
          this.params.nomenclature.data = response.payload.data || [];
        } else {
          console.error('Erreur lors de la récupération des nomenclatures', response.code);
          this.toast.error();
        }
      },
      error: (err) => {
        console.error('Erreur WS nomenclature', err);
        this.toast.error();
      }
    })
  );
}

  ngOnDestroy() {
     this.subscriptionsList.forEach((sub) => sub?.unsubscribe());
  }

 onSearch() {
    this.loadNomenclatures();
  }

  onSelectNomenclature(nomTable: string) {
    const selected = this.nomenclatureList.find(n => n.nomTable === nomTable);
    this.selectionChange.emit(selected);
  }

  onReset() {
    this.form.reset();
    this.nomenclatureList = [];
    this.selectionChange.emit(null);
  }
 */
}

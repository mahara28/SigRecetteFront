import { Component, OnDestroy, EventEmitter, Output, OnInit } from '@angular/core';

import {  ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { initSearchObject, isEmptyValue } from '../../../../../../app-shared/tools';
import { SharedService } from '../../../../../../app-shared/services/sharedWs/shared.service';
import {  ToastService } from '../../../../../../app-shared/services';
import { Subscription, from } from 'rxjs';
import { ConstanteWs } from '../../../../../../app-shared/constantes/constante-ws';
import { ResponseObject } from '../../../../../../app-shared/models/ResponseObject';
import { Pagination, RequestObject, SelectMetadata, Sort } from '../../../../../../app-shared/models';
import { PARAM_NOMENCLATURE_URI } from '../../parametrage-nomenclature.uri';
import { AppSharedModule } from '../../../../../../app-shared/app-shared-module';
import { SelectNomenclatureMetadata } from '../../parametrage-nomenclature.metadata';
import { FilterActions } from "../../../../../../app-shared/widgets";

@Component({
  selector: 'mc-filter-liste-nomenclature',
  standalone: true,
  imports: [
    ReactiveFormsModule, // 🔥 OBLIGATOIRE
    AppSharedModule,
    FilterActions
],
  templateUrl: './filter-liste-nomenclature.html',
  styleUrl: './filter-liste-nomenclature.css',


})
export class FilterListeNomenclature implements OnInit, OnDestroy {

  @Output() selectNomenclature = new EventEmitter<string>();

  form!: UntypedFormGroup;
  subscriptions: Subscription[] = [];

  protected readonly isEmptyValue = isEmptyValue;

  params: any = {};

  constructor(
    private fb: UntypedFormBuilder,
    private sharedService: SharedService,
    private toast: ToastService,
  ) {}
  ngOnInit() {
    this.form = this.fb.group({
      nomTable: [null],
    });

    this.initParams();
    this.loadNomenclatures();
  }

  initParams() {
    this.params['paramNomenclature'] = {
      metadata: <SelectMetadata>SelectNomenclatureMetadata,
      data: [],
    };
  }
  loadNomenclatures() {
 const request: RequestObject = {
      uri: PARAM_NOMENCLATURE_URI.LIST,
      method: ConstanteWs._CODE_POST,
      params: {
        body: initSearchObject({
          pagination: new Pagination(0, 1000),
          sort: new Sort('nomTable', 'asc'),
          dataSearch: [],
        }),
      },
    };

    this.subscriptions.push(
      this.sharedService.commonWs(request).subscribe({
        next: (res: ResponseObject) => {
          if (res.code === ConstanteWs._CODE_WS_SUCCESS) {
            this.params.paramNomenclature.data = res.payload.data || [];
          } else {
            this.toast.error();
          }
        },
        error: () => this.toast.error(),
      }),
    );
  }

  getFormControl(key: string): UntypedFormControl {
    return this.form.get(key) as UntypedFormControl;
  }
    onSearch() {
    const val = this.form.get('nomTable')?.value;
    if (!isEmptyValue(val)) {
      this.selectNomenclature.emit(val);
    }
  }
 onReset() {
    this.form.reset();
    this.selectNomenclature.emit('');
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}

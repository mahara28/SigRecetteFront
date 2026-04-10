import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { hasrequiredField, initSearchObject, isEmptyValue, onAction } from '../../../../../app-shared/tools';
import { FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Pagination, RequestObject, SearchObject, Sort } from '../../../../../app-shared/models';
import { Subscription } from 'rxjs';
import { ConfirmDialogService, ToastService } from '../../../../../app-shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../../app-shared/services/sharedWs/shared.service';
import { NomenclatureAddMetadata, NomenclatureEditMetadata } from '../parametrage-nomenclature.metadata';
import { ConstanteWs } from '../../../../../app-shared/constantes/constante-ws';
import { PARAM_NOMENCLATURE_URI } from '../parametrage-nomenclature.uri';
import { ResponseObject } from '../../../../../app-shared/models/ResponseObject';

@Component({
  selector: 'app-nomenclature-add-edit',
  standalone: false,
  templateUrl: './nomenclature-add-edit.component.html',
  styleUrls: ['./nomenclature-add-edit.component.css']
})
export class NomenclatureAddEditComponent implements OnInit {
  protected readonly isEmptyValue = isEmptyValue;
  protected readonly onAction = onAction;
  protected readonly required = hasrequiredField;

  subscriptions: Subscription[] = [];

  editMode!: boolean;
  id!: string;
  title!: string;
  params: any = {};
  subscriptionsList: Subscription[] = [];
  searchObject!: SearchObject;
  form!: UntypedFormGroup;
  isLoading: boolean = false;
  selectedNomTable!: string;

  extratData: any = null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private confirmDialogService: ConfirmDialogService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initParams();
    this.loadExtratColu()
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptionsList) {
      if (!isEmptyValue(subscription)) {
        subscription.unsubscribe();
      }
    }
  }

  initParams() {
    this.params["pathParams"] = this.activatedRoute.snapshot.params;

    this.params["labels"] = NomenclatureAddMetadata.labels;

    this.selectedNomTable = this.activatedRoute.snapshot.paramMap.get('nomTable')!;
    this.id = this.params.pathParams.id;
    this.editMode = !isEmptyValue(this.id);
  }

  initForm(formData?: any) {
    let form: FormGroup;
    form = this.formBuilder.group({
      //id: this.formBuilder.control(formData?.id),
      code: this.formBuilder.control(formData?.code, Validators.required),
      codeLibe: this.formBuilder.control(formData?.code_libe, Validators.required),
      ordrAffi: this.formBuilder.control(formData?.ordr_affi),
      isActive: this.formBuilder.control(formData?.is_active || 0),
    });
    if (this.editMode) {
      form.addControl(
        "id",
        this.formBuilder.control(formData?.id || null)
      );
    }

    if (this.extratData) {
      // EXT 1
      if (this.extratData.coluExtFst) {
        form.addControl(
          this.extratData.coluExtFst,
          this.formBuilder.control(
            formData?.[this.extratData.coluExtFst] ?? null,
            this.getValidators(this.extratData.typeDonneeFst)
          )
        );
      }
      // EXT 2
      if (this.extratData.coluExtSec) {
        form.addControl(
          this.extratData.coluExtSec,
          this.formBuilder.control(
            formData?.[this.extratData.coluExtSec] ?? null,
            this.getValidators(this.extratData.typeDonneeSec)
          )
        );
      }
    }

    return form;
  }
  getValidators(type: string): ValidatorFn[] {
    switch (type) {
      case 'int2':
        return [
          Validators.pattern(/^-?\d+$/),
          Validators.min(-32768),
          Validators.max(32767),
        ];
      case 'int4':
      case 'integer':
        return [
          Validators.pattern(/^-?\d+$/),
          Validators.min(-2147483648),
          Validators.max(2147483647),
        ];
      case 'int8':
      case 'bigint':
        return [
          Validators.pattern(/^-?\d+$/),
        ];
      case 'numeric':
      case 'float4':
      case 'float8':
        return [
          Validators.pattern(/^-?\d+(\.\d+)?$/),
        ];
      case 'boolean':
        return [
          Validators.pattern(/^(true|false|1|0)$/i),
        ];
      case 'date':
        return [
          Validators.pattern(/^\d{4}-\d{2}-\d{2}$/),
        ];
      case 'timestamp':
      case 'timestamptz':
        return [
          Validators.pattern(/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?)?$/),
        ];
      default: // text, varchar
        return [
          Validators.maxLength(255),
        ];
    }
  }

  loadExtratColu() {
    const request: RequestObject = {
      uri: PARAM_NOMENCLATURE_URI.V_NOMENCLATURE_LIST_DATA,
      method: ConstanteWs._CODE_POST,
      params: {
        body: initSearchObject({
          pagination: new Pagination(0, 1000),
          sort: new Sort('ordrAffi', 'asc'),
          dataSearch: [
            {
              key: "nomTable",
              value: this.selectedNomTable,
              specificSearch: "=",
            },
          ],
        }),
      },
    };

    this.subscriptions.push(
      this.sharedService.commonWs(request).subscribe({
        next: (res: ResponseObject) => {
          if (res.code === ConstanteWs._CODE_WS_SUCCESS) {
            console.log(res.payload.data)
            this.extratData = res.payload.data?.[0];

            if (this.editMode) {
              this.initData().then((res: any) => {
                this.form = this.initForm(res);
                this.title = NomenclatureEditMetadata.title;
              })
            } else {
              this.title = NomenclatureAddMetadata.title;
              this.form = this.initForm();
              this.cdr.markForCheck();
            }

          } else {
            this.toast.error();
          }
        },
        error: () => this.toast.error(),
      }),
    );

  }

  hasExtColumns(): boolean {
    return !!(this.extratData?.coluExtFst || this.extratData?.coluExtSec);
  }

  initData() {
    const request: RequestObject = <RequestObject>{
      uri: PARAM_NOMENCLATURE_URI.DETAILS,
      params: {
        path: [this.id],
        query: {
          nomTable: this.selectedNomTable
        }
      },
      method: ConstanteWs._CODE_GET,
    };

    return new Promise((resolve) => {
      this.subscriptionsList.push(
        this.sharedService.commonWs(request).subscribe({
          next: (response: ResponseObject) => {
            if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
              //this.userInfo = response.payload;
              resolve(response.payload);
            } else {
              console.error(
                `Error in UsersAddEditComponent/initUserDetails, error code :: ${response.code}`
              );
              this.toast.error();
            }
            this.cdr.markForCheck();
          },
          error: (error) => {
            console.error(
              `Error in UsersAddEditComponent/initUserDetails, error :: ${JSON.stringify(
                error
              )}`
            );
            this.toast.error();
          },
        })
      );
    });
  }

  onSave() {
    console.log(this.form.value)
    this.form.markAllAsTouched();
    if (this.form.valid) {
      let formValue = this.form.value;
      this.isLoading = true;

      this.subscriptionsList.push(
        this.confirmDialogService.confirm().subscribe((flag) => {
          if (flag) {
            const requestBody = {
              nomTable: this.selectedNomTable,
              data: formValue,
            };

            const request: RequestObject = <RequestObject>{
              uri: PARAM_NOMENCLATURE_URI.ADD_NOMEN,
              params: {
                body: requestBody
              },

              method: ConstanteWs._CODE_POST,
            };

            this.subscriptionsList.push(
              this.sharedService.commonWs(request).subscribe({
                next: (response: ResponseObject) => {
                  if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
                    if (this.editMode) {
                      this.toast.success(
                        "administration.users.messages.success.success_update"
                      );
                    } else {
                      this.toast.success(
                        "administration.users.messages.success.success_save"
                      );

                    }
                    this.router.navigate(["/app/paranomenc/gestNomenclature"]);

                    this.isLoading = false;
                  }
                  if (response.code == ConstanteWs._CODE_WS_ERROR_UNIQUE_CODE) {
                    this.toast.error(
                      "administration.users.messages.error.uniqueCode"
                    );
                  }
                  if (response.code == ConstanteWs._CODE_WS_LOGIN_EXISTS) {
                    this.toast.error(
                      "administration.users.messages.error.uniqueLogin"
                    );
                  }
                },
                error: (error) => {
                  console.error(
                    `Error in UsersAddEditComponent/onSave, error :: ${error}`
                  );
                  this.toast.error();
                  this.isLoading = false;
                },
              })
            );
          }
          else {
            this.isLoading = false;
          }
        })
      )
    }
  }

  getFormControl(key: any) {
    return this.form.get(key) as UntypedFormControl;
  }

  getLabel(control: string) {
    return this.params.labels[control];
  }

  onToggleChange(event: any) {
    const value = event.checked ? 1 : 0;
    this.form.get('isActive')?.setValue(value);
  }



  backToList() {
    this.router.navigate(["/app/paranomenc/gestNomenclature"]);
  }
}

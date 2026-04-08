import { Component, OnInit } from '@angular/core';
import { hasrequiredField, isEmptyValue, onAction } from '../../../../../app-shared/tools';
import { FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { RequestObject, SearchObject } from '../../../../../app-shared/models';
import { Subscription } from 'rxjs';
import { ConfirmDialogService, ToastService } from '../../../../../app-shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../../app-shared/services/sharedWs/shared.service';
import { NomenclatureAddMetadata } from '../parametrage-nomenclature.metadata';
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

  editMode!: boolean;
  id!: string;
  title!: string;
  params: any = {};
  subscriptionsList: Subscription[] = [];
  searchObject!: SearchObject;
  form!: UntypedFormGroup;
  isLoading: boolean = false;
  selectedNomTable!: string;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private confirmDialogService: ConfirmDialogService,
  ) { }

  ngOnInit() {
    this.initParams();
    if (this.editMode) {
      //this.form = this.initForm(res);
      //this.title = NomenclatureEditMetadata.title;
    } else {
      this.title = NomenclatureAddMetadata.title;
      this.form = this.initForm();
    }
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
    console.log(this.selectedNomTable);
    this.id = this.params.pathParams.id;
    this.editMode = !isEmptyValue(this.id);
  }

  initForm(formData?: any) {
    let form: FormGroup;
    form = this.formBuilder.group({
      id: this.formBuilder.control(formData?.id),
      code: this.formBuilder.control(formData?.code, Validators.required),
      codeLibe: this.formBuilder.control(formData?.codeLibe, Validators.required),
      ordrAffi: this.formBuilder.control(formData?.ordrAffi),
      isActive: this.formBuilder.control(formData?.isActive || 0),
    });
    return form;
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
              nomTable: "gouvernorat",
              data: formValue,
            };

            const request: RequestObject = <RequestObject>{
              uri: this.editMode
                ? PARAM_NOMENCLATURE_URI.ADD_NOMEN
                : PARAM_NOMENCLATURE_URI.ADD_NOMEN,
              params: {
                body: requestBody
              },

              method: this.editMode
                ? ConstanteWs._CODE_PUT
                : ConstanteWs._CODE_POST,
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

import { Component, OnInit } from '@angular/core';
import { hasrequiredField, isEmptyValue, onAction } from '../../../../../app-shared/tools';
import { FormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SearchObject } from '../../../../../app-shared/models';
import { Subscription } from 'rxjs';
import { ConfirmDialogService, ToastService } from '../../../../../app-shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../../app-shared/services/sharedWs/shared.service';
import { NomenclatureAddMetadata } from '../parametrage-nomenclature.metadata';

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

    this.id = this.params.pathParams.id;
    this.editMode = !isEmptyValue(this.id);
  }

  initForm(formData?: any) {
    let form: FormGroup;
    form = this.formBuilder.group({
      code: this.formBuilder.control(formData?.code, Validators.required),
      codeLibe: this.formBuilder.control(formData?.codeLibe, Validators.required),
      ordrAffi: this.formBuilder.control(formData?.ordrAffi),
      isActive: this.formBuilder.control(formData?.isActive),
    });
    return form;
  }

  onSave() { }

  getFormControl(key: any) {
    return this.form.get(key) as UntypedFormControl;
  }

  getLabel(control: string) {
    return this.params.labels[control];
  }

  backToList() {
    this.router.navigate(["/app/paranomenc/gestNomenclature"]);
  }
}

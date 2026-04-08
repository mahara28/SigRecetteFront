import { Component, OnInit } from '@angular/core';
import { hasrequiredField, isEmptyValue, onAction } from '../../../../../app-shared/tools';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
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
    //this.initMetadata();
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
    this.params["labels"] = NomenclatureAddMetadata.labels
  }

}

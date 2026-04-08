import { Component, EventEmitter, Output } from "@angular/core";
import {
  FormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from "@angular/forms";
import {
  SelectUserProfessionFilterMetadata,
  SelectUserProfilMetadata,
  SelectUserStateMetadata,
  UserListMetatdata,
} from "../../user-management.metadata";
import { Subscription } from "rxjs";
import {
  PROFESSION_DATA_URI,
  PROFIL_DATA_URI,
} from "../../user-management.uri";
import { initSearchObject, isEmptyValue } from "../../../../../../../app-shared/tools";
import { ToastService } from "../../../../../../../app-shared/services";
import { SharedService } from "../../../../../../../app-shared/services/sharedWs/shared.service";
import { CriteriaSearch, Pagination, RequestObject, SelectMetadata, Sort } from "../../../../../../../app-shared/models";
import { ConstanteWs } from "../../../../../../../app-shared/constantes/constante-ws";
import { ResponseObject } from "../../../../../../../app-shared/models/ResponseObject";

@Component({
  selector: "app-filter-user-list",
  standalone: false,
  templateUrl: "./filter-user-list.component.html",
  styleUrls: ["./filter-user-list.component.css"],
})
export class FilterUserListComponent {
  @Output() searchoptions = new EventEmitter<Partial<any>>();
  options = {};
  params: any = {};
  form!: UntypedFormGroup;

  protected readonly isEmptyValue = isEmptyValue;
  subscriptionsList: Subscription[] = [];

  constructor(
    private toast: ToastService,
    private formBuilder: UntypedFormBuilder,
    private sharedService: SharedService
  ) {
    // this.initParams();
  }

  ngOnInit() {
    this.form = this.initForm();
    this.initMetadata();
    this.initParams();
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptionsList) {
      if (!isEmptyValue(subscription)) {
        subscription.unsubscribe();
      }
    }
  }

  initParams() {
    this.params["labels"] = UserListMetatdata.filterUserListMetadata.labels;
    this.initProfessionList();
    this.initProfilList();
  }

  initForm(formData?: any) {
    let form: FormGroup;
    form = this.formBuilder.group({
      username: this.formBuilder.control(null),
      desProfesFr: this.formBuilder.control(null),
      desProfilFr: this.formBuilder.control(null),
      state: this.formBuilder.control(null),
    });

    return form;
  }

  initMetadata() {
    this.params["desProfesFr"] = {
      metadata: <SelectMetadata>SelectUserProfessionFilterMetadata,
      data: [],
      searchObject: initSearchObject({
        pagination: new Pagination(0, 1000),
        sort: new Sort("desFr", "asc"),
      }),
    };

    this.params["desProfilFr"] = {
      metadata: <SelectMetadata>SelectUserProfilMetadata,
      data: [],
      searchObject: initSearchObject({
        pagination: new Pagination(0, 1000),
      }),
    };

    this.params["state"] = {
      metadata: <SelectMetadata>SelectUserStateMetadata,
      data: [
        {
          id: 1,
          desEn: "نشط",

          desFr: "Actif",
        },
        {
          id: 2,
          desEn: "غير نشط",
          desFr: "Inactif",
        },
        // {
        //   id: 2,
        //   desEn: "Suspended",
        //   desFr: "Suspendu",
        // }
      ],
    };
  }

  initProfessionList() {
    const request: RequestObject = <RequestObject>{
      uri: PROFESSION_DATA_URI.PROFESSION_LIST,
      params: {
        body: this.params.desProfesFr.searchObject,
      },

      method: ConstanteWs._CODE_POST,
    };

    this.subscriptionsList.push(
      this.sharedService.commonWs(request).subscribe({
        next: (response: ResponseObject) => {
          if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
            this.params.desProfesFr.data = response.payload.data;
          } else {
            console.error(
              `Error in FilterUserListComponent/initProfessionList, error code :: ${response.code}`
            );
            this.toast.error();
          }
        },
        error: (error) => {
          console.error(
            `Error in FilterUserListComponent/initProfessionList, error :: ${JSON.stringify(
              error
            )}`
          );
          this.toast.error();
        },
      })
    );
  }

  initProfilList() {
    const request: RequestObject = <RequestObject>{
      uri: PROFIL_DATA_URI.PROFIL_LIST,
      params: {
        body: initSearchObject({
          pagination: new Pagination(0, 1000),
          sort: new Sort("desFr", "asc"),
        }),
      },

      method: ConstanteWs._CODE_POST,
    };

    return new Promise((resolve) => {
      this.subscriptionsList.push(
        this.sharedService.commonWs(request).subscribe({
          next: (response: ResponseObject) => {
            if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
              this.params.desProfilFr.data = response.payload.data;
              resolve(response.payload.data);
            } else {
              console.error(
                `Error in UsersAddEditComponent/initProfessionList, error code :: ${response.code}`
              );
              this.toast.error();
            }
          },
          error: (error) => {
            console.error(
              `Error in UsersAddEditComponent/initProfessionList, error :: ${JSON.stringify(
                error
              )}`
            );
            this.toast.error();
          },
        })
      );
    });
  }

  onSearch() {
    const searchvalue = [];
    if (this.form.get("desProfesFr")!.value) {
      searchvalue.push(
        new CriteriaSearch(
          "desProfesFr",
          this.form.get("desProfesFr")!.value || undefined,
          "="
        )
      );
    }
    if (this.form.get("desProfilFr")!.value) {
      searchvalue.push(
        new CriteriaSearch(
          "desProfilFr",
          this.form.get("desProfilFr")!.value || undefined,
          "upper_like"
        )
      );
    }
    if (this.form.get("state")!.value) {
      searchvalue.push(
        new CriteriaSearch(
          "stateFr",
          this.form.get("state")!.value || undefined,
          "="
        )
      );
    }

    this.options = searchvalue;
    this.searchoptions.emit(this.options);
    this.options = {};
  }

  getFormControl(key: any) {
    return this.form.get(key) as UntypedFormControl;
  }

  getLabel(control: string) {
    return this.params.labels[control];
  }

  onReset() {
    // if (!Object.values(this.form.value).every((value) => value === null)) {
    this.form.reset();
    this.searchoptions.emit(null!);
    // }
  }
}

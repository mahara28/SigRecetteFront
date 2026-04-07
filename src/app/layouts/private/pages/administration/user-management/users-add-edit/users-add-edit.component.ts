import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  FormGroup,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Observable, Subscription } from "rxjs";
import {
  SelectUserProfessionMetadata,
  UserAddMetadata,
  UserEditMetadata,
  UserProfilMetadata,
} from "../user-management.metadata";
import {
  CATEGORIE_DATA_URI,
  PROFESSION_DATA_URI,
  PROFIL_DATA_URI,
  USERS_DATA_URI,
  USER_PROFIL_DATA_URI,
} from "../user-management.uri";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

import moment from "moment";
import { hasrequiredField, initSearchObject, isEmptyValue, onAction } from "../../../../../../app-shared/tools";
import { CriteriaSearch, Pagination, RequestObject, SearchObject, SelectMetadata, Sort } from "../../../../../../app-shared/models";
import { SharedService } from "../../../../../../app-shared/services/sharedWs/shared.service";
import { ConfirmDialogService, ToastService } from "../../../../../../app-shared/services";
import { CustomValidators } from "../../../../../../app-shared/tools/form-validators";
import { ConstanteWs } from "../../../../../../app-shared/constantes/constante-ws";
import { ResponseObject } from "../../../../../../app-shared/models/ResponseObject";

enum AccountStatus {
  CODE_ACTIVE = 1,
  CODE_INACTIVE = 0,
  CODE_SUSPENDED = 2,
}

type ProfilList = {
  id: number;
  code: string;
  desFr: string;
  isActive: string;
  dateCreate: Date;
  dateUpdate: Date;
};

@Component({
  selector: "app-users-add-edit",
  standalone: false,
  templateUrl: "./users-add-edit.component.html",
  styleUrls: ["./users-add-edit.component.css"],
})
export class UsersAddEditComponent {
  protected readonly isEmptyValue = isEmptyValue;
  protected readonly onAction = onAction;
  protected readonly required = hasrequiredField;
  protected readonly AccountStatus = AccountStatus;
  editMode!: boolean;
  id!: string;
  title!: string;
  params: any = {};
  subscriptionsList: Subscription[] = [];
  searchObject!: SearchObject;
  form!: UntypedFormGroup;
  sexListItems: any;
  surveyListItems!: any[];
  selectedSurvey: any;
  selectedStatus!: AccountStatus;
  selectedExpire!: boolean;
  isLoading: boolean = false;
  userInfo: any;
  profilList: ProfilList[] = [];
  availableOptions!: ProfilList[];
  selectedProfils: ProfilList[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredProfiles!: Observable<ProfilList[]>;
  maxDate = new Date();
  selectProfessionList!: SelectMetadata;
  professionListItems!: any[];
  categorieListItems!: any[];

  @ViewChild("profileInput") profileInput!: ElementRef<HTMLInputElement>;
  editPwdEnabled: boolean = false;
  selectedProfes: any;
  selectedCat: any
  constructor(
    private formBuilder: UntypedFormBuilder,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private confirmDialogService: ConfirmDialogService
  ) { }

  async ngOnInit() {
    this.initParams();
    this.initMetadata();
    await this.initListNm();
    if (this.editMode) {
      this.initData().then((res: any) => {
        this.form = this.initForm(res);
        this.title = UserEditMetadata.title;
        this.selectedStatus = res.FSusp
          ? AccountStatus.CODE_SUSPENDED
          : res.isActive;
        this.selectedExpire = res.FExpire;
        this.getFormControl("profils").setValue(this.selectedProfils);
        const profession = this.professionListItems.find(
          (item) => item.id === res.idProfes
        );
        this.selectedProfes = profession;
      });
    } else {
      this.title = UserAddMetadata.title;
      this.selectedStatus = AccountStatus.CODE_ACTIVE;
      this.form = this.initForm();
      this.form.addControl(
        "confirmPwd",
        this.formBuilder.control("", Validators.required)
      );
      this.selectedExpire = false;
      this.getFormControl("fexpire").setValue(false);
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
    this.params["labels"] = UserAddMetadata.labels;
    this.params["userProfils"] = {
      metadata: UserProfilMetadata.userProfilListTableMetadata,
      payload: [],
      payloadall: [],
      searchObject: initSearchObject({
        pagination: {
          offSet: 0,
          limit: 1000,
        },
        dataSearch: [
          {
            key: "isActive",
            value: 1,
            specificSearch: "=",
          },
        ],
        sort: new Sort("dateCreate", "asc"),
      }),
      searchObjectAll: new SearchObject(),
    };
    this.id = this.params.pathParams.id;
    this.editMode = !isEmptyValue(this.id);
  }

  initMetadata() {
    this.selectProfessionList = <SelectMetadata>SelectUserProfessionMetadata;
  }

  async initListNm() {
    const profilListData = await this.initFormProfilList();
    this.params.userProfils.payload = profilListData;
    this.params.userProfils.payloadall = profilListData;

    if (this.editMode) {
      const profiles: any[] = await this.initUserProfils();
      this.selectedProfils = [
        ...new Set(profiles.map((item) => item.idProfil)),
      ];
      this.profilList.forEach((item: any) => {
        item.checked = this.selectedProfils.includes(item.id);
      });
    }

    const response: any = await this.initProfessionList();
    this.professionListItems = response.data;
  }

  initForm(formData?: any) {
    let form: FormGroup;
    form = this.formBuilder.group({
      username: this.formBuilder.control(
        formData?.username,
        Validators.required
      ),
      pwd: this.formBuilder.control(formData?.pwd, Validators.required),
      email: this.formBuilder.control(formData?.email, [
        CustomValidators.emailValidator(),
        Validators.required,
      ]),
      dateBirth: this.formBuilder.control(
        formData?.dateBirth,
        Validators.required
      ),
      profils: this.formBuilder.control(formData?.profils),
      code: this.formBuilder.control(formData?.code, Validators.required),
      fexpire: this.formBuilder.control(formData?.FExpire ?? 0),
      fsusp: this.formBuilder.control(formData?.FSusp ?? 0),
      isActive: this.formBuilder.control(formData?.isActive ?? 1),
      dateSuspStart: this.formBuilder.control(formData?.dateSuspStart),
      dateSuspEnd: this.formBuilder.control(formData?.dateSuspEnd),
      idProfes: this.formBuilder.control(
        formData?.idProfes,
        Validators.required
      ),
    });

    return form;
  }

  initData() {
    const request: RequestObject = <RequestObject>{
      uri: USERS_DATA_URI.USER_DETAIL,
      params: {
        path: [this.id],
      },

      method: ConstanteWs._CODE_GET,
    };

    return new Promise((resolve) => {
      this.subscriptionsList.push(
        this.sharedService.commonWs(request).subscribe({
          next: (response: ResponseObject) => {
            if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
              this.userInfo = response.payload;
              resolve(response.payload);
            } else {
              console.error(
                `Error in UsersAddEditComponent/initUserDetails, error code :: ${response.code}`
              );
              this.toast.error();
            }
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

  initProfessionList() {
    const so = new SearchObject();
    so.sort = new Sort("desFr", "asc");
    const request: RequestObject = <RequestObject>{
      uri: PROFESSION_DATA_URI.PROFESSION_LIST,
      params: {
        body: so,
      },

      method: ConstanteWs._CODE_POST,
    };

    return new Promise((resolve) => {
      this.subscriptionsList.push(
        this.sharedService.commonWs(request).subscribe({
          next: (response: ResponseObject) => {
            if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
              resolve(response.payload);
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
    });
  }

  initFormProfilList() {
    const request: RequestObject = <RequestObject>{
      uri: PROFIL_DATA_URI.PROFIL_LIST,
      params: {
        body: this.params.userProfils.searchObject,
      },

      method: ConstanteWs._CODE_POST,
    };

    return new Promise((resolve) => {
      this.subscriptionsList.push(
        this.sharedService.commonWs(request).subscribe({
          next: (response: ResponseObject) => {
            if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
              this.profilList = response.payload.data;
              resolve(response.payload);
            } else {
              console.error(
                `Error in UsersAddEditComponent/initFormProfilList, error code :: ${response.code}`
              );
              this.toast.error();
            }
          },
          error: (error) => {
            console.error(
              `Error in UsersAddEditComponent/initFormProfilList, error :: ${JSON.stringify(
                error
              )}`
            );
            this.toast.error();
          },
        })
      );
    });
  }

  initUserProfils() {
    const request: RequestObject = <RequestObject>{
      uri: USER_PROFIL_DATA_URI.USE_PROFIL_LIST,
      params: {
        body: initSearchObject(<SearchObject>{
          dataSearch: [
            new CriteriaSearch("idUser", this.params.pathParams.id, "="),
          ],
          pagination: new Pagination(0, 1000),
        }),
      },

      method: ConstanteWs._CODE_POST,
    };

    return new Promise<any[]>((resolve) => {
      this.subscriptionsList.push(
        this.sharedService.commonWs(request).subscribe({
          next: (response: ResponseObject) => {
            if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
              resolve(response.payload.data);
            } else {
              console.error(
                `Error in UsersAddEditComponent/initUserProfils, error code :: ${response.code}`
              );
              this.toast.error();
            }
          },
          error: (error) => {
            console.error(
              `Error in UsersAddEditComponent/initUserProfils, error :: ${JSON.stringify(
                error
              )}`
            );
            this.toast.error();
          },
        })
      );
    });
  }

  onPaginate(event: any) {
    this.params.userProfils.searchObject.pagination = event;
    this.initFormProfilList().then(() => { });
  }

  onSearch($event: any) {
    this.params.userProfils.searchObject.pagination.offSet = 0;
    this.params.userProfils.searchObject.pagination.limit = 10;
    this.params.userProfils.searchObject.dataSearch = $event;
    this.initFormProfilList().then((res: any) => { });
  }

  onSort(event: any) {
    let sort = {
      nameCol: event.active,
      direction: event.direction,
    };
    this.params.userProfils.searchObject.sort = sort;
    this.initFormProfilList().then((res: any) => {
      this.params.userProfils.payload = res;
    });

    this.setCheckedProfils();
  }

  onCheckToggleTableUserProfil(row: any) {
    if (row.item.checked) {
      this.selectedProfils = [...this.selectedProfils, row.item.row.id];
    } else {
      this.selectedProfils = this.selectedProfils.filter(
        (id) => id !== row.item.row.id
      );
    }
    this.getFormControl("profils").setValue(this.selectedProfils);
  }

  enablePwdEdit() {
    this.form.setControl(
      "pwd",
      this.formBuilder.control("", Validators.required)
    );
    this.form.addControl(
      "confirmPwd",
      this.formBuilder.control("", Validators.required)
    );
    this.editPwdEnabled = true;
  }

  onSave() {
    console.log(this.form.value)
    this.form.markAllAsTouched();
    if (this.form.valid) {
      let formValue = this.form.value;

      this.isLoading = true;
      // Check for password missmatch
      if (this.form.contains("confirmPwd")) {
        if (this.form.get("pwd")!.value != this.form.get("confirmPwd")!.value) {
          this.toast.error(
            "administration.users.userAdd.form.errors.pwdMissmatchError"
          );
          this.form.get("pwd")!.setValue(null);
          this.form.get("confirmPwd")!.setValue(null);
          this.isLoading = false;
          return;
        }
      }
      if (isEmptyValue(this.selectedProfils)) {
        this.toast.error("administration.users.messages.error.emptyProfils");
        return;
      }
      // Initiat the dialog
      this.subscriptionsList.push(
        this.confirmDialogService.confirm().subscribe((flag) => {
          if (flag) {
            this.hydrateForm(formValue);

            const request: RequestObject = <RequestObject>{
              uri: this.editMode
                ? USERS_DATA_URI.USER_EDIT
                : USERS_DATA_URI.USER_ADD,
              params: {
                body: formValue,
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
                    this.router.navigate(["/app/adm/users/userManag"]);
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
          } else {
            this.isLoading = false;
          }
        })
      );
    }
  }

  onStatusChange(event: any) {
    if (!isEmptyValue(event.value)) {
      this.selectedStatus = event.value;
      if (event.value === AccountStatus.CODE_SUSPENDED) {
        this.getFormControl("fsusp").setValue(1);
        this.getFormControl("isActive").setValue(AccountStatus.CODE_INACTIVE);
      } else {
        this.form.get("dateSuspStart")!.setValue(null);
        this.form.get("dateSuspEnd")!.setValue(null);
        this.getFormControl("fsusp").setValue(0);
        this.getFormControl("isActive").setValue(event.value);
      }
    }
  }

  onKeepPassword(event: any) {
    this.getFormControl("fexpire").setValue(Number(event.checked));
    this.selectedExpire = event.checked;
  }

  backToList() {
    this.router.navigate(["/app/adm/users/userManag"]);
  }

  getFormControl(key: any) {
    return this.form.get(key) as UntypedFormControl;
  }

  getLabel(control: string) {
    return this.params.labels[control];
  }

  hydrateForm(formValue: any) {
    // Hidrate and save the user after accepting dialog
    if (!this.editMode) {
      formValue["dateBirth"] = formValue.dateBirth.toISOString();
      if (
        !isEmptyValue(formValue.dateBirth) &&
        !isEmptyValue(formValue.dateSuspEnd)
      ) {
        formValue["dateSuspStart"] = formValue.dateSuspStart.toISOString();
        formValue["dateSuspEnd"] = formValue.dateSuspEnd.toISOString();
      }
    } else {
      if (
        !isEmptyValue(formValue.dateBirth) &&
        !isEmptyValue(formValue.dateSuspEnd)
      ) {
        formValue["dateSuspStart"] = new Date(
          formValue.dateSuspStart
        ).toISOString();
        formValue["dateSuspEnd"] = new Date(
          formValue.dateSuspEnd
        ).toISOString();
      }
      formValue["dateBirth"] = new Date(formValue.dateBirth).toISOString();
      formValue["id"] = Number(this.id);
    }
    // Password expire when fexpire = 1
    formValue["fexpire"] = Number(!formValue.fexpire);
    formValue["dateExpire"] = formValue.fexpire
      ? moment(new Date()).add(90, "days").toISOString()
      : null;
  }

  async setCheckedProfils() {
    const profiles: any[] = await this.initUserProfils();
    this.selectedProfils = [...new Set(profiles.map((item) => item.idProfil))];
    this.profilList.forEach((item: any) => {
      item.checked = this.selectedProfils.includes(item.id);
    });
  }
}

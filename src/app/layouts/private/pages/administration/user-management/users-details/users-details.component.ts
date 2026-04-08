import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { UserDetailsMetadata } from "../user-management.metadata";
import { USERS_DATA_URI } from "../user-management.uri";
import { SharedService } from "../../../../../../app-shared/services/sharedWs/shared.service";
import { AppTranslateService, ToastService } from "../../../../../../app-shared/services";
import { RequestObject } from "../../../../../../app-shared/models";
import { ConstanteWs } from "../../../../../../app-shared/constantes/constante-ws";
import { ResponseObject } from "../../../../../../app-shared/models/ResponseObject";

@Component({
  selector: "pfs-users-details",
  standalone: false,
  templateUrl: "./users-details.component.html",
  styleUrls: ["./users-details.component.css"],
})
export class UsersDetailsComponent {
  params: any = {};
  subscriptionsList: Subscription[] = [];

  constructor(
    private sharedService: SharedService,
    private router: Router,
    private toast: ToastService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initParams();
    this.initMetadata();
    this.initUserDetails();
  }

  initParams() {
    this.params["pathParams"] = this.activatedRoute.snapshot.params;
  }

  initMetadata() {
    this.params["UserDetailData"] = {
      metadata: UserDetailsMetadata.UserDetailInfoMetadata,
      data: {},
    };
  }

  initUserDetails() {
    const request: RequestObject = <RequestObject>{
      uri: USERS_DATA_URI.V_USER_DETAIL,
      params: {
        path: [this.params.pathParams.id],
      },

      method: ConstanteWs._CODE_GET,
    };

    this.subscriptionsList.push(
      this.sharedService.commonWs(request).subscribe({
        next: (response: ResponseObject) => {
          if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
            if (response.payload["isActive"] == 1) {
              response.payload["isActive"] =
                AppTranslateService.getStoredLanguage() == "fr" ? "Active" : "نشط";
            } else {
              response.payload["admProfil"]["isActive"] =
                AppTranslateService.getStoredLanguage() == "fr" ? "Désactive" : "غير نشط";
            }
            this.params.UserDetailData.data = response.payload;
            this.cdr.detectChanges();
            console
          } else {
            console.error(
              `Error in users-detail.component/initUserDetails, error code :: ${response.code}`
            );
            this.toast.error();
          }
        },
        error: (error) => {
          console.error(
            `Error in users-detail.component/initUserDetails, error :: ${JSON.stringify(
              error
            )}`
          );
          this.toast.error();
        },
      })
    );
  }

  backToList() {
    this.router.navigate(["/app/adm/users/userManag"]);
  }
}

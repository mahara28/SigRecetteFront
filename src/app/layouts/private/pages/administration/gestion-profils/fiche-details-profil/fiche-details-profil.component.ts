import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { FICHE_LISTE_PROFILS } from "../gestion-profils-uri";
import {
  FicheDetailsProfil,
  FicheListeProfilsMetadata,
} from "../gestion-profils.metadata";
import { SharedService } from "../../../../../../app-shared/services/sharedWs/shared.service";
import { AppTranslateService, ToastService } from "../../../../../../app-shared/services";
import { RequestObject } from "../../../../../../app-shared/models";
import { ConstanteWs } from "../../../../../../app-shared/constantes/constante-ws";
import { ResponseObject } from "../../../../../../app-shared/models/ResponseObject";

@Component({
  selector: "pfs-fiche-details-profil",
  standalone: false,
  templateUrl: "./fiche-details-profil.component.html",
  styleUrls: ["./fiche-details-profil.component.css"],
})
export class FicheDetailsProfilComponent {
  params: any = {};
  subscriptionsList: Subscription[] = [];
  listMenus: any;
  constructor(
    private sharedService: SharedService,
    private toast: ToastService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.initParams();
    this.initDetailsProfil();
    this.initMetadata();
  }

  initParams() {
    this.params["pathParams"] = this.activatedRoute.snapshot.params;
  }
  initMetadata() {
    this.params["detailsProfil"] = {
      metadata: FicheDetailsProfil.detailsProfilMetadata,
      data: {},
    };
  }

  backToList() {
    this.router.navigate(["/app/adm/profil/userProfil"]);
  }

  initDetailsProfil() {
    const request: RequestObject = <RequestObject>{
      uri: FICHE_LISTE_PROFILS.MENU,
      params: {
        query: {
          idProfil: [this.params.pathParams.id],
        },
      },

      method: ConstanteWs._CODE_GET,
    };

    this.subscriptionsList.push(
      this.sharedService.commonWs(request).subscribe({
        next: (response: ResponseObject) => {
          if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
            if (response.payload["admProfil"]["isActive"] == 1) {
              response.payload["admProfil"]["isActive"] =
                AppTranslateService.getStoredLanguage() == "fr" ? "Oui" : "Yes";
            } else {
              response.payload["admProfil"]["isActive"] =
                AppTranslateService.getStoredLanguage() == "fr" ? "Non" : "No";
            }

            this.params.detailsProfil.data = response.payload["admProfil"];
            this.listMenus = response.payload["menus"];
            this.cdr.detectChanges();
          } else {
            console.error(
              `Error in FicheDetailsProfilComponent/initDetailsProfil, error code :: ${response.code}`
            );
            this.toast.error();
          }
        },
        error: (error) => {
          console.error(
            `Error in FicheDetailsProfilComponent/initDetailsProfil, error :: ${JSON.stringify(
              error
            )}`
          );
          this.toast.error();
        },
      })
    );
  }
}

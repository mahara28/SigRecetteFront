  import { ChangeDetectorRef, Component } from "@angular/core";
  import { ActivatedRoute, Router } from "@angular/router";
  import { Subscription } from "rxjs";
  import { SharedService } from "../../../../../app-shared/services/sharedWs/shared.service";
  import { AppTranslateService, ToastService } from "../../../../../app-shared/services";
  import { NomenclatureDetailsMetadata } from "../parametrage-nomenclature.metadata";
  import { RequestObject } from "../../../../../app-shared/models";
  import { PARAM_NOMENCLATURE_URI } from "../parametrage-nomenclature.uri";
  import { ConstanteWs } from "../../../../../app-shared/constantes/constante-ws";
  import { ResponseObject } from "../../../../../app-shared/models/ResponseObject";
import { TranslateService } from "@ngx-translate/core";

  @Component({
    selector: 'app-nomenclature-details',
    standalone: false,
    templateUrl: './nomenclature-details.html',
    styleUrl: './nomenclature-details.css',
  })
  export class NomenclatureDetails {
    params: any = {};
    subscriptionsList: Subscription[] = [];
    selectedNomTable!: string;
    id!: string;

    constructor(
      private sharedService: SharedService,
      private router: Router,
      private toast: ToastService,
      private activatedRoute: ActivatedRoute,
      private cdr: ChangeDetectorRef,
      private translate: TranslateService,
    ) { }

    ngOnInit() {

      this.initParams();
      this.selectedNomTable = this.params.pathParams['nomTable'];
      this.id = this.params.pathParams['id'];
      this.initMetadata();
      this.initNomenclatureDetails();
    }

    initParams() {
      this.params["pathParams"] = this.activatedRoute.snapshot.params;

    }

    initMetadata() {
      this.params["NomenclatureDetailData"] = {
        metadata: NomenclatureDetailsMetadata.NomenclatureDetailMetadata,
        data: {},
      };
    }




    initNomenclatureDetails() {
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
              if (response.code === ConstanteWs._CODE_WS_SUCCESS) {
const data = response.payload?.data || response.payload;

    this.params.NomenclatureDetailData.data = {
      ...data,
      is_active:
        data?.is_active == 1
          ? this.translate.instant('general.active')
          : this.translate.instant('general.inactive'),
    };
              } else {
                this.toast.error();
              }
              this.cdr.detectChanges();
            },
            error: (error) => {
              console.error(
                `Error in NomenclatureDetaisComponent/NomenclatureDetaisDetails, error :: ${JSON.stringify(
                  error
                )}`
              );
              this.toast.error();
            },
          })
        );
      });
    }


    backToList() {
      this.router.navigate(["/app/paranomenc/gestNomenclature"]);
    }

  }

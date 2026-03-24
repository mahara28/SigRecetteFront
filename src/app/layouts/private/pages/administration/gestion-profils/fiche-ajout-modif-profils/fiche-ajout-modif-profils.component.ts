import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FicheAjoutEditProfil, maxLengthWithCustomMessage } from '../gestion-profils.metadata';
import { Validators } from '@angular/forms';
import { FICHE_LISTE_PROFILS } from '../gestion-profils-uri';
import { TreeViewMenuComponent } from './tree-view-menu/tree-view-menu.component';
import { isEmptyValue, onAction } from '../../../../../../app-shared/tools';
import { RequestObject, SearchObject } from '../../../../../../app-shared/models';
import { SharedService } from '../../../../../../app-shared/services/sharedWs/shared.service';
import { ConfirmDialogService, ToastService } from '../../../../../../app-shared/services';
import { ConstanteWs } from '../../../../../../app-shared/constantes/constante-ws';
import { ResponseObject } from '../../../../../../app-shared/models/ResponseObject';

@Component({
  selector: 'pfs-fiche-ajout-modif-profils',
  standalone: false,
  templateUrl: './fiche-ajout-modif-profils.component.html',
  styleUrls: ['./fiche-ajout-modif-profils.component.scss'],
})
export class FicheAjoutModifProfilsComponent implements OnInit {
  protected readonly isEmptyValue = isEmptyValue;
  protected readonly onAction = onAction;
  editMod!: boolean;
  id!: string;
  title!: string;
  soutitle: string = 'administration.gu.ficheAddUser.form.labels.nomUser';
  params: any = {};
  listMenus: any;
  subscriptionsList: Subscription[] = [];
  searchObject!: SearchObject;
  listProfilUser: any = [];
  listmenuscheked: any = [];

  form!: UntypedFormGroup;
  listAdmFonc = [];
  profildata: any;
  // @ViewChild('treeViewComponent') submenuComponent: SubmenuComponent;

  constructor(
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private confirmDialogService: ConfirmDialogService,
  ) {}

  ngOnInit() {
    this.initMetadata();
    this.initParams();
    this.form = this.initForm();
  }
  initForm(formData?: any) {
    return new FormGroup({
      code: new FormControl(formData?.code, Validators.required),
      desFr: new FormControl(formData?.desFr, Validators.required),
      isActive: new FormControl(formData?.isActive || '1', Validators.required),
    });
  }

  getFormControl(key: any) {
    return this.form.get(key) as UntypedFormControl;
  }

  getLabel(control: string) {
    return this.params.labels[control];
  }

  getMenu() {
    const request: RequestObject = <RequestObject>{
      uri: FICHE_LISTE_PROFILS.MENU,
      // uri: PRIVATELAYOUTURI.SIDEBAR.MENU,
      params: {
        query: {
          idProfil: this.id,
          // idProfil: []
        },
      },
      method: ConstanteWs._CODE_GET,
    };

    this.sharedService.commonWs(request).subscribe({
      next: (response: ResponseObject) => {
        if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
          this.listMenus = response.payload['menus'];
          this.profildata = response.payload['admProfil'];
          this.updateFormValues();
        } else {
          console.error(
            `Error in FicheAjoutModifProfilsComponent/getMenu, error code :: ${response.code}`,
          );
          this.toast.error();
        }
      },
      error: (error) => {
        console.error(`Error in FicheAjoutModifProfilsComponent/getMenu, error :: ${error}`);
        this.toast.error();
      },
    });
  }
  updateFormValues() {
    if (this.profildata) {
      this.form.patchValue({
        code: this.profildata.code,
        desFr: this.profildata.desFr,
        isActive: this.profildata.isActive.toString(),
      });
    }
  }

  initParams() {
    this.params['labels'] = FicheAjoutEditProfil.labels;
  }

  getdatacheked($event: any) {
    this.listmenuscheked = $event;
    console.log('listmenuscheked :', this.listmenuscheked);
  }

  initMetadata() {
    this.id = this.activatedRoute.snapshot.params['id'];
    this.editMod = this.activatedRoute.snapshot.data['type'] == 'e';

    if (this.editMod) {
      this.getMenu();
      this.title = 'profil.add_profil';
    } else {
      this.title = 'profil.add_profil';
    }
  }

  backToList() {
    this.router.navigate(['/app/adm/profil/userProfil']);
  }
  onSave() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.listmenuscheked.length == 0 && !this.editMod) {
        this.toast.error('administration.gp.ficheAddprofil.form.errors.selectionner_menu');
      } else if (this.listmenuscheked.length == 0 && this.editMod) {
        this.toast.error('administration.gp.ficheAddprofil.form.errors.selectionner_menu');
      } else {
        this.confirmDialogService.confirm().subscribe((flag) => {
          if (flag) {
            let reqData = this.form.value;
            reqData['listAdmFoncIds'] = this.listmenuscheked.map((menu: any) => ({
              idFonc: menu.idFonc,
              isList: menu.permissions?.list ? 1 : 0,
              isUpdate: menu.permissions?.update ? 1 : 0,
              isSupp: menu.permissions?.delete ? 1 : 0,
              isDetails: menu.permissions?.details ? 1 : 0,
              isExport: menu.permissions?.export ? 1 : 0,
              isImprime: menu.permissions?.import ? 1 : 0,
              isAdd: menu.permissions?.add ? 1 : 0,
            }));

            if (this.editMod) {
              reqData['id'] = this.id;
            }
            const request: RequestObject = <RequestObject>{
              uri: this.editMod ? FICHE_LISTE_PROFILS.EDIT : FICHE_LISTE_PROFILS.ADD,
              params: {
                body: reqData,
              },

              method: this.editMod ? ConstanteWs._CODE_PUT : ConstanteWs._CODE_POST,
            };

            this.sharedService.commonWs(request).subscribe({
              next: (response: ResponseObject) => {
                if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
                  if (this.editMod) {
                    this.toast.success('general.message.success_update');
                  } else {
                    this.toast.success('general.message.success_save');
                  }
                  this.router.navigate(['/app/adm/profil/userProfil']);
                } else {
                  if (response.code == ConstanteWs._CODE_WS_ERROR_SAVE_OR_UPDATE) {
                    this.toast.error('general.code_exist');
                    this.form.get('code')!.setErrors({ 'general.code_exist': true });
                  } else {
                    console.error(
                      `Error in AjoutModifGestionProfilsComponent/onSave, error code :: ${response.code}`,
                    );
                    this.toast.error();
                  }
                }
              },
              error: (error) => {
                console.error(
                  `Error in AjoutModifGestionProfilsComponent/onSave, error :: ${error}`,
                );
                this.toast.error();
              },
            });
          }
        });
      }
    }
  }
}

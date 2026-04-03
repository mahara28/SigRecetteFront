import { Component } from '@angular/core';
import { AuthentificationUri } from '../auth.uri';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthentificationService } from '../../../shared/services/authentification/authentification.service';
import { Router } from '@angular/router';
import { ConstanteWs } from '../../../../../app-shared/constantes/constante-ws';
import { RequestObject } from '../../../../../app-shared/models';
import { SessionStorageService } from '../../../../../app-shared/services/SessionStorage/session-storage.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-code-verify',
  standalone: true,  // 👈 Changer à true
  imports: [         // 👈 Ajouter les imports nécessaires
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './code-verify.html',
  styleUrl: './code-verify.css',
})
export class CodeVerify {

  form!: UntypedFormGroup;
  isLoginLoading = false;
  private mySubscription!: Subscription;
  constructor(
    private formBuilder: UntypedFormBuilder,
    //public appTranslateService: AppTranslateService,
    //private toast: ToastService,
    //private sessionStorage: SessionStorageService,
    //private authentificationService: AuthentificationService,
    //private router: Router,
    //private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    //this.authentificationService.logoutUser();
    this.form = this.initAuthentificationForm();
  }
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  initAuthentificationForm() {
    return this.formBuilder.group({
      email: this.formBuilder.control(sessionStorage.getItem('verificationEmail'), [
        Validators.required,
      ]),
      id: this.formBuilder.control(sessionStorage.getItem('verificationId'), [Validators.required]),
      codeVerif: this.formBuilder.control(null, [
        Validators.required,
      ]),
    });
  }

  getFormControl(key: any): UntypedFormControl {
    return this.form.get(key) as UntypedFormControl;
  }
  sendcode() {
    console.log(this.form);
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const request: RequestObject = <RequestObject>{
        uri: AuthentificationUri.LOGIN.AUTHENTIFICATE,

        params: {
          body: this.form.value,
        },
        method: ConstanteWs._CODE_POST,
      };
      //// to be continued
    }
  }
}

import { Component } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { AppTranslateService } from '../../../../../app-shared/services/translate/translate.service';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../../shared/services/authentification/authentification.service';
import { Subscription } from 'rxjs';
import { ConstanteWs } from '../../../../../app-shared/constantes/constante-ws';
import { LocalStorageService } from '../../../../../app-shared/services/localStorage/local-storage.service';
import { RequestObject } from '../../../../../app-shared/models';
import { CustomValidators } from '../../../../../app-shared/tools/form-validators';

@Component({
  selector: 'app-auth-login',
  standalone: false,
  templateUrl: './auth-login.html',
  styleUrl: './auth-login.css',
})
export class AuthLogin {
  form!: UntypedFormGroup;
  isLoginLoading = false;
  private mySubscription!: Subscription;
  constructor(
    private formBuilder: UntypedFormBuilder,
    //public appTranslateService: AppTranslateService,
    //private toast: ToastService,
    private localStorage: LocalStorageService,
    private authentificationService: AuthentificationService,
    private router: Router,
    //private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    this.authentificationService.logoutUser();
    this.form = this.initAuthentificationForm();
  }
  ngOnDestroy() {
    if (this.mySubscription) {
      this.mySubscription.unsubscribe();
    }
  }

  initAuthentificationForm() {
    return this.formBuilder.group({
      email: this.formBuilder.control(null, [
        CustomValidators.emailValidator(),
        Validators.required,
      ]),
      password: this.formBuilder.control(null, [Validators.required]),
      //type: this.formBuilder.control("send"),
      //refreshToken: this.formBuilder.control(null),
      //lang: "fr",
      //lang: AppTranslateService.getDefaultLang(),
    });
  }

  getFormControl(key: any): UntypedFormControl {
    return this.form.get(key) as UntypedFormControl;
  }

  useLanguage(lang: any) {
    location.reload();
    console.assert(
      ['fr', 'ar'].includes(lang),
      'Error changement langue in LoginComponent/useLanguage',
    );
    //this.appTranslateService.setDefaultLang(lang);
    //this.appTranslateService.useLanguage(lang);
  }

  login() {
    this.authentificate();
  }

  authentificate() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const payload = this.form.value;

      const refresh = this.localStorage.getItem('refresh_token');

      if (refresh) {
        payload['refreshToken'] = refresh;
      }
      this.mySubscription = this.authentificationService
        .authenticate(payload)
        .subscribe((isLoggedIn) => {
          this.isLoginLoading = false;
          if (isLoggedIn) {
            this.router.navigate(['/app']);
          }
        });
    }
  }

}

import { Component } from '@angular/core';
import { AuthentificationUri } from '../auth.uri';
import { FormArray, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthentificationService } from '../../../shared/services/authentification/authentification.service';
import { Router } from '@angular/router';
import { ConstanteWs } from '../../../../../app-shared/constantes/constante-ws';
import { RequestObject } from '../../../../../app-shared/models';
import { SessionStorageService } from '../../../../../app-shared/services/SessionStorage/session-storage.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SharedService } from '../../../../../app-shared/services/sharedWs/shared.service';
import { ResponseObject } from '../../../../../app-shared/models/ResponseObject';
import { ToastService } from '../../../../../app-shared/services';

@Component({
  selector: 'app-code-verify',
  standalone: true,
  imports: [
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
  submitted = false;

  private mySubscription!: Subscription;
  constructor(
    private formBuilder: UntypedFormBuilder,
    //public appTranslateService: AppTranslateService,
    private toast: ToastService,
    //private sessionStorage: SessionStorageService,
    private authentificationService: AuthentificationService,
    private router: Router,
    private sharedService: SharedService
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

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');

    if (value.length > 1) {
      value = value.charAt(0);
    }

    this.otpControls.at(index).setValue(value);

    this.updateCodeVerif();

    // Aller au champ suivant
    if (value && index < 5) {
      const nextInput = document.querySelectorAll('.otp-input')[index + 1] as HTMLInputElement;
      nextInput?.focus();
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    // Retour arrière
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = document.querySelectorAll('.otp-input')[index - 1] as HTMLInputElement;
      prevInput?.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();

    const pastedData = event.clipboardData?.getData('text')?.replace(/\D/g, '') || '';

    if (!pastedData) return;

    const chars = pastedData.slice(0, 6).split('');

    chars.forEach((char, index) => {
      this.otpControls.at(index).setValue(char);
    });

    this.updateCodeVerif();

    const nextIndex = Math.min(chars.length, 5);
    const nextInput = document.querySelectorAll('.otp-input')[nextIndex] as HTMLInputElement;
    nextInput?.focus();
  }

  updateCodeVerif(): void {
    const code = this.otpControls.value.join('');
    this.form.get('codeVerif')?.setValue(code);
    this.form.get('codeVerif')?.updateValueAndValidity();
  }


  initAuthentificationForm() {
    return this.formBuilder.group({
      email: this.formBuilder.control(sessionStorage.getItem('verificationEmail'), [
        Validators.required,
      ]),
      id: this.formBuilder.control(sessionStorage.getItem('verificationId'), [Validators.required]),

      otp: this.formBuilder.array(
        Array.from({ length: 6 }, () =>
          this.formBuilder.control('', [
            Validators.required,
            Validators.pattern(/^[0-9]$/)
          ])
        )
      ),

      codeVerif: this.formBuilder.control(null,
        [
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/)
        ]
      ),
    });
  }

  get otpControls(): FormArray {
    return this.form.get('otp') as FormArray;
  }
  sendcode() {
    //console.log(this.form.value);
    this.submitted = true;
    this.form.markAllAsTouched();
    this.otpControls.markAllAsTouched();
    if (this.form.get('codeVerif')?.invalid) {
      return;
    }
    if (this.form.valid) {

      this.mySubscription = this.authentificationService
        .verifyCode(this.form.value)
        .subscribe((isLoggedIn) => {
          this.isLoginLoading = false;
          if (isLoggedIn) {
            sessionStorage.removeItem('verificationEmail')
            sessionStorage.removeItem('verificationId')
            this.router.navigate(['/app']);
          }
        });

    }
  }

  resendCode() {
    this.router.navigate(['/']);
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLogin } from './auth-login/auth-login';
import { CodeVerify } from './code-verify/code-verify';
import { AuthentificationRoutingModule } from './authentification-routing.module';
import { AppSharedModule } from '../../../../app-shared/app-shared-module';
import { LayoutsModule } from '../../../layouts-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CodeVerify,
    AuthLogin,
  ],
  imports: [
    CommonModule,
    AuthentificationRoutingModule,
    AppSharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class AuthentificationModule { }

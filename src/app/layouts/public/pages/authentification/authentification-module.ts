import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLogin } from './auth-login/auth-login';
import { CodeVerify } from './code-verify/code-verify';
import { AuthentificationRoutingModule } from './authentification-routing.module';
import { AppSharedModule } from '../../../../app-shared/app-shared-module';
import { LayoutsModule } from '../../../layouts-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Checkbox } from '../../../../app-shared/widgets/form/checkbox/checkbox';
import { SelectBoolean } from '../../../../app-shared/widgets/form/select/select-boolean/select-boolean';
import { SelectCommon } from '../../../../app-shared/widgets/form/select/select-common/select-common';
import { SharedModule } from '../../shared/shared-module';

@NgModule({
  declarations: [AuthLogin],
  imports: [
    CommonModule,
    AppSharedModule,
    SharedModule,
    TranslateModule.forChild(),
    AuthentificationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    Checkbox,
    SelectBoolean
  ],
})
export class AuthentificationModule { }

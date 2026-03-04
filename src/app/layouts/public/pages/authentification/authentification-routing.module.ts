import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthLogin } from './auth-login/auth-login';
import { CodeVerify } from './code-verify/code-verify';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: AuthLogin,
    data: {
      title: 'athentification.login.title',
    },
  },
  {
    path: 'login/verify',
    component: CodeVerify,
    data: {
      title: 'athentification.login.title',
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthentificationRoutingModule { }

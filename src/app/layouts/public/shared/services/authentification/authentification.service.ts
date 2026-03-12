import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ConnectedUser } from '../../../../../app-shared/models/ConnectedUser';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { ConstanteWs } from '../../../../../app-shared/constantes/constante-ws';
import { AuthentificationUri } from '../../uri/authentification-uri-index';
import { isEmptyValue } from '../../../../../app-shared/tools/utils/functions.utils';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../../../app-shared/services/localStorage/local-storage.service';
import { SessionStorageService } from '../../../../../app-shared/services/SessionStorage/session-storage.service';
import { ToastService } from '../../../../../app-shared/services/toast/toast.service';
import { SharedService } from '../../../../../app-shared/services/sharedWs/shared.service';
import { ResponseObject } from '../../../../../app-shared/models/ResponseObject';
import { RequestObject } from '../../../../../app-shared/models/RequestObject';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  private _CODE_TOKEN_KEY = 'access_token';
  private userinfo: any;
  userLoggedIn = new Subject<boolean>();

  static authenticatedUser: ConnectedUser | undefined;

  private emailSource = new BehaviorSubject<string>('');

  constructor(
    private toast: ToastService,
    private sharedService: SharedService,
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
  ) {
    const storedEmail = this.localStorage.getItem('storedEmail');
    if (storedEmail) {
      this.emailSource.next(storedEmail);
    }
  }

  get currentEmail() {
    return this.emailSource.asObservable();
  }

  setEmail(email: string) {
    this.emailSource.next(email);
    this.localStorage.setItem('storedEmail', email);
  }
  removeEmail() {
    this.localStorage.removeItem('storedEmail');
    this.emailSource.next('');
  }
  setUserLoggedIn(flag: any) {
    this.userLoggedIn.next(flag);
  }

  getUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }
  getuserinfo(): any {
    return this.userinfo;
  }

  public getCurrentUser(): any {
    return JSON.parse(this.localStorage.getItem('userInfo') || '');
  }

  private removeAccessToken() {
    this.sessionStorage.removeItem(this._CODE_TOKEN_KEY);
  }

  private saveAccessToken(accessToken: any) {
    this.sessionStorage.setItem(this._CODE_TOKEN_KEY, accessToken);
  }

  private getAccessToken() {
    return this.sessionStorage.getItem(this._CODE_TOKEN_KEY);
  }

  public authenticate(credentials: any): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.removeAccessToken();
      const request: RequestObject = <RequestObject>{
        uri: AuthentificationUri.LOGIN.AUTHENTIFICATE,
        params: {
          body: credentials,
        },
        method: ConstanteWs._CODE_POST,
      };
      /////// to be continued
      this.sharedService.commonWs(request).subscribe({
        next: (response: ResponseObject) => {
          console.log('response: ' + response);
          if (!response) {
            this.toast.error('authentification.login.errors.code');
          }

          if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
            //this.saveAccessToken(response.payload['token']);

            const access = response.payload['accessToken'] || response.payload['token'];
            const refresh = response.payload['refreshToken'];

            this.saveAccessToken(access);
            if (refresh) {
              this.localStorage.setItem('refresh_token', refresh);
            }
            //subscriber.next(true);
            this.isUserAuthentificated().subscribe((isAuthentificated) => {
              if (isAuthentificated) {
                subscriber.next(true);
              } else {
                console.error(
                  `Error in AuthentificationService/authentificate, error :: isAuthentificated = false`,
                );
                this.toast.error('authentification.login.errors.userErrorAuth');
                subscriber.next(false);
                //this.toast.error();
                //subscriber.next(false);
              }
            });
          } else if (response.code == ConstanteWs._CODE_WS_ERROR_EMAIL_CODE) {
            this.toast.error('authentification.login.errors.code');
            subscriber.next(false);
          } else if (response.code == ConstanteWs._CODE_WS_SUCCESS_WAIT_PERMISSION) {
            this.toast.error('authentification.login.errors.userErrorAuthInvalid');
            subscriber.next(false);
          } else if (response.code == ConstanteWs._CODE_WS_ACCOUNT_EXPIRED) {
            this.toast.error('authentification.login.errors.userErrorAuthExpiré');
            subscriber.next(false);
          } else if (response.code == '444') {
            this.toast.error('تم رفض عملية تسجيل الدخول: يوجد دخول نشط لنفس الحساب من جهاز آخر');
            subscriber.next(false);
          } else if (response.code == '445') {
            this.toast.error('عنوان IP خارج النطاق المسموح به');
            subscriber.next(false);
          } else {
            console.error(
              `Error in AuthentificationService/authentificate, error code :: ${response.code}`,
            );
            this.toast.error('authentification.login.errors.userErrorAuth');
            subscriber.next(false);
          }
        },
        error: (error) => {
          console.error(`Error in AuthentificationService/authentificate, error :: ${error}`);
          this.toast.error();
          subscriber.next(false);
        },
      });
    });
  }

  public authenticateno2fa(credentials: any): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.removeAccessToken();
      const request: RequestObject = <RequestObject>{
        uri: 'authenticateNo2FA',
        params: {
          body: credentials,
        },
        method: ConstanteWs._CODE_POST,
      };
      this.sharedService.commonWs(request).subscribe({
        next: (response: ResponseObject) => {
          if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
            // this.router.navigate(['/public/authentification/login/verify',"masternidal3@gmail.com"]);
            this.saveAccessToken(response.payload['token']);
            this.isUserAuthentificated().subscribe((isAuthentificated) => {
              if (isAuthentificated) {
                subscriber.next(true);
              } else {
                console.error(
                  `Error in AuthentificationService/authentificate, error :: isAuthentificated = false`,
                );
                this.toast.error();
                subscriber.next(false);
              }
            });
          } else if (response.code == ConstanteWs._CODE_WS_USER_ERROR_AUTH) {
            this.toast.error('athentification.login.errors.userErrorAuth');
          } else if (response.code == ConstanteWs._CODE_WS_SUCCESS_WAIT_PERMISSION) {
            this.toast.error('athentification.login.errors.userErrorAuthInvalid');
            subscriber.next(false);
          } else if (response.code == ConstanteWs._CODE_WS_ACCOUNT_EXPIRED) {
            this.toast.error('athentification.login.errors.userErrorAuthExpiré');
            subscriber.next(false);
          } else {
            console.error(
              `Error in AuthentificationService/authentificate, error code :: ${response.code}`,
            );
            this.toast.error();
            subscriber.next(false);
          }
        },
        error: (error) => {
          console.error(`Error in AuthentificationService/authentificate, error :: ${error}`);
          this.toast.error();
          subscriber.next(false);
        },
      });
    });
  }

  public fetchWhoAmI(): Observable<any> {
    console.log('token :', this.getAccessToken());
    return new Observable<any>((subscriber) => {
      if (!isEmptyValue(this.getAccessToken())) {
        const request: RequestObject = <RequestObject>{
          uri: AuthentificationUri.LOGIN.WHOIAM,
          method: ConstanteWs._CODE_GET,
        };
        console.log('request : ' + JSON.stringify(request));
        this.sharedService.commonWs(request).subscribe({
          next: (response: ResponseObject) => {
            if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
              AuthentificationService.authenticatedUser = response.payload;
              this.userinfo = response.payload;
              this.localStorage.setItem('userInfo', JSON.stringify(this.userinfo));
              this.userLoggedIn.next(true);
              subscriber.next(response.payload);
            } else {
              console.error(
                `Error in AuthentificationService/fetchWhoAmI, error code :: ${response.code}`,
              );
              this.toast.error();
              subscriber.next(false);
            }
          },
          error: (error) => {
            console.error(`Error in AuthentificationService/fetchWhoAmI, error :: ${error}`);
            this.toast.error();
            subscriber.next(false);
          },
        });
      } else {
        subscriber.next(false);
      }
    });
  }

  public isUserAuthentificated(): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      if (!!AuthentificationService.authenticatedUser) {
        subscriber.next(true);
        this.userLoggedIn.next(true);
      } else {
        this.fetchWhoAmI().subscribe({
          next: (response: any) => {
            if (response) {
              console.log('response fetchWhoAmI: ' + response);
              this.userLoggedIn.next(true);
              subscriber.next(true);
            } else {
              this.userLoggedIn.next(false);
              subscriber.next(false);
            }
          },
          error: () => {
            this.userLoggedIn.next(false);
            subscriber.next(false);
          },
        });
      }
    });
  }

  public logoutUser(): void {
    this.removeAccessToken();
    AuthentificationService.authenticatedUser = undefined;
    this.userLoggedIn.next(false);
  }

  public logout(): void {
    //this.logoutback(AuthentificationService.authenticatedUser!.id);
    this.removeAccessToken();
    this.sessionStorage.removeItem('selectedMenu');
    AuthentificationService.authenticatedUser = undefined;
    this.userLoggedIn.next(false);
    this.router.navigate(['/public/authentification/login']);
  }

  logoutback(id: any) {
    const request: RequestObject = <RequestObject>{
      uri: 'public/logout',
      params: {
        query: {
          id: id,
        },
      },
      method: ConstanteWs._CODE_GET,
    };

    this.sharedService.commonWs(request).subscribe({
      next: (response: ResponseObject) => {
        if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
        } else {
          console.error(`Error in NavbarComponent/logoutback, error code :: ${response.code}`);
          this.toast.error();
        }
      },
      error: (error) => {
        console.error(`Error in NavbarComponent/logoutback, error :: ${error}`);
        this.toast.error();
      },
    });
  }

  public logoutPortal(redirect: string): void {
    this.removeAccessToken();
    AuthentificationService.authenticatedUser = undefined;
    this.userLoggedIn.next(false);
    this.router.navigate([redirect]);
  }

  public refreshAccessToken(): Observable<string> {
    const refreshToken = this.localStorage.getItem('refresh_token');
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    const request: RequestObject = <RequestObject>{
      uri: AuthentificationUri.LOGIN.REFRESH_TOKEN,
      method: ConstanteWs._CODE_POST,
      params: {
        body: { refreshToken },
      },
    };

    return new Observable<string>((subscriber) => {
      this.sharedService.commonWs(request).subscribe({
        next: (response: ResponseObject) => {
          if (response.code === ConstanteWs._CODE_WS_SUCCESS) {
            const newAccess = response.payload['accessToken'];
            const newRefresh = response.payload['refreshToken'];

            this.saveAccessToken(newAccess);
            if (newRefresh) {
              this.localStorage.setItem('refresh_token', newRefresh);
            }

            subscriber.next(newAccess);
            subscriber.complete();
          } else {
            this.toast.error('عذراً الجلسة انتهت ');
            this.logout();
            subscriber.error('Refresh token expired');
          }
        },
        error: (err) => {
          this.logout();
          subscriber.error(err);
        },
      });
    });
  }

  public isTokenExpiringSoon(token: string, secondsBefore: number = 30): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return exp - Date.now() < secondsBefore * 1000;
    } catch (e) {
      return true;
    }
  }
}

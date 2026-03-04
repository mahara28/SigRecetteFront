import { Inject, inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ConnectedUser } from '../../../../../app-shared/models/ConnectedUser';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { ConstanteWs } from '../../../../../app-shared/constantes/constante-ws';
import { AuthentificationUri } from '../../uri/authentification-uri-index';
import { isEmptyValue } from '../../../../../app-shared/tools/utils/functions.utils';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../../../app-shared/services/localStorage/local-storage.service';
import { SessionStorageService } from '../../../../../app-shared/services/SessionStorage/session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthentificationService {
  private _CODE_TOKEN_KEY = 'access_token';
  private userinfo: any
  userLoggedIn = new Subject<boolean>();

  static authenticatedUser: ConnectedUser | undefined;

  private emailSource = new BehaviorSubject<string>('');

  constructor(
    //private toast: ToastService,
    //private sharedService: SharedService,
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
    return JSON.parse(this.localStorage.getItem("userInfo") || "");
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
          body: credentials
        },
        method: ConstanteWs._CODE_POST
      };
      /////// to be continued
      console.log('to be continued authenticate service')
    })
  }

  public authenticateno2fa(credentials: any): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.removeAccessToken();
      const request: RequestObject = <RequestObject>{
        uri: 'authenticateNo2FA',
        params: {
          body: credentials
        },
        method: ConstanteWs._CODE_POST
      };
      /////// to be continued
    })
  }

  public fetchWhoAmI(): Observable<any> {
    return new Observable<any>((subscriber) => {
      if (!isEmptyValue(this.getAccessToken())) {
        const request: RequestObject = <RequestObject>{
          uri: AuthentificationUri.LOGIN.WHOIAM,
          method: ConstanteWs._CODE_GET
        };
        /////// to be continued
      } else {
        subscriber.next(false);
      }
    })
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
          }
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
    this.logoutback(AuthentificationService.authenticatedUser!.id);
    this.removeAccessToken();
    AuthentificationService.authenticatedUser = undefined;
    this.userLoggedIn.next(false);
    this.router.navigate(['/public/authentification/login']);
  }

  logoutback(id: any) {
    const request: RequestObject = <RequestObject>{
      uri: "public/logout",
      params: {
        query: {

          id: id,
        },
      },
      method: ConstanteWs._CODE_GET,
    };

    /////// to be continued
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
        body: { refreshToken }
      }
    };

    return new Observable<string>((subscriber) => {
      /////// to be continued
    })
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


interface RequestObject {
  uri: string;
  params?: {
    body?: object;
    query?: object;
    path?: string[];
    formData?: object;
  };
  listFiles?: any[];
  microservice?: string;
  method: "GET" | "DELETE" | "POST" | "PUT";
  server?: string;
  speCase?: string;
}
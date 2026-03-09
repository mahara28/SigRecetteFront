import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Loading } from '../../../services/loading/loading';
import { ToastService } from '../../../services/toast/toast.service';
import { AuthentificationService } from '../../../../layouts/public/shared/services/authentification/authentification.service';
import { isObject } from '@ngx-translate/core';
import * as Links from '../../../constantes/links';
import { SessionStorageService } from '../../../services/SessionStorage/session-storage.service';

/**
 * @Author
 *
 */

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(
    private loading: Loading,
    private injector: Injector,
    private sessionStorage: SessionStorageService,
  ) {}
  private get toast(): ToastService {
    return this.injector.get(ToastService);
  }

  private get router(): Router {
    return this.injector.get(Router);
  }

  private get authService(): AuthentificationService {
    return this.injector.get(AuthentificationService);
  }

  static _executeBadResponseMiddleware(response: any) {
    if (AppHttpInterceptor._isServerResponse(response) && response?.body?.code !== '200') {
      const errorMessage = response?.body;
      return throwError(errorMessage);
    }

    return of(response);
  }

  static _isServerResponse(response: any): boolean {
    if (!(response instanceof HttpResponse)) {
      return false;
    }

    if (!response.hasOwnProperty('body')) {
      return false;
    }
    if (!isObject(response.body)) {
      return false;
    }

    return (
      Object.keys(response.body).includes('code') && Object.keys(response.body).includes('message')
    );
  }

  getHeader(req: HttpRequest<any>, accessToken: string) {
    return req.clone({
      setHeaders: {
        Authorization: ['Bearer', accessToken].join(' '),
      },
    });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.sessionStorage.getItem('access_token');

    if (!!accessToken) {
      req = this.getHeader(req, accessToken);
    }

    if (!this._isExludedInterUrl(req)) {
      this.loading.setLoading(true, req.url, req.reportProgress);
    }

    return next.handle(req).pipe(
      catchError((err) => {
        this.loading.setLoading(false, req.url);

        if (err.status === 401) {
          return this.authService.refreshAccessToken().pipe(
            mergeMap((newAccess) => {
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccess}`,
                },
              });

              return next.handle(retryReq);
            }),

            catchError((err2) => {
              this.authService.logoutUser();
              return throwError(() => err2);
            }),
          );
        }

        return throwError(() => err);
      }),

      map((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          this.loading.setLoading(false, req.url);
        }
        return evt;
      }),

      mergeMap((response: any) => {
        return AppHttpInterceptor._executeBadResponseMiddleware(response);
      }),
    );
  }

  private _isExludedInterUrl(req: any) {
    return Links.excludedInterUrlList.some((url: any) => req.url.includes(url));
  }
}

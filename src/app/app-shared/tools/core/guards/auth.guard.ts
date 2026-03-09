import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthentificationService } from '../../../../layouts/public/shared/services/authentification/authentification.service';

export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean>;
}

@Injectable({ providedIn: 'root' })
export class PendingChangesGuard {
  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> {
    // if there are no pending changes, just allow deactivation; else confirm first
    return component.canDeactivate()
      ? true
      : // NOTE: this warning message will only be shown when navigating elsewhere within your angular app;
        // when navigating away from your angular app, the browser will show a generic warning message
        // see http://stackoverflow.com/a/42207299/7307355
        confirm('Les modifications que vous avez apportées ne seront peut-être pas enregistrées.');
  }
}

// export class PendingChangesGuard implements CanDeactivate<AjoutModifProjetComponent> {
//   canDeactivate(component: AjoutModifProjetComponent): boolean {

//       if (component.form.dirty) {
//         return confirm('Are you sure you want to navigate away and lose changes to the form?');
//       }

//       return true;
//     }
//   }

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(
    private authentificationService: AuthentificationService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable((subscriber) => {
      this.authentificationService
        .isUserAuthentificated()
        .subscribe((isAuthentificated: boolean) => {
          if (!isAuthentificated) {
            this.router.navigate(['']);
            subscriber.next(false);
          } else {
            subscriber.next(true);
          }
        });
    });
  }
}

/* @Injectable({ providedIn: 'root' })
export class PortalAuthGuard {
  constructor(
    private authentificationService: AuthentificationService,
    private router: Router,
  ) {}
  // canActivate(
  //   route: ActivatedRouteSnapshot
  // ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return new Observable((subscriber) => {
  //     this.authentificationService
  //       .isCandidateAuthentificated(route.data.portal)
  //       .subscribe((isAuthentificated: boolean) => {
  //         if (!isAuthentificated) {
  //           this.router.navigate([
  //             `/public/portail/${route.data.portal.toLowerCase()}/auth/login`,
  //           ]);
  //           subscriber.next(false);
  //         } else {
  //           subscriber.next(true);
  //         }
  //       });
  //   });
  // }
} */

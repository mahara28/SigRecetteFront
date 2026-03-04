import { Inject, Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { filter, take } from "rxjs/operators";

import { TranslateService } from "@ngx-translate/core";
import { Alert, AlertType } from "../../models/Alert";

@Injectable({ providedIn: "root" })
export class AlertService {
  private subject = new Subject<Alert>();
  private defaultId = "default-alert";

  constructor(
    @Inject(TranslateService)
    private  translate: TranslateService) {}

  // Subscribe to alerts observable
  onAlert(id = this.defaultId): Observable<Alert> {
    return this.subject.asObservable().pipe(
      filter(alert => !!alert && alert.id === id)
    );
  }

  // Convenience methods
  success(key: string, params: Record<string, any> = {}, options?: any) {
    this.translateAndAlert(key, params, AlertType.Success, options);
  }

  error(key: string, params: Record<string, any> = {}, options?: any) {
    this.translateAndAlert(key, params, AlertType.Error, options);
  }

  info(key: string, params: Record<string, any> = {}, options?: any) {
    this.translateAndAlert(key, params, AlertType.Info, options);
  }

  warn(key: string, params: Record<string, any> = {}, options?: any) {
    this.translateAndAlert(key, params, AlertType.Warning, options);
  }

  // Main alert method
  alert(alert: Alert) {
    alert.id = alert.id || this.defaultId;
    this.subject.next(alert);
  }

  // Clear alerts
  clear(id = this.defaultId) {
    this.subject.next(new Alert({ id }));
  }

  // Private helper
  private translateAndAlert(
    key: string,
    params: Record<string, any>,
    type: AlertType,
    options?: any
  ) {
    // Take 1 emission to avoid memory leaks
    this.translate.get(key, params).pipe(take(1)).subscribe(message => {
      this.alert(new Alert({ ...options, type, message }));
    });
  }
}

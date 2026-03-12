// shared.service.ts
import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/overlay';
import { RequestObject } from '../../models/RequestObject';
import { ResponseObject } from '../../models/ResponseObject';
import { AppTranslateService } from '../translate/translate.service';
import { WsFactory } from '../../tools/utils/ws-factory';
import { SearchObject } from '../../models/SearchObject';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private readonly wsFactory = inject(WsFactory);
  private readonly dialog = inject(MatDialog);
  private readonly appTranslateService = inject(AppTranslateService);

  /**
   * Appel WS générique
   */
  commonWs(request: RequestObject): Observable<ResponseObject> {
    return this.wsFactory.callFunction(request);
  }

  /**
   * Récupère la date serveur
   */
  dateNow(): Promise<Date> {
    return new Promise((resolve) => {
      this.wsFactory.callGatewayDateNowPromise().subscribe(dateNow => {
        resolve(new Date(dateNow));
      });
    });
  }

  /**
   * Récupère une liste de nomenclature
   */
  async getListNm<T = any>(
    nmType: string,
    searchObject?: SearchObject,
    method: 'POST' | 'GET' = 'POST'
  ): Promise<T[]> {
    return await this.wsFactory.calListNm(nmType, searchObject, method);
  }

  /**
   * Export de données
   */
  exportWs(request: RequestObject, callLocation: string): void {
    this.wsFactory.exportFunction(request, callLocation);
  }

  /**
   * Ouvre un dialogue
   */
  openDialog<T = any>(
    dialog: ComponentType<any>,
    data?: any,
    width: string = '68%'
  ): Observable<T | null> {
    const dialogRef = this.dialog.open(dialog, {
      disableClose: true,
      width: width,
      direction: this.appTranslateService.getDir(),
      autoFocus: false,
      data: data
    });

    return dialogRef.afterClosed().pipe(
      map((response: any) => response?.data ?? null)
    );
  }

  /**
   * Ouvre un dialogue expansé
   */
  openExpandedDialog<T = any>(
    dialog: ComponentType<any>,
    data?: any,
    width: string = '68%',
    height: string = '35%'
  ): Observable<T | null> {
    const dialogRef = this.dialog.open(dialog, {
      disableClose: true,
      height: height,
      width: width,
      direction: this.appTranslateService.getDir(),
      autoFocus: true,
      data: data
    });

    return dialogRef.afterClosed().pipe(
      map((response: any) => response?.data ?? null)
    );
  }

  /**
   * Ouvre un dialogue avec configuration complète
   */
  openDialogWithConfig<T = any>(
    dialog: ComponentType<any>,
    config: {
      data?: any;
      width?: string;
      height?: string;
      disableClose?: boolean;
      autoFocus?: boolean;
      panelClass?: string;
    }
  ): Observable<T | null> {
    const dialogRef = this.dialog.open(dialog, {
      disableClose: config.disableClose ?? true,
      width: config.width ?? '68%',
      height: config.height,
      direction: this.appTranslateService.getDir(),
      autoFocus: config.autoFocus ?? false,
      data: config.data,
      panelClass: config.panelClass
    });

    return dialogRef.afterClosed().pipe(
      map((response: any) => response?.data ?? null)
    );
  }

  /**
   * Ferme tous les dialogues
   */
  closeAllDialogs(): void {
    this.dialog.closeAll();
  }
}

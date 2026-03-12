// confirm-dialog.service.ts
import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AppTranslateService } from '../translate/translate.service';
import { ConfirmDialog } from '../../widgets/dialogs/alert-dialog/confirm-dialog/confirm-dialog';
import { DialogError } from '../../widgets/dialogs/alert-dialog/dialog-error/dialog-error';
import { ConfirmDialogLogout } from '../../widgets/dialogs/alert-dialog/confirm-dialog-logout/confirm-dialog-logout';

// Types pour les options
export interface ConfirmOptions {
  title?: string;
  description?: string;
  count?: number | string;
  withCheckbox?: boolean;
  checkboxLabel?: string;
  confirmText?: string;
  cancelText?: string;
  showConfirm?: boolean;
  width?: string;
}

export interface ErrorOptions {
  message: string;
  multiple?: boolean;
  details?: string[];
  width?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private readonly dialog = inject(MatDialog);
  private appTranslateService = inject(AppTranslateService);
  /**
   * Ouvre une boîte de dialogue de confirmation
   */
  /* confirm(options: ConfirmOptions = {}): Observable<boolean> {
    const dialogConfig: MatDialogConfig = {
      panelClass: 'custom-dialog-container',
      disableClose: true,
      autoFocus: true,
      width: options.width || '35%',
      direction: this.appTranslateService.getCurrentDirection(),
      data: {
        title: options.title,
        description: options.description,
        count: options.count,
        withcheckbox: options.withCheckbox,
        labelcheckBox: options.checkboxLabel,
        btn1Label: options.confirmText,
        btn2Label: options.cancelText,
        showApprove: options.showConfirm ?? true
      }
    };

    const dialogRef = this.dialog.open(ConfirmDialog, dialogConfig);
    return dialogRef.afterClosed();
  } */
  confirm(
    title?: string,
    description?: string,
    count?: any,
    withcheckbox?: boolean,
    labelcheckBox?: string,
    btn1Label?: string,
    btn2Label?: string,
    showApprove?: boolean,
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      data: {
        title,
        description,
        count,
        withcheckbox,
        labelcheckBox,
        btn1Label,
        btn2Label,
        showApprove,
      },
      panelClass: 'custom-dialog-container',
      disableClose: true,
      width: '35%',
      direction: AppTranslateService.getStoredDirection(),
      autoFocus: true,
    });
    return dialogRef.afterClosed();
  }
  confirmLogin(title?: string, description?: string): Observable<any> {
    const dialogRef2 = this.dialog.open(ConfirmDialogLogout, {
      data: { title, description },
    });
    return dialogRef2.afterClosed();
  }

  close() {
    this.dialog.closeAll();
  }

  /**
   * Ouvre une boîte de dialogue de déconnexion
   */
  confirmLogout(title?: string, description?: string): Observable<boolean> {
    const dialogConfig: MatDialogConfig = {
      panelClass: 'custom-dialog-container',
      disableClose: true,
      width: '400px',
      direction: this.appTranslateService.getCurrentDirection(),
      data: { title, description },
    };

    const dialogRef = this.dialog.open(ConfirmDialogLogout, dialogConfig);
    return dialogRef.afterClosed();
  }

  /**
   * Ouvre une boîte de dialogue d'erreur
   */
  error(options: ErrorOptions): Observable<boolean> {
    const dialogConfig: MatDialogConfig = {
      panelClass: 'custom-dialog-container',
      disableClose: true,
      autoFocus: true,
      width: options.width || '40%',
      direction: this.appTranslateService.getCurrentDirection(),
      data: {
        msg: options.message,
        mutlimsgs: options.multiple || false,
        listmsg: options.details || [],
      },
    };

    const dialogRef = this.dialog.open(DialogError, dialogConfig);
    return dialogRef.afterClosed();
  }

  /**
   * Version simplifiée pour une erreur simple
   */
  errorSimple(message: string): Observable<boolean> {
    return this.error({ message });
  }

  /**
   * Version pour erreurs multiples
   */
  errorMultiple(message: string, details: string[]): Observable<boolean> {
    return this.error({ message, multiple: true, details });
  }

  /**
   * Ferme toutes les boîtes de dialogue
   */
  closeAll(): void {
    this.dialog.closeAll();
  }
}

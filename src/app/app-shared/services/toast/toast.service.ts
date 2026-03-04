// toast.service.ts
import { Injectable, OnDestroy, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../../environements/environement';

@Injectable({
  providedIn: 'root'
})
export class ToastService implements OnDestroy {
  private readonly translate = inject(TranslateService);
  private readonly snackbar = inject(MatSnackBar);
  private readonly destroy$ = new Subject<void>();

  private readonly defaultDuration = environment.ToastDuration || 3000;

  /**
   * Affiche un toast de succès
   */
  success(
    translationKey: string = 'general.success_save',
    params: Record<string, any> = {},
    duration?: number
  ): void {
    this.show(translationKey, params, duration, 'green-snackbar');
  }

  /**
   * Affiche un toast d'erreur
   */
  error(
    translationKey: string = 'general.errors.server_error',
    params: Record<string, any> = {},
    duration?: number
  ): void {
    this.show(translationKey, params, duration, 'red-snackbar');
  }

  /**
   * Affiche un toast d'avertissement
   */
  warning(
    translationKey: string = 'general.errors.warning',
    params: Record<string, any> = {},
    duration?: number
  ): void {
    this.show(translationKey, params, duration, 'yellow-snackbar');
  }

  /**
   * Affiche un toast d'information
   */
  info(
    translationKey: string = 'general.info',
    params: Record<string, any> = {},
    duration?: number
  ): void {
    this.show(translationKey, params, duration, 'blue-snackbar');
  }

  /**
   * Affiche un toast avec message direct
   */
  message(
    message: string,
    panelClass: string = 'blue-snackbar',
    duration?: number
  ): void {
    this.snackbar.open(message, undefined, {
      duration: duration || this.defaultDuration,
      panelClass: [panelClass]
    });
  }

  /**
   * Méthode privée pour afficher un toast
   */
  private show(
    translationKey: string,
    params: Record<string, any>,
    duration: number | undefined,
    panelClass: string
  ): void {
    this.translate.get(translationKey, params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message) => {
          this.snackbar.open(message, undefined, {
            duration: duration || this.defaultDuration,
            panelClass: [panelClass]
          });
        },
        error: (error) => {
          console.error('Erreur de traduction:', error);
          this.snackbar.open(translationKey, undefined, {
            duration: duration || this.defaultDuration,
            panelClass: [panelClass]
          });
        }
      });
  }

  /**
   * Nettoie les abonnements
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

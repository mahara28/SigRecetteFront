// session-timeout.service.ts
import { Injectable, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { environment } from '../../../../environements/environement';
import { AuthentificationService } from '../../../layouts/public/shared/services/authentification/authentification.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeOutService implements OnDestroy {
  private readonly authentificationService = inject(AuthentificationService);
  private readonly idle = inject(Idle);
  private readonly keepalive = inject(Keepalive);
  private readonly confirmDialogService = inject(ConfirmDialogService);
  private readonly router = inject(Router);

  private readonly destroy$ = new Subject<void>();

  public idleState = 'Not started.';
  public timedOut = false;
  public lastPing: Date | null = null;
  public countdown: number = 0;

  constructor() {
    this.initialize();
  }

  /**
   * Initialise le service
   */
  private initialize(): void {
    this.watchUserLogin();
  }

  /**
   * Active la surveillance de session
   */
  public activateSessionTimeout(): void {
    this.configureIdle();
    this.configureKeepalive();
    this.setupEvents();
    this.reset();
  }

  /**
   * Configure le service Idle
   */
  private configureIdle(): void {
    this.idle.setIdle(environment.Session?.expired || 1800);
    this.idle.setTimeout(environment.Session?.timeout || 300);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
  }

  /**
   * Configure le service Keepalive
   */
  private configureKeepalive(): void {
    this.keepalive.interval(15);

    this.keepalive.onPing
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.lastPing = new Date();
      });
  }

  /**
   * Configure les événements
   */
  private setupEvents(): void {
    // Fin d'inactivité
    this.idle.onIdleEnd
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.idleState = 'No longer idle.';
      });

    // Début d'inactivité
    this.idle.onIdleStart
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.idleState = 'You\'ve gone idle!';
      });

    // Avertissement
    this.idle.onTimeoutWarning
      .pipe(takeUntil(this.destroy$))
      .subscribe((countdown) => {
        this.idleState = `You will time out in ${countdown} seconds!`;
        this.countdown = countdown;

        if (countdown === environment.Session?.timeout) {
          this.showWarning();
        }
      });

    // Timeout
    this.idle.onTimeout
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.idleState = 'Timed out!';
        this.timedOut = true;
        this.logout();
      });
  }

  /**
   * Surveille la connexion utilisateur
   */
  private watchUserLogin(): void {
    this.authentificationService.getUserLoggedIn()
      .pipe(
        filter(isLoggedIn => isLoggedIn),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.activateSessionTimeout();
      });
  }

  /**
   * Affiche l'avertissement
   */
  private showWarning(): void {
    this.idle.clearInterrupts();

    this.confirmDialogService.confirmLogin('', 'confirm_log_out')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (confirmed:any) => {
          if (confirmed) {
            this.logout();
          } else {
            this.confirmDialogService.close();
            this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
            this.stay();
          }
        }
      });
  }

  /**
   * Déconnecte l'utilisateur
   */
  public logout(): void {
    this.stop();
    this.authentificationService.setUserLoggedIn(false);
    this.authentificationService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * Réinitialise la session
   */
  public reset(): void {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
    this.countdown = 0;
  }

  /**
   * Maintient la session active
   */
  public stay(): void {
    this.reset();
  }

  /**
   * Arrête la surveillance
   */
  public stop(): void {
    this.idle.stop();
  }

  /**
   * Nettoie les abonnements
   */
  ngOnDestroy(): void {
    this.stop();
    this.destroy$.next();
    this.destroy$.complete();
  }
}

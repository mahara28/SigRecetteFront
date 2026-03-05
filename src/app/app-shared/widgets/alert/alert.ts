

// alert.component.ts
import { Component, OnInit, OnDestroy, Input, inject } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Alert, AlertType } from '../../models/Alert';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.html',
  standalone: false
})
export class AlertComponent implements OnInit, OnDestroy {
  // Injection moderne avec inject()
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);

  @Input() id = 'default-alert';
  @Input() fade = true;

  alerts: Alert[] = [];
  private alertSubscription: Subscription = new Subscription();
  private routeSubscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.subscribeToAlerts();
    this.subscribeToRouteChanges();
  }

  ngOnDestroy(): void {
    // Nettoyage des abonnements
    this.alertSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  /**
   * S'abonne aux notifications d'alertes
   */
  private subscribeToAlerts(): void {
    this.alertSubscription = this.alertService
      .onAlert(this.id)
      .subscribe((alert) => this.handleAlert(alert));
  }

  /**
   * Gère une alerte reçue
   */
  private handleAlert(alert: Alert): void {
    // Si l'alerte est vide, on nettoie
    if (!alert?.message) {
      this.clearAlertsAfterRouteChange();
      return;
    }

    // Ajout de l'alerte
    this.alerts.push(alert);

    // Fermeture automatique si nécessaire
    if (alert.autoClose) {
      setTimeout(() => this.removeAlert(alert), 3000);
    }
  }

  /**
   * Nettoie les alertes après un changement de route
   */
  private clearAlertsAfterRouteChange(): void {
    // Garder seulement les alertes avec keepAfterRouteChange
    this.alerts = this.alerts.filter((x) => x.keepAfterRouteChange);

    // Retirer le flag sur les alertes restantes
    this.alerts.map(({ keepAfterRouteChange, ...rest }) => rest);
    
  }

  /**
   * S'abonne aux changements de route
   */
  private subscribeToRouteChanges(): void {
    this.routeSubscription = this.router.events
      .pipe(filter((event): event is NavigationStart => event instanceof NavigationStart))
      .subscribe(() => {
        this.alertService.clear(this.id);
      });
  }

  /**
   * Supprime une alerte
   */
  removeAlert(alert: Alert): void {
    // Vérifier si l'alerte existe encore
    const index = this.alerts.indexOf(alert);
    if (index === -1) return;

    if (this.fade) {
      // Effet de fondu
      this.alerts[index].fade = true;

      // Supprimer après le fondu
      setTimeout(() => {
        this.alerts = this.alerts.filter((x) => x !== alert);
      }, 250);
    } else {
      // Suppression directe
      this.alerts = this.alerts.filter((x) => x !== alert);
    }
  }

  /**
   * Génère les classes CSS pour une alerte
   */
  cssClass(alert: Alert): string {
    if (!alert) return '';

    const classes: string[] = ['alert', 'alert-dismissable'];

    // Map des types d'alertes vers les classes Bootstrap
    const alertTypeClass: Record<AlertType, string> = {
      [AlertType.Success]: 'alert-success',
      [AlertType.Error]: 'alert-danger',
      [AlertType.Info]: 'alert-info',
      [AlertType.Warning]: 'alert-warning',
    };

    classes.push(alertTypeClass[alert.type]);

    if (alert.fade) {
      classes.push('fade');
    }

    return classes.join(' ');
  }
}

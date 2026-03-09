import { Injectable, inject, signal, computed, effect, PLATFORM_ID } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SpinnerConfig } from '../../models/SpinnerConfig';
import { Spinner } from '../../widgets/spinner/spinner';
import { isEmptyValue } from '../../tools/utils/functions.utils';
import { isPlatformBrowser } from '@angular/common';

interface LoadingRequest {
  url: string;
  determinate: boolean;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class Loading {
  private readonly dialog = inject(MatDialog);
  private readonly platformId = inject(PLATFORM_ID);

  // Signaux pour l'état réactif
  private readonly requests = signal<Map<string, LoadingRequest>>(new Map());
  private readonly spinnerVisible = signal<boolean>(false);

  // Signaux dérivés (computed)
  public readonly isLoading = computed(() => this.requests().size > 0);
  public readonly activeRequestsCount = computed(() => this.requests().size);
  public readonly activeUrls = computed(() => Array.from(this.requests().keys()));

  // Configuration statique
  private static readonly DEFAULT_CONFIG = new SpinnerConfig();
  static SPINNER_PROGRESS_CONFIG = Loading.DEFAULT_CONFIG;

  private spinnerRef?: MatDialogRef<Spinner>;

  constructor() {
    // Effet pour gérer l'ouverture/fermeture du spinner
    effect(() => {
      const hasRequests = this.isLoading();
      Promise.resolve().then(() => {
        if (hasRequests && !this.spinnerVisible()) {
          this.openSpinner();
        } else if (!hasRequests && this.spinnerVisible()) {
          this.closeSpinner();
        }
      });
    });
  }

  /**
   * Définit l'état de chargement
   */
  setLoading(loading: boolean, url: string, determinate: boolean = false): void {
    this.validateUrl(url);

    if (isPlatformBrowser(this.platformId)) {
      Promise.resolve().then(() => this._updateRequests(loading, url, determinate));
    } else {
      // SSR : synchrone (pas de Change Detection Angular)
      this._updateRequests(loading, url, determinate);
    }
  }

  private _updateRequests(loading: boolean, url: string, determinate: boolean): void {
    this.requests.update((currentMap) => {
      const newMap = new Map(currentMap);
      if (loading) {
        newMap.set(url, { url, determinate, timestamp: Date.now() });
      } else {
        newMap.delete(url);
      }
      return newMap;
    });
  }

  /* setLoading(loading: boolean, url: string, determinate: boolean = false): void {
    this.validateUrl(url);

    this.requests.update((currentMap) => {
      const newMap = new Map(currentMap);

      if (loading) {
        newMap.set(url, { url, determinate, timestamp: Date.now() });
      } else {
        newMap.delete(url);
      }

      return newMap;
    });
  } */

  /**
   * Ouvre le spinner
   */
  private openSpinner(config?: SpinnerConfig, determinate?: boolean): void {
    if (this.spinnerVisible()) return;

    const spinnerConfig = config || new SpinnerConfig();

    this.spinnerRef = this.dialog.open(Spinner, {
      disableClose: true,
      hasBackdrop: true,
      panelClass: 'loading-spinner-dialog-container',
      backdropClass: 'loading-spinner-backdrop-class',
      data: {
        spinnerConfig: config || new SpinnerConfig(),
        determinate: determinate ?? false,
      },
    });

    this.spinnerVisible.set(true);
  }

  /**
   * Ferme le spinner
   */
  private closeSpinner(): void {
    this.spinnerRef?.close();
    this.spinnerRef = undefined;
    this.spinnerVisible.set(false);
  }

  /**
   * Démarre manuellement le spinner
   */
  startManually(config?: SpinnerConfig, determinate?: boolean): void {
    this.openSpinner(config, determinate);
  }

  /**
   * Arrête manuellement le spinner
   */
  stopManually(): void {
    this.requests.set(new Map());
    this.closeSpinner();
  }

  /**
   * Vérifie si une URL spécifique est en chargement
   */
  isUrlLoading(url: string): boolean {
    return this.requests().has(url);
  }

  /**
   * Récupère les requêtes les plus anciennes
   */
  getOldestRequest(): LoadingRequest | undefined {
    const requests = Array.from(this.requests().values());
    return requests.sort((a, b) => a.timestamp - b.timestamp)[0];
  }

  /**
   * Nettoie les requêtes plus anciennes qu'un certain temps
   */
  cleanupOldRequests(maxAgeMs: number = 60000): void {
    const now = Date.now();

    this.requests.update((currentMap) => {
      const newMap = new Map();

      currentMap.forEach((request, url) => {
        if (now - request.timestamp < maxAgeMs) {
          newMap.set(url, request);
        }
      });

      return newMap;
    });
  }

  private validateUrl(url: string): void {
    if (isEmptyValue(url)) {
      throw new Error("L'URL de la requête est requise");
    }
  }
}

// config.service.ts
import { Injectable, inject } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppTranslateService } from '../translate/translate.service';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private destroy$ = new Subject<void>();

    // Utilisation de inject() au lieu du constructeur (optionnel, style Angular 21)
    private readonly router = inject(Router);
    private readonly titleService = inject(Title);
    private readonly translate = inject(TranslateService);

    constructor(
        public appTranslateService: AppTranslateService
        // Les autres dépendances peuvent être injectées ici ou avec inject()
    ) {}

    /**
     * Initialise la configuration de l'application
     */
    initialize(): void {
        this.initializeLanguage();
        this.initializeTitleTracking();
        this.initializeBodyStyles();
    }

    /**
     * Nettoie les abonnements (à appeler dans ngOnDestroy si nécessaire)
     */
    destroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    /**
     * Initialise la langue de l'application
     */
    private initializeLanguage(): void {
    try {
        // ✅ Obtenir la langue stockée
        const storedLanguage = this.appTranslateService.getDefaultLang();

        // ✅ Initialiser avec cette langue
        this.appTranslateService.getDefaultLang();


    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation de la langue:', error);

        // ✅ Fallback robuste
        try {
            this.appTranslateService.getDefaultLang( );
            console.warn('⚠️ Fallback à FR');
        } catch (fallbackError) {
            console.error('❌ Erreur lors du fallback:', fallbackError);
        }
    }
}


    /**
     * Configure le suivi du titre de la page
     */
    private initializeTitleTracking(): void {
        this.router.events
            .pipe(
                filter((event): event is ActivationEnd => event instanceof ActivationEnd),
                filter((event: ActivationEnd) => event.snapshot.firstChild === null),
                map((event: ActivationEnd) => event.snapshot.data),
                takeUntil(this.destroy$)
            )
            .subscribe({
                next: (data) => this.updateTitle(data['title']),
                error: (error) => console.error('Erreur lors du suivi du titre:', error)
            });
    }

    /**
     * Met à jour le titre de la page
     */
    private updateTitle(titleKey: string): void {
        if (!titleKey) {
            return;
        }

        this.translate.get(titleKey).pipe(
            takeUntil(this.destroy$)
        ).subscribe({
            next: (translation) => {
                if (translation && translation !== titleKey) {
                    this.titleService.setTitle(translation);
                }
            },
            error: (error) => {
                console.error(`Erreur de traduction pour la clé "${titleKey}":`, error);
                // Fallback au titre par défaut
                this.titleService.setTitle('Application');
            }
        });
    }

    /**
     * Initialise les styles du body
     */
    private initializeBodyStyles(): void {
        if (typeof document !== 'undefined') {
            document.body.style.overflowX = 'hidden';
        }
    }

    /**
     * Recharge la configuration
     */
    reload(): void {
        this.destroy();
        this.initialize();
    }
}

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatToolbar } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../../../../layouts/public/shared/services/authentification/authentification.service';
import { AppTranslateService, SupportedLanguage } from '../../../../services/translate/translate.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-private-layout-navbar',
  standalone: false,
  templateUrl: './private-layout-navbar.html',
  styleUrl: './private-layout-navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivateLayoutNavbar implements OnInit, OnDestroy {
  currentLang: SupportedLanguage = 'fr';
  currentDirection: 'rtl' | 'ltr' = 'ltr';
  flags: {
    sidebarOpened: boolean;
    isSmallScreen: boolean;
  } = {
    sidebarOpened: false,
    isSmallScreen: false,
  };

  userInfo: { fullName: string; email: string } = {
    fullName: ' ',
    email: ' ',
  };
  private readonly destroy$ = new Subject<void>();
  @Output() toggleSidebarEventEmitter = new EventEmitter<boolean>();

  @ViewChild('toolbar') toolbar!: MatToolbar;

  constructor(
    private authentificationService: AuthentificationService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public appTranslateService: AppTranslateService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.currentLang = this.appTranslateService.getCurrentLanguage();
    this.currentDirection = this.appTranslateService.getCurrentDirection();
    this.observeDirectionChanges();
    this.appTranslateService.currentLanguage
    .pipe(takeUntil(this.destroy$))
    .subscribe((lang) => {
      this.currentLang = lang;
      this.cdr.markForCheck();
    });

    this.getUser();
    this.breakpointObserver
    .observe(['(max-width: 767px)'])
    .pipe(takeUntil(this.destroy$))
    .subscribe((result) => {
      this.flags.sidebarOpened = !result.matches;
      this.flags.isSmallScreen = result.matches;
    });
  }

@HostBinding('attr.dir') get hostDir() {
  return this.currentDirection;
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar() {
    this.flags.sidebarOpened = !this.flags.sidebarOpened;
    this.toggleSidebarEventEmitter.emit();
  }

  goHome() {
    this.router.navigate(['/app']);
  }

  logout() {
    this.authentificationService.logout();
  }

  getUser() {
    const _getRcOrganismeControlLabel = (data: any) => {
      const getLabel = (startLabel: any, cuurentLang: any) => {
        return startLabel + cuurentLang.charAt(0).toUpperCase() + cuurentLang.slice(1);
      };
      return data[getLabel('org', this.appTranslateService.getCurrentLanguage())] || null;
    };
    this.userInfo.fullName = AuthentificationService.authenticatedUser?.username ?? '';
    this.userInfo.email = AuthentificationService.authenticatedUser?.email ?? '';
  }

 /*  useLanguage(lang: 'fr' | 'ar' | 'en') {
    this.currentLang = lang; // mettre à jour l'état
    this.appTranslateService.setLanguage(lang);
    // location.reload(); // plus besoin si ton service applique la traduction en direct
  } */

  protected readonly AppTranslateService = AppTranslateService;

  private observeDirectionChanges(): void {
  this.appTranslateService.direction
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (dir) => {
        this.currentDirection = dir;
        this.applyDirectionToDOM(dir);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('❌ Erreur:', error);
      }
    });
}

private applyDirectionToDOM(direction: 'rtl' | 'ltr'): void {
  // ✅ AppTranslateService gère déjà document.documentElement et body
  // On n'a besoin que des classes sur body pour le thème
  if (typeof document !== 'undefined') {
    if (direction === 'rtl') {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }
}

useLanguage(lang: SupportedLanguage): void {
  try {
    // Mettre à jour l'état
    this.currentLang = lang;

    // Définir la langue
    this.appTranslateService.setLanguage(lang);

    // Appliquer la direction
    const direction = this.appTranslateService.getCurrentDirection();
    this.applyDirectionToDOM(direction);
    this.currentDirection = direction;

    // Notifier le changement
    this.cdr.markForCheck();

    console.log(`📍 Langue: ${lang}, Direction: ${direction}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}
}

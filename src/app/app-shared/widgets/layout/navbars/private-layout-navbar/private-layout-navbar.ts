import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatToolbar } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../../../../layouts/public/shared/services/authentification/authentification.service';
import { AppTranslateService, SupportedLanguage } from '../../../../services/translate/translate.service';
import { Subject, takeUntil } from 'rxjs';
import { RequestObject } from '../../../../models';
import { ConstanteWs } from '../../../../constantes/constante-ws';
import { ResponseObject } from '../../../../models/ResponseObject';
import { SharedService } from '../../../../services/sharedWs/shared.service';
import { ToastService } from '../../../../services';
import { NOTIFICATION_MESSAGE } from '../../../../../layouts/private/pages/notification-message/notification-message-uri';

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

  userInfo: { id: number, fullName: string; email: string } = {
    id: 0,
    fullName: ' ',
    email: ' ',
  };

  //Notification 
  unread_notif: number | null = null;
  isNotifLoading = false;
  //Messages
  unread_msg: number | null = null;
  isMsgLoading = false;
  private readonly destroy$ = new Subject<void>();
  //@Output() toggleSidebarEventEmitter = new EventEmitter<boolean>();
  @Input() isSidebarOpen: boolean = true;
  @Output() isSidebarOpenChange = new EventEmitter<boolean>();
  @Output() languageChanged = new EventEmitter<SupportedLanguage>();
  @ViewChild('toolbar') toolbar!: MatToolbar;

  constructor(
    private authentificationService: AuthentificationService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public appTranslateService: AppTranslateService,
    private cdr: ChangeDetectorRef,
    private sharedService: SharedService,
    private toast: ToastService,

  ) { }

  ngOnInit(): void {
    this.currentLang = this.appTranslateService.getCurrentLanguage();
    this.currentDirection = this.appTranslateService.getCurrentDirection();
    //this.observeDirectionChanges();
    this.appTranslateService.currentLanguage
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.currentLang = lang;
        this.currentDirection = this.appTranslateService.getCurrentDirection();
        this.cdr.markForCheck();
      });

    this.appTranslateService.direction
      .pipe(takeUntil(this.destroy$))
      .subscribe((dir) => {

        this.currentDirection = dir;
        this.cdr.markForCheck();
      });
    this.getUser();

    this.breakpointObserver
      .observe(['(max-width: 767px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.flags.sidebarOpened = !result.matches;
        this.flags.isSmallScreen = result.matches;
        this.cdr.markForCheck();
      });
  }

  @HostBinding('attr.dir') get hostDir() {
    return this.currentDirection;
  }

  selectLanguage(lang: SupportedLanguage): void {

    this.languageChanged.emit(lang);
    this.appTranslateService.setLanguage(lang);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
    * Bascule l'état du sidebar (ouvert/fermé)
    */
  onToggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.isSidebarOpenChange.emit(this.isSidebarOpen);
    //this.toggleSidebarEventEmitter.emit(this.isSidebarOpen);
    this.cdr.markForCheck();
  }

  /* getHeaderClass(): string {
    return this.isSidebarOpen ? 'nxl-header sidebar-open' : 'nxl-header sidebar-closed';
  } */
  getHeaderClass() {
    return {
      'sidebar-open': this.isSidebarOpen,
      'sidebar-closed': !this.isSidebarOpen
    };
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
    this.userInfo.id = AuthentificationService.authenticatedUser?.id ?? 0;

    if (this.userInfo?.id) {
      this.countUnredNotif();
      this.countUnredMsg();
    }
  }

  /*  useLanguage(lang: 'fr' | 'ar' | 'en') {
     this.currentLang = lang; // mettre à jour l'état
     this.appTranslateService.setLanguage(lang);
     // location.reload(); // plus besoin si ton service applique la traduction en direct
   } */

  //protected readonly AppTranslateService = AppTranslateService;

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
    this.languageChanged.emit(lang);
    this.appTranslateService.setLanguage(lang);
  }
  protected readonly AppTranslateService = AppTranslateService;

  // Méthodes pour les notifications
  markAllAsRead(): void {
    // Implémentez la logique
  }

  markAsRead(event: Event): void {
    event.stopPropagation();
    // Implémentez la logique
  }

  removeNotification(event: Event): void {
    event.stopPropagation();
    // Implémentez la logique
  }

  viewAllNotifications(): void {
    // Implémentez la logique
  }

  countUnredNotif() {
    this.isNotifLoading = true;
    this.unread_notif = null;


    const request: RequestObject = <RequestObject>{
      uri: NOTIFICATION_MESSAGE.COUNT,
      params: {
        query: {
          codeTypeNotif: "NOTIF",
          idUserRec: this.userInfo.id,
        },
      },

      method: ConstanteWs._CODE_GET,
    };

    this.sharedService.commonWs(request).subscribe({
      next: (response: ResponseObject) => {
        if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
          this.isNotifLoading = false;
          this.unread_notif = response.payload ?? 0;
        } else {
          console.error(
            `Error in FicheAjoutModifProfilsComponent/getMenu, error code :: ${response.code}`,
          );
          this.toast.error();
        }
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error(`Error in FicheAjoutModifProfilsComponent/getMenu, error :: ${error}`);
        this.toast.error();
      },
    });
  }

  countUnredMsg() {
    this.isMsgLoading = true;
    this.unread_msg = null;


    const request: RequestObject = <RequestObject>{
      uri: NOTIFICATION_MESSAGE.COUNT,
      params: {
        query: {
          codeTypeNotif: "MSG",
          idUserRec: this.userInfo.id,
        },
      },

      method: ConstanteWs._CODE_GET,
    };

    this.sharedService.commonWs(request).subscribe({
      next: (response: ResponseObject) => {
        if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
          this.isMsgLoading = false;
          this.unread_msg = response.payload ?? 0;
        } else {
          console.error(
            `Error in FicheAjoutModifProfilsComponent/getMenu, error code :: ${response.code}`,
          );
          this.toast.error();
        }
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error(`Error in FicheAjoutModifProfilsComponent/getMenu, error :: ${error}`);
        this.toast.error();
      },
    });
  }

  goToListMessage(code: any) {
    this.router.navigate(['/app/notif-msg'], {
      state: { code }
    });
  }

  setAsRead(code: any) {
    console.log('set as read: ', code)
  };
}
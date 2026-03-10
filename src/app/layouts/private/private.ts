import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PrivateLayoutSidebar } from '../../app-shared/widgets/layout/private-layout-sidebar/private-layout-sidebar';
import { AuthentificationService } from '../public/shared/services/authentification/authentification.service';
import { AppTranslateService, SupportedLanguage } from '../../app-shared/services/translate/translate.service';
import { ToastService } from '../../app-shared/services/toast/toast.service';
import { Router } from '@angular/router';
import { SharedService } from '../../app-shared/services/sharedWs/shared.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { RequestObject } from '../../app-shared/models/RequestObject';
import { PRIVATELAYOUTURI } from './shared/constantes/common/private-layout.uri';
import { ConstanteWs } from '../../app-shared/constantes/constante-ws';
import { ResponseObject } from '../../app-shared/models/ResponseObject';
import { Menu } from '../../app-shared/models';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-private',
  standalone: false,
  templateUrl: './private.html',
  styleUrl: './private.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Private implements OnInit, OnDestroy  {
  listMenus: Menu[] = [];
  loading: boolean = true;
  isScrolling: boolean = false;
  isSmallScreen: boolean = false;

 currentLang: SupportedLanguage = 'fr';
 currentDirection: 'rtl' | 'ltr' = 'ltr';
 private readonly destroy$ = new Subject<void>();
  constructor(
    private authentificationService: AuthentificationService,
    private toast: ToastService,
    private router: Router,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private appTranslateService: AppTranslateService,
  ) {}

  ngOnInit(): void {
  this.currentDirection = this.appTranslateService.getCurrentDirection();
  this.currentLang = this.appTranslateService.getCurrentLanguage();
  this.cdr.markForCheck();

    this.breakpointObserver.observe(['(max-width: 767px)']).subscribe((result) => {
      this.isSmallScreen = result.matches;
    });
    //   langue
    this.appTranslateService.currentLanguage
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.currentLang = lang;
        this.cdr.markForCheck();
      });

    //   direction
    this.appTranslateService.direction
      .pipe(takeUntil(this.destroy$))
      .subscribe((dir) => {
        this.currentDirection = dir;
        this.cdr.markForCheck(); // Nécessaire avec OnPush
      });
    this.getMenu();

  }
 ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  getMenu() {
    let userinfo = this.authentificationService.getuserinfo();
    const request: RequestObject = <RequestObject>{
      // uri: PRIVATELAYOUTURI.SIDEBAR.MENU,
      uri: PRIVATELAYOUTURI.SIDEBAR.MENU,
      params: {
        query: {
          idProfil: userinfo['listProfiles'],
        },
      },
      method: ConstanteWs._CODE_GET,
    };
    this.sharedService.commonWs(request).subscribe({
      next: (response: ResponseObject) => {
        if (response.code == ConstanteWs._CODE_WS_SUCCESS) {
          this.listMenus = response.payload;
          this.cdr.detectChanges();
          console.log(this.listMenus);
        } else {
          console.error(`Error in PrivateLayoutComponent/getMenu, error code :: ${response.code}`);
          this.toast.error();
        }
      },
      error: (error) => {
        console.error(`Error in PrivateLayoutComponent/getMenu, error :: ${error}`);
        this.toast.error();
      },
    });
  }

  checkIfGoToUpBtnIsDisplayed(container: string): void {
    this.isScrolling = (document.getElementsByTagName(container).item(0)?.scrollTop ?? 0) > 20;
  }

  @ViewChild('privateLayoutSidebar') PrivateLayoutSidebar!: PrivateLayoutSidebar;
  onToggleSidebar(): void {
    if (this.isSmallScreen) {
      this.PrivateLayoutSidebar.sidebar.toggle();
    } else {
      this.PrivateLayoutSidebar.isSidebarExpanded = !this.PrivateLayoutSidebar.isSidebarExpanded;
    }
  }
}

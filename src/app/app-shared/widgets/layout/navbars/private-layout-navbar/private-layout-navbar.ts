import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatToolbar } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../../../../layouts/public/shared/services/authentification/authentification.service';
import { AppTranslateService,  AppLang  } from '../../../../services/translate/translate.service';
import { Subject, takeUntil } from 'rxjs';
import { isEmptyValue } from '../../../../tools';
import { Menu } from '../../../../models';

@Component({
  selector: 'app-private-layout-navbar',
  standalone: false,
  templateUrl: './private-layout-navbar.html',
  styleUrl: './private-layout-navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivateLayoutNavbar implements OnInit, OnDestroy  {
 protected readonly isEmptyValue = isEmptyValue;
  @Input() links: Menu[] = [];
  @Input() shortMenus: { icon: string; label: string }[] = [];
  @Input() menuTitle = '';
  @Input() menuSubtitle = '';
  userInfo: { fullName: string; email: string } = {
    fullName: ' ',
    email: ' ',
  };
  flags = {
    sidebarOpened: true,
    isSmallScreen: false
  };
    private timerId?: any;
    myDate: Date = new Date();

  @Output() toggleSidebarEventEmitter = new EventEmitter<boolean>();
  private readonly destroy$ = new Subject<void>();

  @ViewChild('toolbar') toolbar!: MatToolbar;
  currentLang: AppLang = 'fr';
  currentDirection: 'rtl' | 'ltr' = 'ltr';
  constructor(
    private authentificationService: AuthentificationService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public appTranslateService: AppTranslateService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
   this.currentLang = this.appTranslateService.getDefaultLang();
    this.currentDirection = this.appTranslateService.getDir();
    this.getUser();
    this.observeScreenSize();

  }
  @HostBinding('attr.dir') get hostDir() {
    return this.currentDirection;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onToggleSidebar(): void {
    this.flags.sidebarOpened = !this.flags.sidebarOpened;
    this.toggleSidebarEventEmitter.emit(this.flags.sidebarOpened);
  }


  isSidebarOpen: boolean = true;



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
      return data[getLabel('org', this.appTranslateService.getDefaultLang())] || null;
    };
    this.userInfo.fullName = AuthentificationService.authenticatedUser?.username ?? '';
    this.userInfo.email = AuthentificationService.authenticatedUser?.email ?? '';
  }

changeLanguage(lang: AppLang): void {
    this.currentLang = lang;
    this.appTranslateService.useLanguage(lang);
    this.currentDirection = this.appTranslateService.getDir();
    this.cdr.markForCheck();
  }

  protected readonly AppTranslateService = AppTranslateService;

private observeScreenSize(): void {
    this.breakpointObserver.observe(['(max-width: 767px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.flags.sidebarOpened = !result.matches;
        this.flags.isSmallScreen = result.matches;
        this.cdr.markForCheck();
      });
  }


}

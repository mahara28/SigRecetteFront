import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatToolbar } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../../../../layouts/public/shared/services/authentification/authentification.service';
import { AppTranslateService } from '../../../../services/translate/translate.service';

@Component({
  selector: 'app-private-layout-navbar',
  standalone: false,
  templateUrl: './private-layout-navbar.html',
  styleUrl: './private-layout-navbar.css',
})
export class PrivateLayoutNavbar implements OnInit {
  currentLang!: 'fr' | 'ar' | 'en';
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

  @Output() toggleSidebarEventEmitter = new EventEmitter<boolean>();

  @ViewChild('toolbar') toolbar!: MatToolbar;

  constructor(
    private authentificationService: AuthentificationService,
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public appTranslateService: AppTranslateService,
  ) {}

  ngOnInit(): void {
    this.currentLang = this.appTranslateService.getDefaultLang();
    this.getUser();
    this.breakpointObserver.observe(['(max-width: 767px)']).subscribe((result) => {
      this.flags.sidebarOpened = !result.matches;
      this.flags.isSmallScreen = result.matches;
    });
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
      return data[getLabel('org', this.appTranslateService.getDefaultLang())] || null;
    };
    this.userInfo.fullName = AuthentificationService.authenticatedUser?.username ?? '';
    this.userInfo.email = AuthentificationService.authenticatedUser?.email ?? '';
  }

  useLanguage(lang: 'fr' | 'ar' | 'en') {
    this.currentLang = lang; // mettre à jour l'état
    this.appTranslateService.useLanguage(lang);
    // location.reload(); // plus besoin si ton service applique la traduction en direct
  }

  protected readonly AppTranslateService = AppTranslateService;
}

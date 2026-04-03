import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
  OnDestroy,
  DoCheck,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDrawerMode, MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { Subject, Subscription, takeUntil } from 'rxjs';
//import { ThemeSection, ThemeOption } from './customizer-sidebar.model'; // ton interface ThemeSection/ThemeOption
//import { getCssVar } from '@appShared/tools/utils/cssVar';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { isEmptyValue } from '../../../tools';
import { CONFIG } from '../../../constantes/config';
import { DIRECTION } from '../../../constantes/Constantes';
import { AppTranslateService, Loading } from '../../../services';
import { getCssVar } from '../../../tools/utils/cssVar';
import { Menu } from '../../../models';
@Component({
  selector: 'app-private-layout-sidebar',
  standalone: false,
  templateUrl: './private-layout-sidebar.html',
  styleUrl: './private-layout-sidebar.css',
})
export class PrivateLayoutSidebar implements OnInit, OnDestroy {
  isEmptyValue = isEmptyValue;

  @ViewChild('sidebarContainer') sidebarContainer!: MatSidenavContainer;
  @ViewChild('sidebar') sidebar!: MatSidenav;
  private destroy$ = new Subject<void>();
  @Input() listMenus: Menu[] = [];
  expandedMenus = new Set<string>();
  isSmallScreen: boolean = false;
  onLoadingMenu: boolean = true;
  CONFIG = CONFIG;
  Direction = DIRECTION;
  mode!: MatDrawerMode;
  private breakpointSubscription!: Subscription;
  private readonly platformId = inject(PLATFORM_ID);
  @Input() isSidebarExpanded: boolean = true;
  @Input() isSidebarShowing: boolean = false;
  @Input() isSidebarOpen: boolean = true;
  constructor(
    public appTranslateService: AppTranslateService,
    private breakpointObserver: BreakpointObserver,
    private _loading: Loading,
    private router: Router,
    //private _changeRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initResponsive();
    this.initMenus();
   
  }

  // ================= RESPONSIVE =================
  private initResponsive(): void {
    this.breakpointObserver
      .observe(['(max-width: 767px)'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
        this.mode = this.isSmallScreen ? 'over' : 'side';

        // fermer sidebar sur mobile

        if (this.isSmallScreen) {
          this.sidebar?.close();
        } else {
          this.sidebar?.open();
        }
      });
  }

  // ================= MENUS =================
  private initMenus(): void {
    this.onLoadingMenu = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { listMenus } = changes;
    if (listMenus) {
      //this.listMenus = listMenus?.currentValue;
      this.listMenus = listMenus.currentValue ?? [];
      //if (this.listMenus) {
      this.onLoadingMenu = false;
      //}
    }
    if (changes['isSidebarOpen'] && this.sidebar) {
      if (this.isSidebarOpen) {
        this.sidebar.open();
      } else {
        this.sidebar.close();
      }
    }
  }

  // ================= SIDEBAR WIDTH =================
  get sidebarWidth(): string {
    if (isPlatformBrowser(this.platformId)) {
      return this.isSidebarExpanded ? CONFIG.PRIVATE_LAYOUT.sidebar.width : '64px';
    }
    return CONFIG.PRIVATE_LAYOUT.sidebar.width;
  }

  // ================= MENU EXPANSION =================
  toggle(menuId: string): void {
    this.expandedMenus.has(menuId)
      ? this.expandedMenus.delete(menuId)
      : this.expandedMenus.add(menuId);
  }

  isExpanded(menuId: string): boolean {
    return this.expandedMenus.has(menuId);
  }

  // ================= DESTROY =================
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /*  ngDoCheck() {
    this._changeRef.detectChanges();
  } */

  /*  ngOnDestroy() {
    if (!isEmptyValue(this.breakpointSubscription)) {
      this.breakpointSubscription.unsubscribe();
    }
  }

  get sidebarWidth(): string {
    if (isPlatformBrowser(this.platformId)) {
      return this.isSidebarExpanded ? CONFIG.PRIVATE_LAYOUT.sidebar.width : '64px';
    }
    return CONFIG.PRIVATE_LAYOUT.sidebar.width;
  } */

  protected readonly AppTranslateService = AppTranslateService;

}

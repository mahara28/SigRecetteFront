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
import { Subscription } from 'rxjs';
//import { ThemeSection, ThemeOption } from './customizer-sidebar.model'; // ton interface ThemeSection/ThemeOption
//import { getCssVar } from '@appShared/tools/utils/cssVar';
import { Menu } from '../../../models/Menu';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { isEmptyValue } from '../../../tools';
import { CONFIG } from '../../../constantes/config';
import { DIRECTION } from '../../../constantes/Constantes';
import { AppTranslateService, Loading } from '../../../services';
import { getCssVar } from '../../../tools/utils/cssVar';
@Component({
  selector: 'app-private-layout-sidebar',
  standalone: false,
  templateUrl: './private-layout-sidebar.html',
  styleUrl: './private-layout-sidebar.css',
})
export class PrivateLayoutSidebar {
  isEmptyValue = isEmptyValue;

  @ViewChild('sidebarContainer') sidebarContainer!: MatSidenavContainer;
  @ViewChild('sidebar') sidebar!: MatSidenav;

  @Input() listMenus: Menu[] = [];

  isSmallScreen: boolean = false;
  onLoadingMenu: boolean = true;
  CONFIG = CONFIG;
  Direction = DIRECTION;

  isSidebarExpanded: boolean = true;
  isSidebarShowing: boolean = false;
  mode!: MatDrawerMode;
  private breakpointSubscription!: Subscription;
  private readonly platformId = inject(PLATFORM_ID);

  constructor(
    public appTranslateService: AppTranslateService,
    private breakpointObserver: BreakpointObserver,
    private _loading: Loading,
    private router: Router,
    private _changeRef: ChangeDetectorRef,
  ) {}

  expandedMenus = new Set<string>();

  ngOnInit(): void {
    this.breakpointSubscription = this.breakpointObserver
      .observe(['(max-width: 767px)'])
      .subscribe((result) => {
        this.isSmallScreen = result.matches;
        this.mode = this.isSmallScreen ? 'over' : 'side';
      });
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
  }

  ngDoCheck() {
    this._changeRef.detectChanges();
  }

  ngOnDestroy() {
    if (!isEmptyValue(this.breakpointSubscription)) {
      this.breakpointSubscription.unsubscribe();
    }
  }

  get sidebarWidth(): string {
    if (isPlatformBrowser(this.platformId)) {
      return this.isSidebarExpanded ? CONFIG.PRIVATE_LAYOUT.sidebar.width : '64px';
    }
    return CONFIG.PRIVATE_LAYOUT.sidebar.width;
  }

  protected readonly AppTranslateService = AppTranslateService;

  toggle(menuId: string): void {
    if (this.expandedMenus.has(menuId)) {
      this.expandedMenus.delete(menuId);
    } else {
      this.expandedMenus.add(menuId);
    }
  }

  isExpanded(menuId: string): boolean {
    return this.expandedMenus.has(menuId);
  }
}

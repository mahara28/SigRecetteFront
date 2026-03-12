import { Component, effect, inject, input, Input, OnInit, SimpleChanges } from '@angular/core';
import { isEmptyValue } from '../../../../tools';
import { AppTranslateService, ToastService } from '../../../../services';
import { Router } from '@angular/router';
import { AuthentificationService } from '../../../../../layouts/public/shared/services/authentification/authentification.service';
import { SharedService } from '../../../../services/sharedWs/shared.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { isSomeInputsChanged } from '../../../../tools/utils/ng-changes';
import { DIRECTION } from '../../../../constantes/Constantes';
import { SessionStorageService } from '../../../../services/SessionStorage/session-storage.service';

interface Menu {
  id: string;
  code?: string;
  icon?: string;
  router?: string;
  desFr?: string;
  desEn?: string;
  checked?: number;
  isActive?: number;
  idParent?: string;
  desAr?: string;
  listSousMenu?: Menu[];
}

interface FlatMenu extends Menu {
  id: string;
  icon?: string;
  path?: string;
  tooltip?: string;
  title?: string;
  label?: string;
  externalLink?: boolean;
  listSousMenu?: Menu[];
  idAdmFonc: string;
  expandable: boolean;
  level: number;
  isWrite: boolean;
}

@Component({
  selector: 'app-flat-menu-list',
  standalone: false,
  templateUrl: './flat-menu-list.html',
  styleUrl: './flat-menu-list.css',
})
export class FlatMenuList implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthentificationService);
  private sharedService = inject(SharedService);
  private toast = inject(ToastService);
  private sessionStorage = inject(SessionStorageService);

  isEmptyValue = isEmptyValue;
  listMenus = input<Menu[]>([]);
  isSidebarExpanded = input<boolean>(true);
  isSidebarShowing = input<boolean>(false);
  readonly selectedMenuKey = 'selectedMenu';
  readonly expandedMenuKey = 'expandedMenu';
  // selectedMenuKey = CONFIG.LOCAL_STORAGE_KEYS.SELECTED_MENU;

  private _transformer = (node: Menu, level: number): FlatMenu => {
    return {
      id: node.id,
      icon: node.icon,
      path: node.router,
      tooltip: node.desFr,
      title: this.appTranslateService.getDefaultLang() === 'fr' ? node.desFr : node.desAr,
      externalLink: !!(node.router && node.router.includes('http')),
      expandable: !isEmptyValue(node.listSousMenu) && node.listSousMenu!.length > 0,
      level,
      isWrite: node.checked === 1,
      idAdmFonc: node.code ?? '',
      listSousMenu: node.listSousMenu,
    };
  };

  treeControl = new FlatTreeControl<FlatMenu>(
    (node) => node.level,
    (node) => node.expandable,
  );

  treeFlattener = new MatTreeFlattener<Menu, FlatMenu>(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.listSousMenu ?? [],
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatMenu): boolean => node.expandable;
  private appTranslateService = inject(AppTranslateService);
  constructor() {
    // Angular 21: effect() remplace ngOnChanges pour réagir aux input signals
    effect(() => {
      const menus = this.listMenus();
      if (menus) {
        this.dataSource.data = menus;
        this.initExpandedItem();
      }
    });
  }

  ngOnInit(): void {}

  getNodeHeight(menuItem: FlatMenu): string {
    return this.isSidebarExpanded() ||
      this.isSidebarShowing() ||
      (!this.isSidebarExpanded() && menuItem.level === 0)
      ? '100%'
      : '0';
  }

  private getParentNode(node: FlatMenu): FlatMenu | null {
    if (node.level < 1) return null;

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
      if (currentNode.level < node.level) {
        return currentNode;
      }
    }
    return null;
  }

  getMenuStyle(menuItem?: FlatMenu): Record<string, string> {
    const getMargin = (niv: number): Record<string, string> => {
      const name =
        this.appTranslateService.getDir() === DIRECTION.LTR ? 'padding-left' : 'padding-right';
      return { [name]: niv * 1.875 + 'rem' };
    };

    const labelLength = menuItem?.label?.length ?? 0;
    const tstyle: Record<string, string> = isEmptyValue(labelLength)
      ? { height: '56px' }
      : Math.round(labelLength / 24) + 1 > 2
        ? { height: '100%', 'padding-top': '5px', 'padding-bottom': '5px' }
        : { height: '56px' };

    return !isEmptyValue(menuItem?.level) ? { ...tstyle, ...getMargin(menuItem!.level) } : tstyle;
  }

  onMenuClick(menu: FlatMenu): void {
    // Collapse siblings
    this.treeControl.dataNodes
      .filter(
        (node) =>
          node !== menu &&
          node.level === menu.level &&
          this.getParentNode(node) === this.getParentNode(menu),
      )
      .forEach((node) => this.treeControl.collapseDescendants(node));

    // Update active class
    Array.from(document.getElementsByClassName('menu-item active')).forEach((node) =>
      (node as HTMLElement).classList.remove('active'),
    );
    document.querySelector(`[menu-id="${menu.id}"]`)?.classList.add('active');

    // Navigation
    if (!isEmptyValue(menu.path)) {
      if (menu.externalLink) {
        window.open(menu.path, '_blank');
      } else {
        this.router.navigateByUrl(menu.path!);
        this.sessionStorage.setItem('currPermission', menu.isWrite.toString());
      }
    }
  }

  setToSessionStorage(key: string, value: any) {
    this.sessionStorage.setItem(key, value);
  }

  getFromSessionStorage(key: string) {
    return this.sessionStorage.getItem(key);
  }

  private initExpandedItem(): void {
    //  const expandedMenuValue = this.getFromSessionStorage(this.expandedMenuKey);
    // const expandedMenuArray = expandedMenuValue.split(',').map(Number);
    // const selectedMenuValue = this.getFromSessionStorage(this.selectedMenuKey);
    //     for (let i = 0; i < expandedMenuArray.length; i++) {
    //         const menuIdToExpand = expandedMenuArray[i];
    //         const menuToExpand = this.treeControl.dataNodes.find(m => Number(m.id) === menuIdToExpand);
    //         if (menuToExpand) {
    //             this.treeControl.expand(menuToExpand);
    //         }
    //     }
  }
}

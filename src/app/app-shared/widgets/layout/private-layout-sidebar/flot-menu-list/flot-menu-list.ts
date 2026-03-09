import { Component, inject, input, OnInit } from '@angular/core';
import { isEmptyValue } from '../../../../tools';

import { Router } from '@angular/router';
import { AppTranslateService } from '../../../../services';

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
  externalLink?: boolean;
  tooltip: string;
  idFonc: string;
  listSousMenu?: Menu[];
}
@Component({
  selector: 'app-flot-menu-list',
  standalone: false,
  templateUrl: './flot-menu-list.html',
  styleUrl: './flot-menu-list.css',
})
export class FlotMenuList implements OnInit {
  private router = inject(Router);
  private appTranslateService = inject(AppTranslateService);

  isEmptyValue = isEmptyValue;
  listMenus = input<Menu[]>([]);
  isSidebarExpanded = input<boolean>(true);
  isSidebarShowing = input<boolean>(false);

  ngOnInit(): void {}

  hasSubMenu(menuItem: Menu) {
    return (
      !isEmptyValue(menuItem['listSousMenu']) &&
      Array.isArray(menuItem['listSousMenu']) &&
      menuItem['listSousMenu'].length !== 0
    );
  }

  _setMenuStyle(idFonc: any) {
    Array.from(document.getElementsByClassName('menu-item active')).forEach((node) =>
      node['classList']?.remove('active'),
    );
    document.querySelector(`[menu-id= "${idFonc}"]`)?.classList.add('active');
  }

  navigate(menu: Menu) {
    if (!isEmptyValue(menu.router)) {
      const isExternal = menu.router!.startsWith('http');
      if (isExternal) {
        window.open(menu.router, '_blank');
      } else {
        this.router.navigateByUrl(menu.router!);
      }
    }
  }

  getMenuStyle(menuItem?: any) {
    return isEmptyValue(menuItem?.title?.length)
      ? { height: '56px' }
      : Math.round(menuItem.title.length / 24) + 1 > 2
        ? {
            height: '100%',
            'padding-top': '5px',
            'padding-bottom': '5px',
          }
        : { height: '56px' };
  }

  getLabel(menu: Menu): string {
    const lang = AppTranslateService.getDefaultLang();
    if (lang === 'fr') return menu.desFr ?? '';
    if (lang === 'ar') return menu.desAr ?? menu.desFr ?? '';
    if (lang === 'en') return menu.desEn ?? menu.desFr ?? '';
    return menu.desFr ?? '';
  }
}

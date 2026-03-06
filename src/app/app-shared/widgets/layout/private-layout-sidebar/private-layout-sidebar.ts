import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
  OnDestroy,
  DoCheck,
} from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatDrawerMode, MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
//import { ThemeSection, ThemeOption } from './customizer-sidebar.model'; // ton interface ThemeSection/ThemeOption
//import { getCssVar } from '@appShared/tools/utils/cssVar';
import { Menu } from '../../../models/Menu';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-private-layout-sidebar',
  standalone: false,
  templateUrl: './private-layout-sidebar.html',
  styleUrl: './private-layout-sidebar.css',
})
export class PrivateLayoutSidebar {
  @Input() menus: Menu[] = [];

  expandedMenus = new Set<string>();

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

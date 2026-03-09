import { Component, Input } from '@angular/core';
import { Menu } from '../../../../models';
import { isEmptyValue } from '../../../../tools';

@Component({
  selector: 'app-mat-menu-content',
  standalone: false,
  templateUrl: './mat-menu-content.html',
  styleUrl: './mat-menu-content.css',
})
export class MatMenuContent {
  @Input() submenus: Menu[] = [];
  isEmptyValue = isEmptyValue;

  constructor() {}

  ngOnInit(): void {}

  hasSubMenu(menuItem: Menu) {
    return (
      !isEmptyValue(menuItem.listSousMenu) &&
      Array.isArray(menuItem.listSousMenu) &&
      menuItem.listSousMenu.length !== 0
    );
  }
}

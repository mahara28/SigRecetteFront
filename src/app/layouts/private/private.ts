import { Component } from '@angular/core';
import { PrivateLayoutSidebar } from "../../app-shared/widgets/layout/private-layout-sidebar/private-layout-sidebar";
import { APP_MENU } from '../../app-shared/tools/menu.config';

@Component({
  selector: 'app-private',
  imports: [PrivateLayoutSidebar],
  templateUrl: './private.html',
  styleUrl: './private.css',
})
export class Private {
   menus = APP_MENU;

}

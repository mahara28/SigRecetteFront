import { Component } from '@angular/core';
import { PrivateLayoutSidebar } from "../../app-shared/widgets/layout/private-layout-sidebar/private-layout-sidebar";
import { APP_MENU } from '../../app-shared/tools/menu.config';
import { PrivateLayoutNavbar } from "../../app-shared/widgets/layout/navbars/private-layout-navbar/private-layout-navbar";
import { AuthentificationRoutingModule } from "../public/pages/authentification/authentification-routing.module";
import { Outlet } from "../../app-shared/widgets/outlet/outlet";

@Component({
  selector: 'app-private',
  imports: [PrivateLayoutSidebar, PrivateLayoutNavbar, AuthentificationRoutingModule, Outlet],
  templateUrl: './private.html',
  styleUrl: './private.css',
})
export class Private {
   menus = APP_MENU;

}

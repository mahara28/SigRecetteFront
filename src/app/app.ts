import { AfterViewInit, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { APP_MENU } from './app-shared/tools/menu.config';
import { PrivateLayoutSidebar } from "./app-shared/widgets/layout/private-layout-sidebar/private-layout-sidebar";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { Private } from "./layouts/private/private";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgApexchartsModule, PrivateLayoutSidebar,
    TranslateModule, Private],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App   {
  protected readonly title = signal('sigFront');
   menus = APP_MENU;


}

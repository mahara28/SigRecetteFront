import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { APP_MENU } from './app-shared/tools/menu.config';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutsModule } from './layouts/layouts-module';
import { DIRECTION } from './app-shared/constantes/Constantes';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sigFront');
  protected readonly DIRECTION = DIRECTION;

  constructor(
    private translate: TranslateService
  ) {
    translate.addLangs(['ar', 'fr']);
    translate.setDefaultLang('fr');

    const browserLang = translate.getBrowserLang();

    translate.use(browserLang?.match(/ar|fr/) ? browserLang : 'fr');
  }
  menus = APP_MENU;

  
}

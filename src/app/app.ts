import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { APP_MENU } from './app-shared/tools/menu.config';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutsModule } from './layouts/layouts-module';
import { DIRECTION } from './app-shared/constantes/Constantes';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgApexchartsModule, LayoutsModule,
    TranslateModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('sigFront');
  protected readonly DIRECTION = DIRECTION;

  constructor(
    //public configService: ConfigService,
    //private appTranslateService: AppTranslateService,
    //private idleService: IdleService 
  ) {
  }

  //protected readonly AppTranslateService = AppTranslateService;
  menus = APP_MENU;

  /* ngOnInit(): void {
    this.configService.initialize();
    this.appTranslateService.useLanguage();
  } */
}

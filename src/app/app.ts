import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { APP_MENU } from './app-shared/tools/menu.config';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutsModule } from './layouts/layouts-module';
import { DIRECTION } from './app-shared/constantes/Constantes';
import { AppTranslateService, ConfigService } from './app-shared/services';
import { AppSharedModule } from './app-shared/app-shared-module';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutsModule, AppSharedModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('sigFront');
  protected readonly DIRECTION = DIRECTION;
  protected readonly AppTranslateService = AppTranslateService;

  constructor(public configService: ConfigService,
    private appTranslateService: AppTranslateService,) { }

  ngOnInit(): void {
    this.configService.initialize();
    this.appTranslateService.useLanguage();
  }


  //menus = APP_MENU;

}

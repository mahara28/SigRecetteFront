import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { APP_MENU } from './app-shared/tools/menu.config';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutsModule } from './layouts/layouts-module';
import { DIRECTION } from './app-shared/constantes/Constantes';
import { AppTranslateService } from './app-shared/services';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  protected readonly title = signal('sigFront');
  protected readonly DIRECTION = DIRECTION;

  constructor(
    private appTranslate: AppTranslateService
  ) {

  }

   ngOnInit(): void {
    // Récupère la langue sauvegardée ou 'fr' par défaut
    const savedLang = localStorage.getItem('lang') as  'fr' | 'ar' | null;
     if (savedLang && ['fr', 'ar'].includes(savedLang)) {
      this.appTranslate.setLanguage(savedLang);
    } else {
      // Défaut à 'fr' si rien n'est trouvé
      this.appTranslate.setLanguage('fr');
      localStorage.setItem('lang', 'fr');
    }
  }
  menus = APP_MENU;


}

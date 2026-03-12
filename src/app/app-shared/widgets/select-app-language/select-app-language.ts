import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { AppTranslateService } from '../../services/translate/translate.service';


@Component({
  selector: 'mc-select-app-language',
  imports: [],
  templateUrl: './select-app-language.html',
  styleUrl: './select-app-language.css',
})
export class SelectAppLanguage implements OnInit {
    options = [
        {title: 'ع', code: 'ar'},
        {title: 'Fr', code: 'fr'},
        {title: 'En', code: 'en'},
    ];

    constructor(
        public translate: TranslateService,
        private AppTranslateService: AppTranslateService
    ) {
    }

    ngOnInit(): void {
    }


    get optionsList() {
        return this.options.filter(_ => _.code != this.AppTranslateService.getDefaultLang());
    }


    useLanguage(lang: 'fr' | 'ar' ) {
        this.AppTranslateService.getDefaultLang();
        location.reload();
    }
}


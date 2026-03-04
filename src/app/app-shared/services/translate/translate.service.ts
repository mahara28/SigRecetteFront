import { Inject, Injectable, InjectionToken } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { DateAdapter } from '@angular/material/core';
import { take } from 'rxjs/operators';
import { DIRECTION } from '../../constantes/Constantes';


@Injectable({
  providedIn: 'root',
})
export class AppTranslateService {
  private static readonly KEY = 'LANG';

  constructor(
    @Inject(TranslateService) private _translate: TranslateService,
    private dateAdapter: DateAdapter<any>
  ) {
    this.useLanguage(); // applique la langue par défaut au démarrage
  }

  setDefaultLang(lang: 'fr' | 'ar' | 'en'): void {
    this._translate.use(lang);
    this._translate.setDefaultLang(lang);
    window.localStorage.setItem(AppTranslateService.KEY, lang);
    this.setDirection();
  }

  getDefaultLang(): 'fr' | 'ar' | 'en' {
    return (window.localStorage.getItem(AppTranslateService.KEY) as 'fr' | 'ar' | 'en') ?? 'fr';
  }

  static getDefaultLang(): 'fr' | 'ar' | 'en' {
    return (window.localStorage.getItem(AppTranslateService.KEY) as 'fr' | 'ar' | 'en') ?? 'fr';
  }

  useLanguage(language?: 'fr' | 'ar' | 'en'): void {
    const lang = language || this.getDefaultLang();
    const momentLocale = lang === 'ar' ? 'ar-tn' : lang;
    moment.locale(momentLocale);
    this.dateAdapter.setLocale(momentLocale);
    this.setDefaultLang(lang);
  }

  getDir(): 'rtl' | 'ltr' {
    return this.getDefaultLang() === 'ar' ? DIRECTION.RTL : DIRECTION.LTR;
  }

  static getDir(): 'rtl' | 'ltr' {
    return AppTranslateService.getDefaultLang() === 'ar' ? DIRECTION.RTL : DIRECTION.LTR;
  }

  private setDirection(): void {
    document.querySelector('html')?.setAttribute('dir', this.getDir());
  }

  getByKey(key: string): string {
    return this._translate.instant(key);
  }

  getByObject(keyObject: any = {}): Record<string, any> {
    let result: Record<string, any> = {};
    this._translate.get(keyObject).pipe(take(1)).subscribe(obj => result = obj);
    return result;
  }
}

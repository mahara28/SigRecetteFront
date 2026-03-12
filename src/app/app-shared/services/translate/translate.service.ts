
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter } from '@angular/material/core';
import * as moment from 'moment';
import { DIRECTION } from '../../constantes/Constantes';

export type AppLang = 'fr' | 'ar' | 'en';


@Injectable({
  providedIn: 'root',
})
export class AppTranslateService {


  private static readonly STORAGE_KEY = 'lang';


  constructor(
     private translate: TranslateService,
    private dateAdapter: DateAdapter<any>
  ) {
    this.initLanguage();
  }
/**
   * Initialisation de la langue au démarrage
   */

  private initLanguage(): void {

    const lang = this.getDefaultLang();

    this.translate.setDefaultLang('fr');
    this.translate.use(lang);

    this.setLocale(lang);
    this.setDirection(lang);
  }
 /**
   * Changer la langue
   */
  useLanguage(language?: AppLang): void {

    const lang = language ?? this.getDefaultLang();

    localStorage.setItem(AppTranslateService.STORAGE_KEY, lang);

    this.translate.use(lang);

    this.setLocale(lang);
    this.setDirection(lang);
  }

  /**
   * Retourne la langue stockée
   */
  getDefaultLang(): AppLang {

    const lang = localStorage.getItem(AppTranslateService.STORAGE_KEY) as AppLang;

    return lang ?? 'fr';
  }

  static getDefaultLang(): AppLang {

    const lang = localStorage.getItem(AppTranslateService.STORAGE_KEY) as AppLang;

    return lang ?? 'fr';
  }

  /**
   * Configuration moment + datepicker
   */
  private setLocale(lang: AppLang): void {

    const locale = lang === 'ar' ? 'ar-tn' : lang;

    moment.locale(locale);

    this.dateAdapter.setLocale(locale);
  }

  /**
   * Gestion direction RTL/LTR
   */
  private setDirection(lang: AppLang): void {

    const dir = lang === 'ar' ? DIRECTION.RTL : DIRECTION.LTR;

    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', lang);
  }

  /**
   * Retourne direction actuelle
   */
  getDir(): 'rtl' | 'ltr' {

    return this.getDefaultLang() === 'ar'
      ? DIRECTION.RTL
      : DIRECTION.LTR;
  }

  static getDir(): 'rtl' | 'ltr' {

    return AppTranslateService.getDefaultLang() === 'ar'
      ? DIRECTION.RTL
      : DIRECTION.LTR;
  }

  /**
   * Traduction instantanée
   */
  getByKey(key: string): string {

    return this.translate.instant(key);
  }

  /**
   * Traduction objet
   */
  getByObject(keys: string[] = []) {
  return this.translate.get(keys);
}
}

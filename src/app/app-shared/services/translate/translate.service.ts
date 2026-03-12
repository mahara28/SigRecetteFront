
import {
  Inject,
  Injectable,
  LOCALE_ID,
  PLATFORM_ID,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';
import { DateAdapter } from '@angular/material/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { KeyObject } from 'crypto';


export type SupportedLanguage = 'ar' | 'fr' | 'en';


export const DIRECTION = {
  RTL: 'rtl',
  LTR: 'ltr',
} as const;


export const LANGUAGES_CONFIG: Record<SupportedLanguage, { name: string; dir: 'rtl' | 'ltr'; locale: string }> = {
  ar: {
    name: 'العربية',
    dir: 'rtl',
    locale: 'ar-tn',
  },
  fr: {
    name: 'Français',
    dir: 'ltr',
    locale: 'fr',
  },
  en: {
    name: 'English',
    dir: 'ltr',
    locale: 'en',
  },
};


@Injectable({
  providedIn: 'root',
})
export class AppTranslateService {


  private static readonly STORAGE_KEY = 'lang';
  private static readonly DEFAULT_LANGUAGE: SupportedLanguage = 'fr';

  private currentLanguage$ = new BehaviorSubject<SupportedLanguage>(
    this.getStoredLanguage()
  );

  private direction$ = new BehaviorSubject<'rtl' | 'ltr'>(
    this.getDirection(this.getStoredLanguage())
  );

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(LOCALE_ID) private localeId: string,
    private translateService: TranslateService,
    private dateAdapter: DateAdapter<any>
  ) {
    this.initializeLanguage();
  }


  get currentLanguage(): Observable<SupportedLanguage> {
    return this.currentLanguage$.asObservable();
  }

  get direction(): Observable<'rtl' | 'ltr'> {
    return this.direction$.asObservable();
  }

  getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguage$.getValue();
  }

  getCurrentDirection(): 'rtl' | 'ltr' {
    return this.direction$.getValue();
  }


  getCurrentLanguageConfig() {
    return LANGUAGES_CONFIG[this.getCurrentLanguage()];
  }

  isArabic(): boolean {
    return this.getCurrentLanguage() === 'ar';
  }

  isRTL(): boolean {
    return this.getCurrentDirection() === 'rtl';
  }


  setLanguage(lang: SupportedLanguage): void {
    if (!this.isSupportedLanguage(lang)) {
      console.warn(`Langue non supportée: ${lang}`);
      return;
    }

    // Appliquer la langue
    this.translateService.use(lang);
    this.translateService.setDefaultLang(lang);


    // Sauvegarder en localStorage
    this.saveLanguageToStorage(lang);

    // Configurer moment.js
    this.configureMomentLocale(lang);

    // Configurer DateAdapter
    this.configureDateAdapter(lang);

    // Mettre à jour la direction du document
    this.updateDocumentDirection(lang);

    // Notifier les observables
    this.currentLanguage$.next(lang);
    this.direction$.next(this.getDirection(lang));
  }

  /**
   * Bascule entre l'arabe et le français
   */
  toggleLanguage(): void {
    const currentLang = this.getCurrentLanguage();
    const newLang: SupportedLanguage = currentLang === 'ar' ? 'fr' : 'ar';
    this.setLanguage(newLang);
  }


  getByKey(key: string): string {
    return this.translateService.instant(key);
  }

  /**
   * Obtient une traduction instantanée avec paramètres
   */
  getByKeyWithParams(key: string, params: Record<string, any>): string {
    return this.translateService.instant(key, params);
  }

  /**
   * Obtient un objet de traductions
   */
 getByObject(
  keyObject: string | string[] | Record<string, any>
): Record<string, any> {
  let result: Record<string, any> = {};
  this.translateService
    .get(keyObject as string | string[])  // ← Cast nécessaire
    .pipe(take(1))
    .subscribe((obj) => (result = obj));
  return result;
}

  /**
   * Obtient les traductions de manière asynchrone
   */
  getTranslations$(keys: string[]): Observable<Record<string, string>> {
    return this.translateService.get(keys);
  }

  /**
   * Traduit une clé de manière asynchrone
   */
  translate$(key: string): Observable<string> {
    return this.translateService.get(key);
  }

  getSupportedLanguages(): Array<{ code: SupportedLanguage; config: typeof LANGUAGES_CONFIG.ar }> {
    return Object.entries(LANGUAGES_CONFIG).map(([code, config]) => ({
      code: code as SupportedLanguage,
      config,
    }));
  }

  isSupportedLanguage(lang: any): lang is SupportedLanguage {
    return Object.keys(LANGUAGES_CONFIG).includes(lang);
  }


  getLanguageName(lang: SupportedLanguage, inLanguage: SupportedLanguage = 'fr'): string {
    if (inLanguage === 'ar') {
      return { ar: 'العربية', fr: 'الفرنسية', en: 'الإنجليزية' }[lang];
    }
    return { ar: 'Arabe', fr: 'Français', en: 'Anglais' }[lang];
  }

  private initializeLanguage(): void {
    const lang = this.getStoredLanguage();
    this.setLanguage(lang);
  }


  private getStoredLanguage(): SupportedLanguage {
    if (!isPlatformBrowser(this.platformId)) {
      return AppTranslateService.DEFAULT_LANGUAGE;
    }

    const stored = window.localStorage.getItem(AppTranslateService.STORAGE_KEY) as SupportedLanguage;
    return this.isSupportedLanguage(stored) ? stored : AppTranslateService.DEFAULT_LANGUAGE;
  }

  /**
   * Sauvegarde la langue en localStorage
   */
  private saveLanguageToStorage(lang: SupportedLanguage): void {
    if (isPlatformBrowser(this.platformId)) {
      window.localStorage.setItem(AppTranslateService.STORAGE_KEY, lang);
    }
  }

  /**
   * Obtient la direction pour une langue
   */
  private getDirection(lang: SupportedLanguage): 'rtl' | 'ltr' {
    return LANGUAGES_CONFIG[lang].dir;
  }

  /**
   * Configure moment.js pour la langue
   */
  private configureMomentLocale(lang: SupportedLanguage): void {
    const locale = LANGUAGES_CONFIG[lang].locale;
    moment.locale(locale);
  }

  /**
   * Configure DateAdapter pour la langue
   */
  private configureDateAdapter(lang: SupportedLanguage): void {
    const locale = LANGUAGES_CONFIG[lang].locale;
    this.dateAdapter.setLocale(locale);
  }

  /**
   * Met à jour la direction du document HTML
   */
 /*  private updateDocumentDirection(lang: SupportedLanguage): void {
    const direction = LANGUAGES_CONFIG[lang].dir;
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.dir = direction;
      document.documentElement.lang = lang;
      document.body.dir = direction;
    }
  } */


  private updateDocumentDirection(lang: SupportedLanguage): void {
  const direction = LANGUAGES_CONFIG[lang].dir;
  if (isPlatformBrowser(this.platformId)) {
    // ✅ Appliquer sur <html>
    document.documentElement.dir = direction;
    document.documentElement.lang = lang;

    // ✅ Appliquer sur <body>
    document.body.dir = direction;

    // ✅ Classes sur <body> pour le thème Nxl
    if (direction === 'rtl') {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }
}
  /**
   * Obtient la langue stockée (statique)
   */
  static getStoredLanguage(): SupportedLanguage {
    if (typeof window === 'undefined') {
      return this.DEFAULT_LANGUAGE;
    }
    const stored = window.localStorage.getItem(this.STORAGE_KEY) as SupportedLanguage;
    return ['ar', 'fr', 'en'].includes(stored) ? stored : this.DEFAULT_LANGUAGE;
  }

  /**
   * Obtient la direction stockée (statique)
   */
  static getStoredDirection(): 'rtl' | 'ltr' {
    const lang = this.getStoredLanguage();
    return LANGUAGES_CONFIG[lang].dir;
  }
}

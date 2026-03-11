import { FormGroup, AbstractControl } from '@angular/forms';
import { ToastService } from '../../services';
import { SimpleChanges } from '@angular/core';

// ################################################
// # Type Guards & Validation Functions
// ################################################

/**
 * Vérifie si une valeur est vide
 * @param val Valeur à vérifier
 * @returns true si la valeur est vide (null, undefined, chaîne vide, objet vide)
 */
export function isEmptyValue(val: any): boolean {
  if (val === null || val === undefined) return true;
  if (typeof val === 'string') return val.trim() === '';
  if (typeof val === 'object') return Object.keys(val).length === 0;
  return false;
}

/**
 * Vérifie si un objet est vide
 * @param obj Objet à vérifier
 * @returns true si l'objet est vide ou null/undefined
 */
export function isEmptyObject(obj: Record<string, any> | null | undefined): boolean {
  return (
    obj === null ||
    typeof obj === 'undefined' ||
    isEmptyValue(Object.entries(obj))
  );
}
export function isInputChanged(changes: SimpleChanges | any, inputName: string): boolean {
  return changes && changes.hasOwnProperty(inputName) && !changes[inputName].firstChange;
}

/**
 * Vérifie si au moins un des inputs spécifiés a changé
 * @param changes SimpleChanges reçu dans ngOnChanges
 * @param inputNames Tableau des noms d'inputs à vérifier
 * @returns true si au moins un des inputs a changé
 *
 * @example
 * isSomeInputsChanged(changes, ['min', 'max']) // true si min ou max a changé
 */

export function isSomeInputsChanged(
  changes: SimpleChanges,
  inputNames: string[]
): boolean {
  return inputNames.some((inputName) => isInputChanged(changes, inputName));
}
/**
 * Vérifie si une valeur est un nombre
 * @param value Valeur à vérifier
 * @returns true si la valeur est un nombre
 */
export function isNumber(value: any): boolean {
  return !isNaN(parseFloat(value)) && isFinite(value);
}

/**
 * Vérifie si une variable est un objet
 * @param variable Variable à vérifier
 * @returns true si c'est un objet
 */
export function isObject(variable: any): boolean {
  return Object.prototype.toString.call(variable) === '[object Object]';
}

/**
 * Vérifie si une variable est un tableau
 * @param variable Variable à vérifier
 * @returns true si c'est un tableau
 */
export function isArray(variable: any): boolean {
  return Array.isArray(variable);
}

/**
 * Vérifie si une variable est une chaîne de caractères
 * @param variable Variable à vérifier
 * @returns true si c'est une chaîne
 */
export function isString(variable: any): boolean {
  return typeof variable === 'string';
}

/**
 * Vérifie si une variable est une date valide
 * @param variable Variable à vérifier
 * @returns true si c'est une date valide
 */
/* export function isValidDate(variable: any): boolean {
  if (!(variable instanceof Date)) return false;
  return !isNaN(variable.getTime());
} */

// ################################################
// # Value Transformation Functions
// ################################################

/**
 * Convertit une valeur vide en null, sinon retourne la valeur
 * @param val Valeur à convertir
 * @returns null ou la valeur
 */
export function serializeValue<T>(val: T): T | null {
  return isEmptyValue(val) ? null : val;
}

/**
 * Remplace les valeurs vides par null dans un objet
 * @param object Objet à traiter
 * @returns Nouvel objet avec les valeurs vides remplacées par null
 */
export function replaceEmptyValuesWithNull<T extends Record<string, any>>(
  object: T
): Partial<T> {
  const keys = Object.keys(object);

  return keys.reduce((newObject, key) => {
    const value = object[key];
    const newValue = value === '' ? null : value;
    return Object.assign(newObject, { [key]: newValue });
  }, {} as Partial<T>);
}

/**
 * Supprime les propriétés undefined d'un objet
 * @param object Objet à traiter
 * @returns Nouvel objet sans les propriétés undefined
 */
export function removeUndefinedValues<T extends Record<string, any>>(
  object: T
): Partial<T> {
  return Object.entries(object)
    .filter(([, value]) => typeof value !== 'undefined')
    .reduce((acc, [key, value]) => {
     (acc as Record<string, any>)[key] = value;
      return acc;
    }, {} as Partial<T>);
}

/**
 * Effectue une copie profonde d'un objet
 * @param obj Objet à copier
 * @returns Copie profonde de l'objet
 */
export function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepCopy(item)) as T;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Set) {
    return new Set([...obj].map((item) => deepCopy(item))) as T;
  }

  if (obj instanceof Map) {
    return new Map([...obj].map(([key, value]) => [key, deepCopy(value)])) as T;
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, deepCopy(value)])
  ) as T;
}

// ################################################
// # UUID & Random Functions
// ################################################

/**
 * Génère un UUID v4 aléatoire
 * @returns UUID v4 en format string
 */
export function uuidv4(): string {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
}

/**
 * Génère un UUID v4 utilisant le standard crypto
 * @returns UUID v4 en format string
 */
export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return uuidv4();
}

// ################################################
// # Array Functions
// ################################################

/**
 * Supprime les doublons dans un tableau basé sur une propriété
 * @param originalArray Tableau original
 * @param prop Propriété utilisée pour identifier les doublons
 * @returns Tableau sans doublons
 */
export function removeDuplicates<T extends Record<string, any>>(
  originalArray: T[],
  prop: keyof T
): T[] {
  const lookupObject: Record<string, T> = {};

  for (const item of originalArray) {
    lookupObject[item[prop]] = item;
  }

  return Object.values(lookupObject);
}

/**
 * Supprime les doublons dans un tableau de valeurs primitives
 * @param array Tableau original
 * @returns Tableau sans doublons
 */
export function removePrimitiveDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Filtre un tableau pour ne garder que les éléments uniques
 * @param array Tableau original
 * @param compareFn Fonction de comparaison personnalisée
 * @returns Tableau des éléments uniques
 */
export function getUniqueItems<T>(
  array: T[],
  compareFn?: (a: T, b: T) => boolean
): T[] {
  return array.filter((item, index, self) =>
    index === self.findIndex((t) => (compareFn ? compareFn(t, item) : t === item))
  );
}

// ################################################
// # Number & Threshold Functions
// ################################################

/**
 * Retourne le minimum entre deux nombres
 * @param value Valeur à comparer
 * @param min Seuil minimum
 * @returns Minimum entre value et min
 */
export function minThreshold(value: number, min: number): number {
  return Math.min(value, min);
}

/**
 * Retourne le maximum entre deux nombres
 * @param value Valeur à comparer
 * @param max Seuil maximum
 * @returns Maximum entre value et max
 */
export function maxThreshold(value: number, max: number): number {
  return Math.max(value, max);
}

/**
 * Restreint une valeur entre min et max
 * @param value Valeur à restreindre
 * @param min Seuil minimum
 * @param max Seuil maximum
 * @returns Valeur restreinte
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// ################################################
// # Form Functions
// ################################################

/**
 * Récupère les clés des contrôles invalides d'un FormGroup
 * @param formGroup FormGroup à vérifier
 * @returns Tableau des clés des contrôles invalides
 */
export function getInvalidControlKeys(formGroup: FormGroup): string[] {
  const invalidControlKeys: string[] = [];

  function findInvalidControls(control: AbstractControl, path: string = ''): void {
    if (control instanceof FormGroup) {
      Object.entries(control.controls).forEach(([key, nestedControl]) => {
        const controlPath = path ? `${path}.${key}` : key;
        findInvalidControls(nestedControl, controlPath);
      });
    } else {
      if (control.invalid) {
        invalidControlKeys.push(path);
      }
    }
  }

  findInvalidControls(formGroup);
  return invalidControlKeys;
}

/**
 * Vérifie la validité d'un formulaire
 * @param form FormGroup à vérifier
 * @param toast Service Toast pour afficher les erreurs
 * @returns true si le formulaire est valide
 */
export function checkFormValidity(form: FormGroup, toast: ToastService): boolean {
  form.markAllAsTouched();

  if (form.valid) {
    return true;
  }

  const invalidKeys = getInvalidControlKeys(form);
  console.error('Formulaire non valide - Champs invalides:', invalidKeys);
  toast.error('general.form_invalid');

  return false;
}

/**
 * Marque tous les contrôles d'un formulaire comme "touched"
 * @param form FormGroup à marquer
 */
export function markFormGroupTouched(form: FormGroup): void {
  Object.entries(form.controls).forEach(([, control]) => {
    control.markAsTouched();

    if (control instanceof FormGroup) {
      markFormGroupTouched(control);
    }
  });
}

/**
 * Réinitialise un formulaire
 * @param form FormGroup à réinitialiser
 * @param value Valeurs par défaut (optionnel)
 */
export function resetForm(form: FormGroup, value?: any): void {
  form.reset(value);
  Object.entries(form.controls).forEach(([, control]) => {
    control.markAsUntouched();
    control.markAsPristine();
  });
}

/**
 * Désactive tous les contrôles d'un formulaire
 * @param form FormGroup à désactiver
 */
export function disableForm(form: FormGroup): void {
  Object.entries(form.controls).forEach(([, control]) => {
    control.disable();
  });
}

/**
 * Active tous les contrôles d'un formulaire
 * @param form FormGroup à activer
 */
export function enableForm(form: FormGroup): void {
  Object.entries(form.controls).forEach(([, control]) => {
    control.enable();
  });
}

// ################################################
// # String & Localization Functions
// ################################################

/**
 * Génère une clé de label basée sur la langue courante
 * @param currentLang Langue courante (ex: 'fr', 'en')
 * @param key Clé de base (défaut: 'libelle')
 * @returns Clé avec langue (ex: 'libelleFr', 'libelleEn')
 *
 * @example
 * getLabel('fr', 'name')  // Retourne: 'nameFr'
 * getLabel('en', 'title') // Retourne: 'titleEn'
 */
export function getLabel(currentLang: string, key: string = 'libelle'): string {
  if (!currentLang || currentLang.length === 0) {
    return key;
  }

  return key + currentLang.charAt(0).toUpperCase() + currentLang.slice(1);
}

/**
 * Formate une chaîne avec des variables
 * @param template Chaîne template avec {{variable}}
 * @param variables Objet contenant les variables
 * @returns Chaîne formatée
 *
 * @example
 * formatString('Bonjour {{name}}', { name: 'Jean' }) // Retourne: 'Bonjour Jean'
 */
export function formatString(
  template: string,
  variables: Record<string, any>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] ?? match;
  });
}

/**
 * Convertit une chaîne en camelCase
 * @param str Chaîne à convertir
 * @returns Chaîne en camelCase
 *
 * @example
 * toCamelCase('hello-world')  // Retourne: 'helloWorld'
 * toCamelCase('hello_world')  // Retourne: 'helloWorld'
 */
export function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[-_\s]([a-z])/g, (g) => g[1].toUpperCase());
}

/**
 * Convertit une chaîne en kebab-case
 * @param str Chaîne à convertir
 * @returns Chaîne en kebab-case
 *
 * @example
 * toKebabCase('helloWorld')   // Retourne: 'hello-world'
 * toKebabCase('HelloWorld')   // Retourne: 'hello-world'
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Capitalise la première lettre d'une chaîne
 * @param str Chaîne à capitaliser
 * @returns Chaîne avec première lettre majuscule
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Tronque une chaîne à une longueur spécifiée
 * @param str Chaîne à tronquer
 * @param length Longueur maximale
 * @param suffix Suffixe à ajouter (défaut: '...')
 * @returns Chaîne tronquée
 *
 * @example
 * truncate('Hello World', 5)  // Retourne: 'Hello...'
 * truncate('Hello World', 5, '→') // Retourne: 'Hello→'
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + suffix;
}

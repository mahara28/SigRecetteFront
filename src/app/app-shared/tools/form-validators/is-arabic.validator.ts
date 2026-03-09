import {
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { regex } from '../../constantes/regex';

/**
 * Validateur pour vérifier les entrées en arabe
 * Accepte uniquement les caractères arabes et les espaces
 *
 * @returns ValidatorFn
 * @example
 * this.form = this.fb.group({
 *   arabicText: ['', [Validators.required, ArabicInputValidator()]]
 * });
 */
export function ArabicInputValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const input = control.value;

    // Ignorer si vide
    if (!input || input.trim() === '') {
      return null;
    }

    // Vérifier si l'entrée correspond au pattern arabe
    const isValidArabic = regex.arabicInput().test(input);

    // Retourner null si valide, sinon l'objet erreur
    return isValidArabic ? null : { invalid_arabicInput: true };
  };
}

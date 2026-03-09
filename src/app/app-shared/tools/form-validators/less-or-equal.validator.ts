import {
  AbstractControl,
  ValidatorFn,
  ValidationErrors
} from '@angular/forms';

/**
 * Validateur de comparaison: vérifie que la valeur du contrôle courant
 * est inférieure ou égale à la valeur du contrôle référencé
 *
 * @param controlToCompare Le contrôle avec lequel comparer
 * @param errorKey Clé d'erreur personnalisée (défaut: 'lessOrEqual')
 * @returns ValidatorFn
 *
 * @example
 * const maxControl = new FormControl(100);
 * const minControl = new FormControl('', LessOrEqualValidator(maxControl));
 */
export function LessOrEqualValidator(
  controlToCompare: AbstractControl,
  errorKey: string = 'lessOrEqual'
): ValidatorFn {
  return (currentControl: AbstractControl): ValidationErrors | null => {
    // Vérifications de sécurité
    if (!controlToCompare) {
      return null;
    }

    // Gestion des valeurs vides
    if (!currentControl.value && currentControl.value !== 0) {
      return null;
    }

    if (!controlToCompare.value && controlToCompare.value !== 0) {
      return null;
    }

    // Conversion en nombres
    const currentValue = Number(currentControl.value);
    const compareValue = Number(controlToCompare.value);

    // Gestion des NaN
    if (isNaN(currentValue) || isNaN(compareValue)) {
      return null;
    }

    // Validation: currentValue <= compareValue
    const isValid = currentValue <= compareValue;

    if (isValid) {
      return null;
    }

    // Retourner l'erreur avec détails
    return {
      [errorKey]: {
        current: currentValue,
        compare: compareValue,
        message: `La valeur doit être inférieure ou égale à ${compareValue}`
      }
    };
  };
}

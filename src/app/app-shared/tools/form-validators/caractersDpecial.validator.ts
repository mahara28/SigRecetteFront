import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { regex } from '../../constantes/regex';

export function SpecialCarc(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const input = control.value;

    // Gestion des valeurs vides
    if (!input) {
      return null;
    }

    const isSpecialValid = regex.specialChar().test(input);

    return isSpecialValid ? null : { special: true };
  };
}

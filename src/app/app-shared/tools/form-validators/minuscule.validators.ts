import {
  ValidatorFn,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { regex } from '../../constantes';


export function Minuscule(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const input = control.value;

    // Ignorer si vide
    if (!input || input.trim() === '') {
      return null;
    }

    // Vérifier si l'entrée contient au moins un caractère minuscule
    const hasMinuscule = regex.minuscule().test(input);

    return hasMinuscule ? null : { minuscule: true };
  };
}

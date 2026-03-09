import {AbstractControl, ValidatorFn} from '@angular/forms';
import { isEmptyValue, isNumber } from '../utils';


const isNotNumber = {'Doit être de type numérique':null};

export function NumberValidator(): ValidatorFn {
    return (control: AbstractControl): typeof isNotNumber | null => {
        const {value} = control;

        if (isEmptyValue(value)) {
            return null;
        }

        return isNumber(value) ? null : isNotNumber;
    };
}

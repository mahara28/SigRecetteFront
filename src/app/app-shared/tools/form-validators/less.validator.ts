import {ValidatorFn} from '@angular/forms';
import { isEmptyValue } from '../utils';



export function lessValidator(
    current: number
): ValidatorFn {
    return (control) => {
        const {value: controlValue} = control;

        if (isEmptyValue(controlValue) || isEmptyValue(current)) {
            return null;
        }

        return current <= controlValue ? null : {'general.errors.invalid_value': true};
    };
}

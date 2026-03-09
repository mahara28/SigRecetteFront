import {ValidatorFn} from '@angular/forms';
import { regex } from '../../constantes';
import { isEmptyValue } from '../utils';

const error = {passport_error: 'passport_error'};

export function PassportValidator(): ValidatorFn {
    return (control): null | typeof error => {
        const {value: input} = control;
        const ispassport = regex.passport().test(input);
        if (isEmptyValue(input)) {
            return null;
        }
        return ispassport ? null : error;
    };
}

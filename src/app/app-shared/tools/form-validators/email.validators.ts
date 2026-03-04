import {ValidatorFn} from '@angular/forms';
import {regex} from '../../constantes/regex';
import { isEmptyValue } from '../utils';

const error = {'general.errors.eamil_invalid': 'general.errors.eamil_invalid'};

export function EmailValidator(): ValidatorFn {
    return (control): null | typeof error => {
        const {value: input} = control;

        const isemail = regex.email().test(input?.toString().toLowerCase());
        if (isEmptyValue(input)) {
            return null;
        }
        return isemail ? null : error;
    };
}

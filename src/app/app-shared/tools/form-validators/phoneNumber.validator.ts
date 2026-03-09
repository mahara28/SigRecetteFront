import {ValidatorFn} from '@angular/forms';
import { isEmptyValue } from '../utils';
import { regex } from '../../constantes';

const error = {'general.errors.phonenumber_err': 'general.errors.phonenumber_err'};

export function PhoneNumber(): ValidatorFn {
    return (control): null | typeof error => {
        const {value: input} = control;
        const haasnumber = regex.isPhoneNumber().test(input);
        if (isEmptyValue(input)) {
            return null;
        }
        return haasnumber ? null : error;
    };
}

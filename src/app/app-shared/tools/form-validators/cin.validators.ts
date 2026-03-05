import {ValidatorFn} from '@angular/forms';
import {regex} from '../../constantes/regex';
import { isEmptyValue } from "../utils/functions.utils";

const error = {'general.errors.cin_error': 'general.errors.cin_error'};

export function CinValidtors(): ValidatorFn {
    return (control): null | typeof error => {
        const {value: input} = control;
        const iscin = regex.cin().test(input);
        if (isEmptyValue(input)) {
            return null;
        }
        return iscin ? null : error;
    };
}

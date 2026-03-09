import {ValidatorFn} from '@angular/forms';
import {regex} from '../../constantes/regex';

const error = {month_error: 'month_error'};

export function MontNumb(): ValidatorFn {
    return (control): null | typeof error => {
        const {value: input} = control;
        const month_error = regex.month().test(input);

        return month_error ? null : error;
    };
}

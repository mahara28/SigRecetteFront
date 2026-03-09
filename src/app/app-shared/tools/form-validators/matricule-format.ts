import {ValidatorFn} from '@angular/forms';
import {regex} from '../../constantes/regex';

const error = {mat_format: 'mat_format'};

export function ismatricule(): ValidatorFn {
    return (control): null | typeof error => {
        const {value: input} = control;
        const mat_foramt = regex.isMatricule().test(input);

        return mat_foramt ? null : error;
    };
}

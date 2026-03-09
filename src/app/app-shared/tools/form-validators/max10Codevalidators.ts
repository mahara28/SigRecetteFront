import {ValidatorFn} from '@angular/forms';
import {regex} from '../../constantes/regex';

const error = {codemax10: 'codemax10'};

export function Max10Code(): ValidatorFn {
    return (control): null | typeof error => {
        const {value: input} = control;
        const haasnumber = regex.minCode10().test(input);

        return haasnumber ? null : error;
    };
}

import {ValidatorFn} from '@angular/forms';
import {regex} from '../../constantes/regex';

const error = {invalid_fr_Input: 'invalid_fr_Input'};

export function FrinputValidator(): ValidatorFn {
    return (control): null | typeof error => {
        const {value: input} = control;
        const isArbicInput = regex.frInput().test(input);

        return isArbicInput ? null : error;
    };
}

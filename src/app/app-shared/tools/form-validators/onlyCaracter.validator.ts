import {ValidatorFn} from '@angular/forms';
import {regex} from '../../constantes/regex';

const error = {invalid_caract_Input: 'invalid_caract_Input'};

export function CaractinputValidator(): ValidatorFn {
    return (control): null | typeof error => {
        const {value: input} = control;
        const isArbicInput = regex.caractInput().test(input);

        return isArbicInput ? null : error;
    };
}

import {ValidatorFn} from '@angular/forms';
import {regex} from '../../constantes/regex';

const error = {min8: 'min8'};

export function Min8(): ValidatorFn {
    return (control): null | typeof error => {
        const {value: input} = control;
        const haasnumber = regex.min8().test(input);

        return haasnumber ? null : error;
    };
}

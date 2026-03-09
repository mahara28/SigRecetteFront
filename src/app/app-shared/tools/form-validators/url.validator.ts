import {ValidatorFn} from '@angular/forms';
import {regex} from '../../constantes/regex';

const error = {invalid_url: 'invalid_url'};

export function URLValidator(): ValidatorFn {
    return (control): null | typeof error => {
        const {value: url} = control;
        const isUrl = regex.url().test(url);

        return isUrl ? null : error;
    };
}

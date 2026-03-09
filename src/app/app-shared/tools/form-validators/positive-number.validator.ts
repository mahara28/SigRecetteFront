import {ValidatorFn} from '@angular/forms';
import { isEmptyValue, isNumber } from '../utils';

export function PositiveNumberValidator(): ValidatorFn {
    return (control) => {
        const {value} = control;

        if (isEmptyValue(value)) {
            return null;
        }

        return isNumber(value) && +value >= 0
            ? null
            : {must_be_a_positive_number: 'must_be_a_positive_number'};
    };
}

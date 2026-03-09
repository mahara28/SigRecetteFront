import {ValidatorFn} from '@angular/forms';
import { isEmptyValue, isNumber } from '../utils';

export function MonthLValidator(): ValidatorFn {
    return (control) => {
        const {value} = control;

        if (isEmptyValue(value)) {
            return null;
        }

        return isNumber(value) && +value >= 0 && +value <= 12
            ? null
            : {month_error: 'month_error'};
    };
}

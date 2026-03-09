import {AbstractControl, ValidatorFn} from '@angular/forms';
import moment from 'moment';
import { isEmptyValue } from '../utils';

export function AfterStrictateValidator(date: AbstractControl): ValidatorFn {
    return (control) => {
        if (isEmptyValue(control)) {
            return null;
        }

        const isAfter = moment(control.value, 'YYYY-MM-DD').isAfter(
            moment(date.value, 'YYYY-MM-DD')
        );
        return isAfter ? null : {invalid: 'invalid'};
    };
}

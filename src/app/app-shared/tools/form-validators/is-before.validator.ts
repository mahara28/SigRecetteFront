import {AbstractControl, ValidatorFn} from '@angular/forms';
import moment from 'moment';
import { isEmptyValue } from '../utils';



const error = {'contract.beforeDate': 'contract.beforeDate'};
export function BeforeDateContratValidator(date: AbstractControl): ValidatorFn {
    return (control) => {
        if (isEmptyValue(control) ||isEmptyValue(control.value) || isEmptyValue(date)|| isEmptyValue(date.value)) {
            return null;
        }
        const isBefore = moment(control.value).isBefore(moment(date.value));
        return isBefore ? null : error;
    };







}



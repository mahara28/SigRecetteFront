import {AbstractControl, ValidatorFn} from '@angular/forms';
import  moment from 'moment';
import { isEmptyValue } from '../utils';



const error = {'affaire.table.audience.dateAfterAudience': 'affaire.table.audience.dateAfterAudience'};
export function BeforeDateAudienceJugementValidator(date: AbstractControl): ValidatorFn {
    return (control) => {
        if (isEmptyValue(control) ||isEmptyValue(control.value) || isEmptyValue(date)|| isEmptyValue(date.value)) {
            return null;
        }
        const isBefore = moment(control.value).isBefore(moment(date.value));
        return isBefore ? null : error;
    };







}

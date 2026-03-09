import {ValidatorFn} from '@angular/forms';
import { isEmptyValue, isNumber } from '../utils';

export function Max10Validator(isnottechnique?: boolean): ValidatorFn {
    return (control) => {
        const {value} = control;

        if (isEmptyValue(value)) {
            return null;
        }
        /*if(isNotNullOrUndefined(control.parent.controls)){
                    if(control.parent.controls['codeCritere'].value==18){

                      return (isNumber(value) && +value >= 0 && +value <= 20) ? null : {must_be_less_equal_20_moyenne: 'must_be_less_equal_20_moyenne'};
                    }
                }
                    else*/

        return isNumber(value) && +value >= 0 && +value <= 100
            ? null
            : isnottechnique
                ? {must_be_less_equal_tec_100: 'must_be_less_equal_tec_100'}
                : {must_be_less_equal_100: 'must_be_less_equal_100'};
    };
}

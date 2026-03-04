import {Pipe, PipeTransform} from '@angular/core';

import {DateFormatPipe} from 'ngx-moment';
import { isEmptyValue } from '../tools/utils/functions.utils';

@Pipe({
    name: 'dMf'
})
export class DayMonthFormatPipe implements PipeTransform {

    transform(value: {} | null | undefined, ...args: unknown[]): unknown {
        if (isEmptyValue(value))
            return '-'


        const format = !isEmptyValue(args[0]) ? args[0] : 'DD/MM';
        return new DateFormatPipe().transform(value, format);


}
}

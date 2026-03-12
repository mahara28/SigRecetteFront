import { Pipe, PipeTransform } from '@angular/core';
import { DateFormatPipe as MomentDateFormatPipe } from 'ngx-moment';
import { isEmptyValue } from '../tools/utils/functions.utils';

@Pipe({ name: 'df' })
export class DateFormatPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (isEmptyValue(value)) return '-';
    // if (window.localStorage.getItem('LANG') == 'ar') {
    //     return new MomentDateFormatPipe().transform(value, 'YYYY/MM/DD');
    // } else {
    //     return new MomentDateFormatPipe().transform(value, 'DD/MM/YYYY');
    // }
    const format = !isEmptyValue(args[0]) ? args[0] : 'DD/MM/YYYY';
    return new MomentDateFormatPipe().transform(value, format);
  }
}

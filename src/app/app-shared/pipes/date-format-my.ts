import {Pipe, PipeTransform} from "@angular/core";
import { isEmptyValue } from "../tools/utils/functions.utils";
import {DateFormatPipe as MomentDateFormatPipe} from 'ngx-moment';

@Pipe({name:'dfMY'})
export class DateFormatMMYYPipe implements PipeTransform{
    transform(value: any, ...args: any[]): any {
        if (isEmptyValue(value))
            return '-'
        if (window.localStorage.getItem('LANG') == 'ar') {
            return new MomentDateFormatPipe().transform(value, 'MM/YYYY');
        } else {
            return new MomentDateFormatPipe().transform(value, 'MM/YYYY');
        }
    }


}

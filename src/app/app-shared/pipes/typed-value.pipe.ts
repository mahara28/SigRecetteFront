import {Pipe, PipeTransform} from '@angular/core';
import {Observable} from 'rxjs';
import {DateFormatPipe} from './date-format.pipe';
import {TranslateService} from '@ngx-translate/core';
import { isEmptyValue } from '../tools/utils/functions.utils';
import { isValidDate2 } from '../tools/utils/date';


@Pipe({
    name: 'typedValue',
})
export class TypedValuePipe implements PipeTransform {
    constructor(private translateService: TranslateService) {
    }

    transform(value: unknown, ...args: unknown[]): Observable<any> {
        const isDate = isValidDate2(value);
        // const isDate2= isValidDate2(value);
        const isBoolean = [true, false].some((v) => v === value);
        const isBooleanString = value === 'true' || value === 'false';

        return new Observable<string>((subscriber) => {
            if (typeof value === 'undefined' || isEmptyValue(value)) {
                subscriber.next('-');
            } else if (isDate) {
                subscriber.next(new DateFormatPipe().transform(value));
            } else if (isBooleanString || isBoolean) {
                const isTrue = value === 'true' || value === true;
                const translationKey = isTrue ? 'general.yes' : 'general.no';
                this.translateService.get(translationKey).subscribe({
                    next: (translation) => {
                        subscriber.next(translation);
                    },
                });
            } else {
                subscriber.next(String(value));
            }
        });
    }
}

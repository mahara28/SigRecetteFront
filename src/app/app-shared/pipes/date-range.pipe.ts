import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ name: 'dateRange' })
export class DateRangePipe implements PipeTransform {
    constructor(private datePipe: DatePipe) {}

    transform(value: any, start: string, end: string): string {
        if (!value) return '';
        const startDate = this.datePipe.transform(value[start], 'dd/MM/yyyy');
        const endDate = this.datePipe.transform(value[end], 'dd/MM/yyyy');
        return `${startDate} - ${endDate}`;
    }
}
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'extractAndTranslate' })
export class ExtractAndTranslatePipe implements PipeTransform {
  transform(value: any): string {
    if (typeof value === 'string') {
      return value;
    }
    if (value && typeof value === 'object' && value.key) {
      return value.key; 
    }
    return '-';
  }
}

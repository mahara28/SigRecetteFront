import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'boolP'
})
export class BoolToFrenchPipe implements PipeTransform {
  transform(value: boolean): string {
    return value ? 'Oui' : 'Non';
  }
}

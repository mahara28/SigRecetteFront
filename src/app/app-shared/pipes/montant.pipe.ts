import {Pipe, PipeTransform} from '@angular/core';
import { isEmptyValue } from '../tools/utils/functions.utils';


@Pipe({
  name: 'montant'
})
export class MontantPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {

    if (isEmptyValue(value)) {
      return '-';
    }
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2 }).format(
      parseFloat(parseFloat(value).toFixed(2))
    ) +' ' +( args[0]?.devise || '');
  }
}

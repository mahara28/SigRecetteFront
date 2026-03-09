import { Component, input, effect, computed, ChangeDetectionStrategy , TemplateRef, contentChild} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppTranslateService } from '../../services/translate/translate.service';
import { COMMON_TYPES_CODES } from '../../constantes/Constantes';
import { Card } from "../card/card";

import { MontantPipe } from '../../pipes/montant.pipe';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { DateFormatheurePipe } from '../../pipes/date-heure.pipe';
import { HeureFormatPipe } from '../../pipes/heure-format.pipe';
import { TypedValuePipe } from '../../pipes/typed-value.pipe';


@Component({
  selector: 'mc-fiche-details',
  imports: [CommonModule, MatTableModule, TranslateModule, Card, MontantPipe,
    DateFormatPipe,DateFormatheurePipe, HeureFormatPipe,
    TypedValuePipe],
  templateUrl: './fiche-details.html',
  styleUrl: './fiche-details.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FicheDetails {
 // Inputs modernes (Signaux)
  data = input.required<any>();
  metadata = input.required<any>();
  templateRef = contentChild(TemplateRef);
  dataSource = new MatTableDataSource<any>([]);
  readonly COMMON_TYPES_CODES = COMMON_TYPES_CODES;
  displayedColumns = ['label', 'value'];

  constructor(private ats: AppTranslateService) {
    // Réaction automatique aux changements des signaux inputs
    effect(() => {
      this.loadDataSource(this.data(), this.metadata());
    });
  }

  private loadDataSource(data: any, metadata: any) {
    if (!data || !metadata?.columns) return;

    const getKey = (c: any) => typeof c.key === 'string'
      ? c.key
      : c.key[this.ats.getDefaultLang()];

    const transposed = metadata.columns.map((column: any, i: number) => ({
      label: column.label,
      value: data[getKey(column)],
      index: i,
      colKey: getKey(column),
      type: ['montant', 'datetime', 'time', 'other', 'date', 'hours-time'].includes(column.type)
            ? column.type
            : 'typedValue'
    }));

    this.dataSource.data = transposed;
  }
}


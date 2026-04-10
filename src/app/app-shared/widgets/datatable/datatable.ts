import { Component, input, output, viewChild, computed, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Card } from '../card/card';
import { EXPORT_TYPES_CODES } from '../../constantes/Constantes';
import { isEmptyValue } from '../../tools';
import { Table } from './table/table';

@Component({
  selector: 'mc-datatable',
  standalone: false,
  templateUrl: './datatable.html',
  styleUrl: './datatable.css',
})
export class Datatable {
  metadata = input<any>();
  responsePayload = input<{ data: any[]; total: number; isLoading: boolean }>();
  responsePayloadall = input<{ data: any[]; total: number; isLoading: boolean } | null>(null);

  // ViewChildren version Signal
  table = viewChild<Table>('t');

  // Outputs version moderne
  onAction = output<any>();
  paginate = output<any>();
  sort = output<any>();
  onImportEvent = output<any>();
  onShowEvent = output<void>();
  onBlockEvent = output<void>();
  onReplaceEvent = output<void>();

  // Calcul des métadonnées de la carte via un Signal pour éviter les recalculs inutiles
  cardMetadata = computed(() => {
    const m = this.metadata();
    if (!m) return null;

    return {
      title: m.title ?? '',
      ref: m.ref,
      styleList: {
        card: m.styleList?.card,
        cardContent: { ...(m.styleList?.cardContent ?? {}), 'overflow-y': 'hidden' },
      },
      classList: {
        card: m.classList?.card ?? 'mb-3',
        cardContent: m.classList?.cardContent ?? 'p-0',
      },
      cardTooltips: {
        add: m.cardTooltips?.add ?? 'general.icons.tooltip.add',
        delete: m.cardTooltips?.delete ?? 'general.icons.tooltip.delete_item',
        show: m.cardTooltips?.show ?? 'general.icons.tooltip.show',
        validate: m.cardTooltips?.validate ?? 'general.icons.tooltip.validate',
        block: m.cardTooltips?.block ?? 'general.icons.tooltip.block',
        replace: m.cardTooltips?.replace ?? 'general.icons.tooltip.replace',
        import: m.cardTooltips?.import ?? 'general.import',
        imprime: m.cardTooltips?.imprime ?? 'general.imprime',
      },
      hasAdd: m.hasAdd ?? false,
      hasExport: m.hasExport ?? false,
      hasFilter: m.hasFilter ?? true,
      hasImport: m.hasImport ?? false,
      hasShow: m.hasShow ?? false,
      hasblock: m.hasblock ?? false,
      hasreplace: m.hasreplace ?? false,
      hasDelete: m.hasDelete ?? false,
      hasSave: m.hasSave ?? false,
      hasImprime: m.hasImprime ?? false,
      uploadType: m.uploadType ?? '.csv, .xlsx',
      isMultiple: m.isMultiple ?? false,
    };
  });

  onFilter(typedValue: any) {
    this.table()?.onFilter(typedValue);
  }

  generateFile(fileType: string) {
    if (fileType === EXPORT_TYPES_CODES.PDF.CODE || fileType === EXPORT_TYPES_CODES.EXCEL.CODE) {
      this.onActionEventEmitter('onExport', fileType);
    }
  }

  onActionEventEmitter(handler: string, item: any = null, index: number | null = null) {
    const m = this.metadata();
    this.onAction.emit({
      handler: handler + m?.ref,
      row: { item, index },
    });
  }


  protected readonly isEmptyValue = isEmptyValue;
}

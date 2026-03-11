import {
  Component,
  input,
  output,
  viewChild,
  contentChild,
  computed,
  signal,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  TemplateRef,
  effect,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule, FormArray, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Paginator } from '../../paginator/paginator';
import { EmptyList } from '../empty-list/empty-list';
import { COMMON_TYPES_CODES } from '../../../constantes/Constantes';
import { AppTranslateService } from '../../../services/translate/translate.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatTooltip, MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'mc-table',
  standalone: false,
  /* imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatSortModule,
    MatCheckboxModule, MatRadioModule, MatIconModule, MatButtonModule,
    MatTooltipModule, TranslateModule
], */
  templateUrl: './table.html',
  styleUrl: './table.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table {
  // --- Signals Inputs ---
  metadata = input.required<any>();
  responsePayload = input.required<{ data: any[]; total: number; isLoading: boolean }>();

  responsePayloadall = input<{ data: any[]; total: number; isLoading: boolean } | null>(null);

  // --- Outputs ---
  onAction = output<any>();
  paginate = output<any>();
  sort = output<Sort>();

  // --- View Queries ---
  templateRef = contentChild(TemplateRef);

  // --- State ---
  dataSource = new MatTableDataSource<any>();
  protected readonly COMMON_TYPES_CODES = COMMON_TYPES_CODES;

  // --- Computed : Calcul automatique des colonnes pour mat-table ---
  displayedColumns = computed(() => {
    const cols = this.metadata()?.columns || [];
    return Object.values(cols).map((c: any) => this.getColumnKey(c.key));
  });

  constructor(private ats: AppTranslateService) {
    // Met à jour la source de données dès que le payload change
    effect(() => {
      this.dataSource.data = this.responsePayload().data || [];
    });
  }

  /**
   * ✅ Correction du bug : Transforme la clé (string ou objet) en ID unique
   */
  getColumnKey(column: any): string {
    if (!column) return '';
    if (typeof column === 'object') {
      return column[this.ats.getCurrentLanguage()] || (Object.values(column)[0] as string);
    }
    return column;
  }

  onSortChange(sort: Sort) {
    this.sort.emit(sort);
  }

  onCheckChange(row: any, checked: boolean, index: number) {
    row.checked = checked;
    this.emitAction('onCheckToggle', { row, checked }, index);
  }

  onCheckAllChange(checked: boolean) {
    this.dataSource.data.forEach((item) => (item.checked = checked));
    this.emitAction('onCheckAllToggle', { row: this.dataSource.data, checked });
  }

  onActionEventEmitter(handler: string, item: any, index: number) {
    this.emitAction(handler, item, index);
  }

  protected emitAction(handler: string, item: any, index: number | null = null) {
    this.onAction.emit({
      handler: handler + this.metadata().ref,
      row: { item, index },
    });
  }

  // Helper pour les styles dynamiques
  getCircleColor(row: any, column: any): string {
    const val = row[column.key];
    if (!val) return 'gray';
    return val === '1' ? 'green' : 'red';
  }
}

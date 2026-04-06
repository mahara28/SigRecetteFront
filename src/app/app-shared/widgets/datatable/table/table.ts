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
  ViewChild,
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
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'mc-table',
  standalone: false,
  templateUrl: './table.html',
  styleUrl: './table.css',
  encapsulation: ViewEncapsulation.None,
  //changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Table {
  // --- Signals Inputs ---
  metadata = input.required<any>();
  responsePayload = input<{
    data: any[];
    total: number;
    isLoading: boolean;
  }>({
    data: [],
    total: 0,
    isLoading: false,
  });
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

  private paginationState = signal<{ pageSize: number; pageIndex: number; totalCount: number }>({
    pageSize: 10,
    pageIndex: 0,
    totalCount: 0,
  });

  private filterActive = signal<boolean>(false);
  private filteredData = signal<any[]>([]);
  private currentSort = signal<Sort | null>(null);

  // --- Computed : Calcul automatique des colonnes pour mat-table ---
  displayedColumns = computed(() => {
    const cols = this.metadata()?.columns || [];
    return Object.values(cols).map((c: any) => this.getColumnKey(c.key));
  });

  constructor(private ats: AppTranslateService) {
    // Met à jour la source de données dès que le payload change
    effect(() => {
      const payload = this.responsePayload();
      this.dataSource.data = payload.data || [];
      this.paginationState.update((state) => ({
        ...state,
        totalCount: payload.total,
      }));
    });

    // Met à jour la pagination quand les données filtrées changent
    effect(() => {
      if (this.filterActive()) {
        this.paginationState.update((state) => ({
          ...state,
          totalCount: this.filteredData().length,
        }));
      }
    });
  }

  onPaginateChange(event: PageEvent) {
    // Émettre l'événement pour le parent
    this.paginate.emit(event);

    // Mettre à jour l'état de pagination
    this.paginationState.update((state) => ({
      ...state,
      pageSize: event.pageSize,
      pageIndex: event.pageIndex,
    }));

    // Appliquer la logique de pagination locale
    this.applyPagination();
  }

  private applyPagination(): void {
    // Déterminer la source de données (filtrée ou non)
    let dataList = this.filterActive() ? this.filteredData() : this.responsePayload().data;

    const { pageSize, pageIndex } = this.paginationState();

    // Calculer les indices de début et fin
    const start = pageIndex * pageSize;
    const end = start + pageSize;

    // Appliquer la pagination
    this.dataSource.data = dataList.slice(start, end);
  }

  /**
   *Transforme la clé (string ou objet) en ID unique
   */
  getColumnKey(column: any): string {
    if (!column) return '';
    if (typeof column === 'object') {
      return column[this.ats.getCurrentLanguage()] || (Object.values(column)[0] as string);
    }
    return column;
  }

  onSortChange(sort: Sort): void {
    this.currentSort.set(sort);
    this.sort.emit(sort);

    if (this.filterActive()) {
      // Si un filtre est actif, trier les données filtrées
      const sortedData = this.sortData(this.filteredData(), sort);
      this.filteredData.set(sortedData);
    } else {
      // Sinon, trier les données originales
      const sortedData = this.sortData(this.responsePayload().data, sort);
      this.dataSource.data = sortedData;
    }

    // Réinitialiser à la première page après tri
    if (this.paginator) {
      this.paginator.firstPage();
    }

    this.paginationState.update((state) => ({ ...state, pageIndex: 0 }));
  }

  private sortData(data: any[], sort: Sort): any[] {
    if (!sort.active || sort.direction === '') {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sort.active];
      const bValue = b[sort.active];

      // Gestion des valeurs nulles/undefined
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Comparaison selon le type
      const direction = sort.direction === 'asc' ? 1 : -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * direction;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return (aValue - bValue) * direction;
      }

      // Comparaison par défaut
      return String(aValue).localeCompare(String(bValue)) * direction;
    });
  }

  onCheckChange(row: any, checked: boolean, index: number) {
    row.checked = checked;
    this.emitAction('onCheckToggle', { row, checked }, index);
  }

  onCheckAllChange(checked: boolean) {
    this.dataSource.data.forEach((item) => (item.checked = checked));
    this.emitAction('onCheckAllToggle', { row: this.dataSource.data, checked });
  }

  onFilter(value: string): void {
    const payload = this.responsePayload();
    const data = payload?.data ?? [];

    const filter = (value || '').trim().toLowerCase();

    // Si le filtre est vide → reset
    if (!filter) {
      this.filterActive.set(false);
      this.filteredData.set([]);
      this.dataSource.data = data;

      this.paginationState.update((state) => ({
        ...state,
        totalCount: data.length,
        pageIndex: 0,
      }));

      if (this.paginator) {
        this.paginator.firstPage();
      }

      this.applyPagination();
      return;
    }

    // Colonnes filtrables
    const columns = this.metadata()?.columns || [];

    const filtered = data.filter((row) => {
      return columns.some((col: any) => {
        const key = typeof col.key === 'object' ? this.getColumnKey(col.key) : col.key;

        const value = row[key];

        if (value == null) return false;

        return String(value).toLowerCase().includes(filter);
      });
    });

    this.filterActive.set(true);
    this.filteredData.set(filtered);

    // Appliquer tri actif
    const sort = this.currentSort();
    if (sort) {
      this.filteredData.set(this.sortData(filtered, sort));
    }

    this.paginationState.update((state) => ({
      ...state,
      totalCount: filtered.length,
      pageIndex: 0,
    }));

    if (this.paginator) {
      this.paginator.firstPage();
    }

    this.applyPagination();
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

  getDateFormat(format: string | Record<string, string>): string {
    if (typeof format === 'object' && format !== null) {
      const lang = AppTranslateService.getStoredLanguage();

      return format[lang] ?? Object.values(format)[0];
    }

    return format;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  getRowClass(row: any): string {
  if (this.metadata() && this.metadata().rowClass) {
    // Si rowClass est une fonction, l'appeler avec la ligne
    if (typeof this.metadata().rowClass === 'function') {
      return this.metadata().rowClass(row);
    }
    // Si c'est une chaîne directe
    return this.metadata().rowClass;
  }
  return '';
}

}


import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  signal,
  computed,
  effect,
  inject
} from '@angular/core';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

import { pagination, paginationOptions } from '../../constantes';
import { Pagination } from '../../models/Pagination';


@Component({
  selector: 'mc-paginator',
  imports: [CommonModule, MatPaginatorModule],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
})
export class Paginator {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Outputs typés
  @Output() pageChange = new EventEmitter<Pagination>();
  @Output() pageChangeDataTable = new EventEmitter<Pagination>();

  // Inputs transformés en signals
  private pageIndexSignal = signal<number>(0);
  private totalSignal = signal<number>(0);
  private pageSizeSignal = signal<number>(pagination().itemsPerPage);

  @Input() set pageIndex(value: number) {
    this.pageIndexSignal.set(value ?? 0);
  }

  @Input() set total(value: number) {
    this.totalSignal.set(value ?? 0);
  }

  @Input() set pageSize(value: number) {
    this.pageSizeSignal.set(value ?? pagination().itemsPerPage);
  }

  // Computed values
  protected pageSizeOptions = computed(() =>
    paginationOptions(this.pageSizeSignal())
  );

  protected paginatorConfig = computed(() => ({
    length: this.totalSignal(),
    pageSize: this.pageSizeSignal(),
    pageIndex: this.pageIndexSignal(),
    pageSizeOptions: this.pageSizeOptions(),
    showFirstLastButtons: true
  }));

  // Effet pour mettre à jour le paginator quand total change
  private totalEffect = effect(() => {
    const total = this.totalSignal();
    if (this.paginator) {
      this.paginator.length = total;
    }
  });

  onPageChange(event: PageEvent): void {
    const pagination: Pagination = {
      limit: event.pageSize,
      offSet: event.pageIndex
    };

    this.pageChange.emit(pagination);
    this.pageChangeDataTable.emit(pagination);
  }
}

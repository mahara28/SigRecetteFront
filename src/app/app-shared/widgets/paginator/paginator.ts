import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  signal,
  computed,
  effect,
  inject,
  SimpleChanges,
} from '@angular/core';
import { MatPaginator, PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

import { pagination, paginationOptions } from '../../constantes';
import { Pagination } from '../../models/Pagination';

@Component({
  selector: 'mc-paginator',
  standalone: false,
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
})
export class Paginator {
  @Output() paginate: EventEmitter<Pagination> = new EventEmitter<Pagination>();
  @Output() paginatedatatable: EventEmitter<Pagination> = new EventEmitter<Pagination>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @Input() pageIndex = 0;
  @Input() total!: number;

  @Input() pageSize = pagination().itemsPerPage;
  pageSizeOptions = paginationOptions();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const { total, pageSize } = changes;
    if (total.currentValue !== total.previousValue && !total.isFirstChange() && this.paginator) {
      this.paginator.length = this.total;
    }
    if (pageSize?.currentValue !== pageSize?.previousValue) {
      this.pageSizeOptions = paginationOptions(pageSize.currentValue);
    }
  }

  ngAfterViewInit(): void {
    this.paginator.length = this.total;
  }

  onPageChange(event: PageEvent) {
    this.paginate.emit({ limit: event.pageSize, offSet: event.pageIndex });
    this.paginatedatatable.emit({ limit: event.pageSize, offSet: event.pageIndex });
  }
}

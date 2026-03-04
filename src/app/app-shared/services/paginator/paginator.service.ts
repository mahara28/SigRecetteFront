// paginator.service.ts
import { Injectable, OnDestroy, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PaginatorService extends MatPaginatorIntl implements OnDestroy {
  private readonly translate = inject(TranslateService);
  private readonly destroy$ = new Subject<void>();

  // Labels par défaut
  private readonly defaultItemsPerPage = 'Éléments par page';
  private readonly defaultNextPage = 'Page suivante';
  private readonly defaultPreviousPage = 'Page précédente';
  private readonly defaultFirstPage = 'Première page';
  private readonly defaultLastPage = 'Dernière page';
  private readonly defaultOf = 'sur';

  // Propriétés du paginator
  override itemsPerPageLabel = this.defaultItemsPerPage;
  override nextPageLabel = this.defaultNextPage;
  override previousPageLabel = this.defaultPreviousPage;
  override firstPageLabel = this.defaultFirstPage;
  override lastPageLabel = this.defaultLastPage;

  constructor() {
    super();
    this.initializeTranslations();
  }

  /**
   * Initialise les traductions
   */
  private initializeTranslations(): void {
    this.loadTranslations();

    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadTranslations();
        this.changes.next();
      });
  }

  /**
   * Charge toutes les traductions
   */
  private loadTranslations(): void {
    this.itemsPerPageLabel = this.translate.instant('PAGINATOR.items_per_page') || this.defaultItemsPerPage;
    this.nextPageLabel = this.translate.instant('PAGINATOR.next_page') || this.defaultNextPage;
    this.previousPageLabel = this.translate.instant('PAGINATOR.previous_page') || this.defaultPreviousPage;
    this.firstPageLabel = this.translate.instant('PAGINATOR.first_page') || this.defaultFirstPage;
    this.lastPageLabel = this.translate.instant('PAGINATOR.last_page') || this.defaultLastPage;
  }

  /**
   * Génère le label de plage
   */
  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    const of = this.translate.instant('PAGINATOR.of') || this.defaultOf;

    if (length === 0 || pageSize === 0) {
      return `0 ${of} ${length}`;
    }

    const startIndex = page * pageSize + 1;
    const endIndex = Math.min(startIndex + pageSize - 1, length);

    return `${startIndex} - ${endIndex} ${of} ${length}`;
  };

  /**
   * Nettoie les abonnements
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

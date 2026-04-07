import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule, MatSelect } from '@angular/material/select';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SelectMetadata } from '../../../../models';
import {
  hasrequiredField,
  isEmptyObject,
  isEmptyValue,
  isInputChanged,
} from '../../../../tools';
import { AppTranslateService, SupportedLanguage } from '../../../../services';


@Component({
  selector: 'mc-select',
  standalone: false,
  /* imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
  ], */
  templateUrl: './select-common.html',
  styleUrl: './select-common.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCommon implements OnInit, OnChanges, OnDestroy {

  @Input() control: FormControl<any> = new FormControl(null);

  @Input() listItems: any[] = [];

  @Input() metadata!: SelectMetadata;

  @Input() hint: string = '';

  @Input() autofocusSelectValue: boolean = false;

  @Input() form?: FormGroup;

  @Output() onValueChangeEvent = new EventEmitter<any>();

  @ViewChild('matSelectFilter') matSelectFilter!: ElementRef;
  @ViewChild('matMenuTrigger') matMenuTrigger!: MatMenuTrigger;
  @ViewChild('select') select!: MatSelect;
  @ViewChild('myFormField') myFormField!: ElementRef;

  readonly hasRequiredField = hasrequiredField;


  listsearch: any[] = [];

  params: any = {};

  isSelectOpened: boolean = false;

  private readonly destroy$ = new Subject<void>();

  private currentLanguage: SupportedLanguage;
  isEmptyValue = isEmptyValue;

  constructor(
    public appTranslateService: AppTranslateService,
    private cdr: ChangeDetectorRef
  ) {
    // Initialiser la langue actuelle
    this.currentLanguage = this.appTranslateService.getCurrentLanguage();
  }

  ngOnInit(): void {
    this.params['menuPosition'] = {} as { x: number; y: number };
    this.initForm(!!this.metadata.flotParentChild);

    // ✅ Observer les changements de langue
    this.appTranslateService.currentLanguage
      .pipe(takeUntil(this.destroy$))
      .subscribe((lang) => {
        this.currentLanguage = lang;
        this.cdr.markForCheck(); // Forcer la détection des changements
      });

    // ✅ Charger les données initiales
    this.loadDataSource(this.listItems);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (isInputChanged(changes, 'listItems')) {
      this.loadDataSource(changes['listItems'].currentValue);
    }

    if (isInputChanged(changes, 'metadata')) {
      this.initForm(changes['metadata']?.currentValue?.flotParentChild);
    }

    if (isInputChanged(changes, 'control')) {
      this.control = changes['control'].currentValue;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get tooltipTxt(): string {
    if (isEmptyValue(this.control?.value)) {
      return this.appTranslateService.getByKey(
        this.metadata.label ?? ''
      );
    }

    if (!isEmptyValue(this.listItems)) {
      const value = this.getPropertyForLang(this.metadata.value);
      const optionLabel = this.getPropertyForLang(
        this.metadata.optionLabel
      );

      if (Array.isArray(this.control.value)) {
        return this.listItems
          .filter((e) => this.control.value.includes(e[value]))
          .map((e) => e[optionLabel])
          .join(', ');
      }

      return (
        this.listItems
          .filter((e) => e[value] === this.control.value)
          .map((e) => e[optionLabel])[0] ?? ''
      );
    }

    return '';
  }



  getItem<M extends Record<string, any>>(
    listItems: M[],
    property: string,
    value: string
  ): M | null {
    for (const item of listItems) {
      if (item[property] === value) {
        return item;
      }

      if (this.hasChildren(item)) {
        const found = this.getItem(
          item['children'] as M[],
          property,
          value
        );

        if (!isEmptyValue(found)) {
          return found;
        }
      }
    }

    return null;
  }

  /**
   * Efface la sélection
   */
  clear(event: MouseEvent): void {
    event.stopPropagation();
    this.control.setValue(null);
    this.onValueChangeEvent.emit(null);
  }


  getOptionLabel(item: any): string {
    if (!this.metadata.optionLabel) {
      console.warn(
        'SelectCommon: optionLabel manquant dans les métadonnées'
      );
      return '';
    }

    const property = this.getPropertyForLang(this.metadata.optionLabel);
    return item[property] ?? '';
  }


  getValue(item: any): any {
    if (!this.metadata.value) {
      return item;
    }

    const property = this.getPropertyForLang(this.metadata.value);
    return item[property];
  }


  changeValue(value: any): void {
    if (isEmptyValue(value)) {
      return;
    }

    // Filtrer les valeurs vides en cas de multi-sélection
    if (this.metadata.multiple && Array.isArray(value)) {
      const filtered = value.filter((e) => !isEmptyValue(e));
      if (filtered.length !== value.length) {
        this.control.setValue(filtered);
        this.select.close();
        return;
      }
    }

    // Déterminer quelle valeur émettre
    const emittedValue = this.getEmittedValue(value);
    this.onValueChangeEvent.emit(emittedValue);
  }


  filter(searchValue: string): void {
    if (isEmptyValue(searchValue)) {
      this.listsearch = [...this.listItems];
      return;
    }

    if (this.metadata.grouping || this.metadata.parentChild) {
      this.listsearch = this.searchItemsInTree(
        this.listItems,
        searchValue
      );
    } else {
      this.listsearch = this.listItems.filter((item) =>
        this.checkItemMatch(item, searchValue)
      );
    }

    this.cdr.markForCheck();
  }

  isShowOption(item: any, parent?: any): boolean {
    if (!this.metadata.filter || !this.isSelectOpened) {
      return true;
    }

    if (this.metadata.grouping || this.metadata.parentChild) {
      if (!isEmptyObject(parent)) {
        return !isEmptyObject(
          this.listsearch
            .find((p) => p.id === parent.id)
            ?.children?.find((c: any) => c.id === item.id)
        );
      }
      return !isEmptyObject(this.listsearch.find((i) => i.id === item.id));
    }

    return this.listsearch.includes(item);
  }

  onSelectToggle(isOpened: boolean): void {
    if (!isOpened && !isEmptyObject(this.matSelectFilter)) {
      this.matSelectFilter['nativeElement'].value = '';
      this.listsearch = [...this.listItems];
    } else if (isOpened && !isEmptyObject(this.matSelectFilter)) {
      setTimeout(() => {
        this.matSelectFilter?.nativeElement?.focus();
      });
    }

    this.isSelectOpened = isOpened;
  }


  hasChildren(item: any): boolean {
    return (
      Array.isArray(item.children) &&
      !isEmptyValue(item.children) &&
      item.children.length > 0
    );
  }


  setControlsValues(item: any): void {
    this.control.setValue(this.getValue(item));
    this.form?.get('svl')?.setValue(this.getOptionLabel(item));
  }





  private getPropertyForLang(property: any): string {
    if (!property) return '';
    if (typeof property === 'string') return property;
    if (typeof property === 'object' && property !== null) {
      return property[this.currentLanguage] ?? '';
    }
    return '';
  }

  private initForm(flotParentChild: boolean): void {
    if (!isEmptyValue(flotParentChild) && flotParentChild) {
      this.form = new FormGroup({
        svl: new FormControl({
          value: isEmptyValue(this.control.value)
            ? null
            : this.getOptionLabel(
              this.getItem(
                this.listItems,
                this.getPropertyForLang(this.metadata.value),
                this.control.value
              )
            ),
          disabled: this.control.disabled,
        }),
      });
    }
  }

  private loadDataSource(listItems: any[]): void {
    this.listItems = listItems ?? [];
    this.listsearch = [...(listItems ?? [])];
  }

  private transformListItems(listItems: any[]): any[] {
    const flattened: any[] = [];
    for (const item of listItems) {
      flattened.push(item);
      if (this.hasChildren(item)) {
        flattened.push(...item['children']);
      }
    }
    return flattened;
  }


  private checkItemMatch(item: any, searchValue: string): boolean {
    if (!this.metadata.optionLabel) {
      return false;
    }

    const property = this.getPropertyForLang(
      this.metadata.optionLabel
    );
    const itemValue = item[property];

    if (!itemValue) {
      return false;
    }

    return String(itemValue)
      .toUpperCase()
      .includes(searchValue.toUpperCase());
  }

  private searchItemsInTree(tree: any[], searchValue: string): any[] {
    const results: any[] = [];

    for (const item of tree) {
      const tempItem = { ...item };
      let childResults: any[] = [];

      if (!isEmptyValue(tempItem.children)) {
        childResults = this.searchItemsInTree(
          tempItem.children,
          searchValue
        );
      }

      tempItem.children = [...childResults];

      if (
        this.checkItemMatch(tempItem, searchValue) ||
        !isEmptyValue(childResults)
      ) {
        results.push(tempItem);
      }
    }

    return results;
  }


  private getEmittedValue(value: any): any {
    if (isEmptyValue(value)) {
      return null;
    }

    const isMultiple = Array.isArray(value);
    const values = isMultiple ? value : [value];
    const flattened = this.transformListItems(this.listItems);

    const matched = flattened.filter((item) =>
      values.includes(this.getValue(item))
    );

    if (
      isEmptyValue(this.metadata.emittedValue) ||
      this.metadata.emittedValue === '—'
    ) {
      return isMultiple ? matched : matched[0];
    }

    if (this.metadata.emittedValue === this.metadata.value) {
      return value;
    }

    const key = this.metadata.emittedValue as string;
    const emitted = matched.map((i) => i[key]);

    return isMultiple ? emitted : emitted[0];
  }
}

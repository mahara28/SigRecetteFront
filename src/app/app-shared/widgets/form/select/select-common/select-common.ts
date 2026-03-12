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
import { AppTranslateService } from '../../../../services';
import { Pipe } from '@angular/core';


@Component({
  selector: 'mc-select',
  standalone: false,
  templateUrl: './select-common.html',
  styleUrl: './select-common.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCommon implements OnInit, OnChanges {
  @Input() autofocusSelectValue = false;

  @Input() control!: FormControl<any>;

  @Input() listItems: any[] = [];

  @Input() metadata!: SelectMetadata;
  listItemsFiltered: any[] = [];

  @Input() hint?: string;

  @Output() onValueChangeEvent = new EventEmitter<any>();


  @ViewChild('select') select!: MatSelect;

  @ViewChild('matSelectFilter') matSelectFilter?: ElementRef<HTMLInputElement>;

  @ViewChild('matMenuTrigger') matMenuTrigger?: MatMenuTrigger;

  @ViewChild('myFormField') myFormField?: ElementRef;


  //form?: FormGroup;

  required = hasrequiredField;

  isEmptyValue = isEmptyValue;

  listsearch: any[] = [];

  params: any = {};

  isSelectOpened = false;


  constructor(
    public appTranslateService: AppTranslateService,

  ) {
  }
  form: FormGroup = new FormGroup({
    svl: new FormControl(null),

  });
  get tooltipTxt(): string | undefined {
    const lang = this.appTranslateService.getDefaultLang();
    if (isEmptyValue(this.control?.value)) {
      return this.appTranslateService.getByKey(this.metadata?.label ?? '');
    }

    if (!isEmptyValue(this.listItems)) {

      const lang = this.appTranslateService.getDefaultLang();

      const value =
        typeof this.metadata.value === 'object'
          ? (this.metadata.value as Record<string, string>)[lang]
          : this.metadata.value;

      const optionLabel =
        typeof this.metadata.optionLabel === 'object'
          ? (this.metadata.optionLabel as Record<string, string>)[lang]
          : this.metadata.optionLabel;

      if (Array.isArray(this.control.value)) {

        return this.listItems
          .filter(e => this.control.value.includes(e[value as string]))
          .map(e => this.appTranslateService.getByKey(e[optionLabel as string]))
          .join(', ');
      }

      return this.listItems
        .filter(e => e[value as string] === this.control.value)
        .map(e => e[optionLabel as string])[0];
    }

    return undefined;
  }


  ngOnInit(): void {
    this.params['menuPosition'] = { x: 0, y: 0 };

    this.initForm(this.metadata?.flotParentChild);
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (isInputChanged(changes, 'listItems')) {
      this.loadDataSource(changes['listItems'].currentValue);
    }

    if (isInputChanged(changes, 'metadata')) {
      this.initForm(changes['metadata'].currentValue);
    }

    if (isInputChanged(changes, 'control')) {
      this.control = changes['control'].currentValue;
    }
  }

  initForm(metadata: any) {

    if (metadata?.flotParentChild) {

      this.form = new FormGroup({
        svl: new FormControl(
          {
            value: isEmptyValue(this.control.value)
              ? null
              : this.getOptionLabel(
                this.getItem(this.listItems, metadata.value, this.control.value)
              ),
            disabled: this.control.disabled
          }
        )
      });

    }

  }



  clear(event: MouseEvent) {

    event.stopPropagation();

    this.control.setValue(null);

    this.onValueChangeEvent.emit(null);

  }

  getOptionLabel(item: any): string {

    if (!this.metadata?.optionLabel) {
      console.error('SelectMetadata optionLabel missing');
      return '';
    }

    if (typeof this.metadata.optionLabel === 'string') {
      return item[this.metadata.optionLabel];
    }

    const lang = this.appTranslateService.getDefaultLang();

    const optionLabel =
      (this.metadata.optionLabel as Record<string, string>)[lang];

    return item[optionLabel];


  }
  getValue(item: any) {

    if (!this.metadata.value) {
      return item;
    }

    if (typeof this.metadata.value === 'object') {

      const lang = this.appTranslateService.getDefaultLang();

      const valueKey =
        (this.metadata.value as Record<string, string>)[lang];

      return item[valueKey];
    }

    return item[this.metadata.value];
  }


  changeValue(value: any) {

    if (isEmptyValue(value)) {
      return;
    }

    if (this.metadata.multiple && Array.isArray(value)) {

      value = value.filter(v => !isEmptyValue(v));

      this.control.setValue(value);

      this.select.close();

    }

    this.onValueChangeEvent.emit(value);

  }



  hasChildren(item: any): boolean {

    return (
      Array.isArray(item?.children) &&
      item.children.length > 0
    );

  }



  setControlsValues(item: any) {

    this.control.setValue(this.getValue(item));

    this.form?.get('svl')?.setValue(this.getOptionLabel(item));

  }



  filter(value: string) {

    if (isEmptyValue(value)) {

      this.listsearch = [...this.listItems];

      return;

    }

    const v = value.toUpperCase();

    this.listsearch = this.listItems.filter(item => {

      const label = this.getOptionLabel(item);

      return label?.toUpperCase().includes(v);

    });

  }



  onSelectToggle(isOpen: boolean) {

    if (!isOpen && this.matSelectFilter) {

      this.matSelectFilter.nativeElement.value = '';

      this.listsearch = [...this.listItems];

    }

    if (isOpen && this.matSelectFilter) {

      this.matSelectFilter.nativeElement.focus();

    }

    this.isSelectOpened = isOpen;

  }



  private loadDataSource(listItems: any[]) {

    this.listItems = listItems ?? [];

    this.listsearch = [...this.listItems];

  }



  getItem(list: any[], property: string, value: any): any {

    for (const item of list) {

      if (item[property] === value) {
        return item;
      }

      if (this.hasChildren(item)) {

        const child = this.getItem(item.children, property, value);

        if (!isEmptyValue(child)) {
          return child;
        }

      }

    }

    return null;

  }
  isShowOption(item: any, parent?: any): boolean {
    // Exemple : cacher les éléments désactivés
    if (!item) return false;
    if (item.disabled) return false;

    // Si tu as un filtrage actif (comme un search), tu peux l'intégrer
    if (this.metadata?.filter && this.listItemsFiltered) {
      return this.listItemsFiltered.includes(item);
    }

    return true; // sinon, afficher
  }
}

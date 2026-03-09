import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
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
import { SelectMetadata } from '../../../../models';
import { hasrequiredField, isEmptyObject, isEmptyValue } from '../../../../tools';
import { from } from 'rxjs';
import { AppTranslateService } from '../../../../services';
import { isInputChanged } from '../../../../tools/utils/ng-changes';

/**
@example
 * <mc-select
 *   [control]="myControl"
 *   [listItems]="items"
 *   [metadata]="selectMetadata"
 *   (onValueChangeEvent)="onValueChange($event)">
 * </mc-select>
 */

@Component({
  selector: 'mc-select',
  imports: [  CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule],
  templateUrl: './select-common.html',
  styleUrl: './select-common.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectCommon implements OnInit, OnChanges {

  @Input() control: FormControl<any> = new FormControl(null);

  @Input() listItems: any[] = [];

  @Input() metadata!: SelectMetadata;
  @Input() hint: string = '';

  @Input() autofocusSelectValue: boolean = false;
  @Input() form!: FormGroup;
 // from?: FormGroup;
  @Output() onValueChangeEvent = new EventEmitter<any>();

  @ViewChild('matSelectFilter') matSelectFilter!: ElementRef;
  @ViewChild('matMenuTrigger') matMenuTrigger!: MatMenuTrigger;
  @ViewChild('select') select!: MatSelect;
  @ViewChild('myFormField') myFormField!: ElementRef;


  readonly hasRequiredField = hasrequiredField;

  readonly isEmptyValue = isEmptyValue;



  listsearch: any[] = [];

  params: any = {};

  isSelectOpened: boolean = false;

  private previousSearchValue: string = '';

  constructor(
    public appTranslateService: AppTranslateService,
    private cdr: ChangeDetectorRef
  ) {}


ngOnInit(): void {
  this.params['menuPosition'] = {} as { x: number; y: number };
  this.initForm(!!this.metadata.flotParentChild);
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

 get tooltipTxt(): string {

  if (isEmptyValue(this.control?.value)) {
    return this.appTranslateService.getByKey(this.metadata?.label ?? '');
  }

  if (!isEmptyValue(this.listItems)) {

    const lang = this.appTranslateService.getDefaultLang() as 'fr' | 'ar' | 'en';

    const value =
      typeof this.metadata.value === 'object'
        ? (this.metadata.value as any )[lang]
        : this.metadata.value;

    const optionLabel =
      typeof this.metadata.optionLabel === 'object'
        ? (this.metadata.optionLabel as any )[lang]
        : this.metadata.optionLabel;

    if (Array.isArray(this.control.value)) {
      return this.listItems
        .filter((e) => this.control.value.includes(e[value]))
        .map((e) => this.appTranslateService.getByKey(e[optionLabel]))
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

  /**
   * Obtient le label d'une option
   */
  getOptionLabel(item: any): string {

  if (!this.metadata?.optionLabel) {
    console.warn(
      'SelectCommonComponent: optionLabel manquant dans les métadonnées'
    );
    return '';
  }

  if (typeof this.metadata.optionLabel === 'string') {
    return item[this.metadata.optionLabel];
  }

  const lang = this.appTranslateService.getDefaultLang() as 'fr' | 'ar' | 'en';

  return item[
    (this.metadata.optionLabel as Record<'fr' | 'ar' | 'en', string>)[lang]
  ];
}

  getValue(item: any): any {

  if (!this.metadata.value) {
    return item;
  }

  const lang = this.appTranslateService.getDefaultLang() as 'fr' | 'ar' | 'en';

  const valueProperty =
    typeof this.metadata.value === 'object'
      ? (this.metadata.value as Record<'fr' | 'ar' | 'en', string>)[lang]
      : this.metadata.value;

  return item[valueProperty];
}

  changeValue(value: any): void {
    if (isEmptyValue(value)) {
      return;
    }

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

  /**
   * Filtre les options en fonction de la recherche
   */
  filter(searchValue: string): void {
    if (isEmptyValue(searchValue)) {
      this.listsearch = [...this.listItems];
      return;
    }

    if (this.metadata.grouping || this.metadata.parentChild) {
      this.listsearch = this.searchItemsInTree(this.listItems, searchValue);
    } else {
      this.listsearch = this.listItems.filter((item) =>
        this.checkItemMatch(item, searchValue)
      );
    }

    this.cdr.markForCheck();
  }

  /**
   * Vérifie si une option doit être affichée
   */
  isShowOption(item: any, parent?: any): boolean {
    if (!this.metadata.filter || !this.isSelectOpened) {
      return true;
    }

    if (this.metadata.grouping || this.metadata.parentChild) {
      if (!isEmptyObject(parent)) {
        return !isEmptyObject(
          this.listsearch
            .find((p) => p.id === parent.id)
            ?.children?.find((c:any) => c.id === item.id)
        );
      }
      return !isEmptyObject(this.listsearch.find((i) => i.id === item.id));
    }

    return this.listsearch.includes(item);
  }

  /**
   * Gère l'ouverture/fermeture du select
   */
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

  /**
   * Vérifie si un élément a des enfants
   */
  hasChildren(item: any): boolean {
    return (
      Array.isArray(item.children) &&
      !isEmptyValue(item.children) &&
      item.children.length > 0
    );
  }

  /**
   * Définit la valeur du contrôle et du formulaire de recherche
   */
  setControlsValues(item: any): void {
    this.control.setValue(this.getValue(item));
    this.form?.get('svl')?.setValue(this.getOptionLabel(item));
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
                  this.metadata.value as string,
                  this.control.value
                )
              ),
          disabled: this.control.disabled,
        }),
      });
    }
  }

  /**
   * Charge la source de données
   */
  private loadDataSource(listItems: any[]): void {
    this.listItems = listItems ?? [];
    this.listsearch = [...(listItems ?? [])];
  }

  /**
   * Aplatit la liste (support hiérarchie)
   */
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

  /**
   * Vérifie si un élément correspond à la recherche
   */
 private checkItemMatch(item: any, searchValue: string): boolean {
  if (!this.metadata.optionLabel) {
    return false; // pas de label => pas de correspondance
  }

  const lang = this.appTranslateService.getDefaultLang() as 'fr' | 'ar' | 'en';

  // Déterminer la clé à utiliser
  let optionLabelValue: string | undefined;

  if (typeof this.metadata.optionLabel === 'string') {
    optionLabelValue = item[this.metadata.optionLabel];
  } else if (typeof this.metadata.optionLabel === 'object') {
    // forcer le cast vers Record<'fr'|'ar'|'en', string>
    const labelObj = this.metadata.optionLabel as Record<'fr' | 'ar' | 'en', string>;
    optionLabelValue = item[labelObj[lang]];
  }

  // Vérifier que optionLabelValue existe avant d'utiliser toUpperCase
  if (!optionLabelValue) {
    return false;
  }

  return optionLabelValue.toUpperCase().includes(searchValue.toUpperCase());
}

  /**
   * Recherche récursive dans l'arborescence
   */
  private searchItemsInTree(tree: any[], searchValue: string): any[] {
    const results: any[] = [];

    for (const item of tree) {
      const tempItem = { ...item };
      let childResults: any[] = [];

      if (!isEmptyValue(tempItem.children)) {
        childResults = this.searchItemsInTree(tempItem.children, searchValue);
      }

      tempItem.children = [...childResults];

      if (this.checkItemMatch(tempItem, searchValue) || !isEmptyValue(childResults)) {
        results.push(tempItem);
      }
    }

    return results;
  }

  /**
   * Détermine la valeur à émettre selon la configuration
   */
  private getEmittedValue(value: any): any {
  if (isEmptyValue(value)) {
    return null;
  }

  const isMultiple = Array.isArray(value);
  const values = isMultiple ? value : [value];
  const flattened = this.transformListItems(this.listItems);

  // Filtrer les items correspondant aux valeurs sélectionnées
  const matched = flattened.filter((item) =>
    values.includes(this.getValue(item))
  );

  // Si emittedValue non défini ou “—”, renvoyer l’objet complet
  if (isEmptyValue(this.metadata.emittedValue) || this.metadata.emittedValue === '—') {
    return isMultiple ? matched : matched[0];
  }

  // Si emittedValue correspond à value, renvoyer la valeur brute
  if (this.metadata.emittedValue === this.metadata.value) {
    return value;
  }

  // TypeScript strict : vérifier que emittedValue n’est pas undefined
  const key = this.metadata.emittedValue as string;

  const emitted = matched.map((i) => i[key]);

  return isMultiple ? emitted : emitted[0];
}
}

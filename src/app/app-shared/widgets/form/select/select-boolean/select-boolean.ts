
import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  forwardRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import {
  FormControl,
  ReactiveFormsModule,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { hasrequiredField } from '../../../../tools/utils/Hasrequired';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'mc-select-boolean',
  imports: [CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatTooltipModule,
    TranslateModule],
  templateUrl: './select-boolean.html',
  styleUrl: './select-boolean.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectBoolean),
      multi: true
    }
  ]
})
export class SelectBoolean implements OnInit, OnDestroy, ControlValueAccessor {


  @Input() control: FormControl<boolean | null | string> = new FormControl(null);

  @Input() label: string = '';

  @Input() reciproque: boolean = false;

  @Input() isstring: boolean = false;

  @Input() required: boolean = false;

  @Input() disabled: boolean = false;

  @Input() errorMessage: string = '';

  @Input() yesLabel: string = 'Oui';

  @Input() noLabel: string = 'Non';

  @Input() undefinedLabel: string = 'Non défini';

  @ViewChild('selectField', { static: false }) selectField?: ElementRef;

  readonly hasRequiredField = hasrequiredField;

  options: { label: string; value: boolean | null | string }[] = [];

  private destroy$ = new Subject<void>();

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {}

  ngOnInit(): void {
    this.initializeOptions();
    this.setupValueChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialise les options du sélecteur
   */
  private initializeOptions(): void {
    if (this.isstring) {
      this.options = [
        { label: this.undefinedLabel, value: '' },
        { label: this.getLabel(true), value: 'true' },
        { label: this.getLabel(false), value: 'false' }
      ];
    } else {
      this.options = [
        { label: this.undefinedLabel, value: null },
        { label: this.getLabel(true), value: true },
        { label: this.getLabel(false), value: false }
      ];
    }
  }

  /**
   * Obtient le label pour une valeur booléenne
   */
  private getLabel(value: boolean): string {
    if (this.reciproque) {
      return value ? this.noLabel : this.yesLabel;
    }
    return value ? this.yesLabel : this.noLabel;
  }

  /**
   * Configure les changements de valeur
   */
  private setupValueChanges(): void {
    this.control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.onChange(value);
      });
  }

  /**
   * Efface la sélection
   */
  clear(event: MouseEvent): void {
    event.stopPropagation();
    this.control.setValue(null);
    this.control.markAsTouched();
  }

  /**
   * Gère le changement de valeur
   */
  onValueChange(value: any): void {
    this.control.setValue(value);
    this.control.markAsTouched();
  }

  /**
   * Vérifie si le champ a une erreur
   */
  hasError(): boolean {
    return !!(
      this.control.invalid &&
      (this.control.dirty || this.control.touched)
    );
  }

  /**
   * Obtient le message d'erreur
   */
  getErrorMessage(): string {
    if (this.errorMessage) {
      return this.errorMessage;
    }

    if (this.control.hasError('required')) {
      return `${this.label} est requis`;
    }

    return '';
  }

  // ================================================
  // # ControlValueAccessor Implementation
  // ================================================

  /**
   * Écrit une valeur dans le contrôle
   */
  writeValue(value: any): void {
    if (value !== undefined && value !== null) {
      this.control.setValue(value, { emitEvent: false });
    }
  }

  /**
   * Enregistre le callback onChange
   */
  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  /**
   * Enregistre le callback onTouched
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Défine l'état désactivé
   */
  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }
}

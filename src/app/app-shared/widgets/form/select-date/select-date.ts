import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';

// Configuration des formats pour que Material comprenne le format français/ISO
export const MY_FORMATS = {
  parse: { dateInput: 'DD/MM/YYYY' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

/*--utilisation
<mc-select-date
  [label]="'date.creation'"
  [control]="form.controls.dateCreation"
  [hasTooltip]="true"
  [isRequired]="true"
  (onChangeEvent)="maFonction($event)">
</mc-select-date>
*/

@Component({
  selector: 'mc-select-date',
  standalone: false,
  templateUrl: './select-date.html',
  styleUrl: './select-date.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectDate),
      multi: true
    },
    // On force l'adaptateur Moment pour la gestion des dates
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class SelectDate implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() control: FormControl = new FormControl(); // Fallback
  @Input() minDate?: Date | moment.Moment;
  @Input() maxDate?: Date | moment.Moment;
  @Input() hasTooltip = false;
  @Input() isRequired = false;

  @Output() onChangeEvent = new EventEmitter<any>();

  // Fonctions pour ControlValueAccessor
  onChange: any = () => { };
  onTouched: any = () => { };

  writeValue(value: any): void {
    if (value) this.control.setValue(value, { emitEvent: false });
  }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.control.disable() : this.control.enable();
  }

  onDateChange(event: any): void {
    const value = event.value;
    const finalValue = value ? moment(value) : null;
    this.onChange(finalValue);
    this.onChangeEvent.emit(finalValue);
  }

  getFormattedTooltip(): string {
    if (!this.control.value) return '';
    return moment(this.control.value).format('DD/MM/YYYY');
  }

  // À ajouter dans votre classe SelectDate

  onKeydown(event: KeyboardEvent): void {
    // Liste des touches de contrôle autorisées (BackSpace, Tab, Delete, flèches, etc.)
    const allowedKeys = [
      'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'
    ];

    // Si c'est une touche de contrôle, on laisse passer
    if (allowedKeys.indexOf(event.key) !== -1) {
      return;
    }

    // Autoriser uniquement les chiffres (0-9) et le slash (/)
    const isNumber = /[0-9]/.test(event.key);
    //const isSlash = event.key === '/';

    // Si la touche n'est ni un chiffre ni un slash, on bloque l'événement
    if (!isNumber) {
      event.preventDefault();
    }
  }

  // Petite correction pour la méthode clearField (plus propre)
  clearField(event: MouseEvent): void {
    event.stopPropagation();
    this.control.setValue(null);
    this.onChange(null);
    this.onChangeEvent.emit(null);
  }
}
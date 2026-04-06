

import { Component, Input, forwardRef, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
/*--utilisation--
<mc-select-date-time
  [label]="'Date et Heure de début'"
  [control]="form.controls.dateDebut"
  [hasTooltip]="true"
  [minDate]="minDate"
  [maxDate]="maxDate"
  [showSpinners]="true"
  [showSeconds]="false"
  [stepHour]="1"
  [stepMinute]="15"
  [touchUi]="false"
  (onChangeEvent)="votreFonction($event)">
</mc-select-date-time>
*/
@Component({
  selector: 'mc-select-date-time',
  standalone: false,
  templateUrl: './select-date-time.html',
  styleUrl: './select-date-time.css',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectDateTime),
    multi: true
  }]
})
export class SelectDateTime implements ControlValueAccessor {
  @Input() label: string = '';
  
  @Input() control: FormControl = new FormControl();
  @Input() placeholder: string = 'Sélectionner Date & Heure';
  @Input() minDate: Date | null = null;
  @Input() maxDate: Date | null = null;
  @Input() showSeconds: boolean = false;
  @Input() disabled: boolean = false;

  isOpen = false;
  selectedDate: Date | null = null;

  hours: number = 13;
  minutes: number = 45;
  seconds: number = 0;

  // Pour le calendrier
  currentViewDate: Date = new Date();
  showMonthList = false;

  weekDays = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
  monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor(private cdr: ChangeDetectorRef) {}

  // ✅ Valeur affichée dans l'input
  get displayValue(): string {
    if (!this.selectedDate) return '';
    const d = this.selectedDate;
    const pad = (n: number) => String(n).padStart(2, '0');
    const base = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(this.hours)}:${pad(this.minutes)}`;
    return this.showSeconds ? `${base}:${pad(this.seconds)}` : base;
  }

  get currentMonthLabel(): string {
    return `${this.monthNames[this.currentViewDate.getMonth()]} ${this.currentViewDate.getFullYear()}`;
  }

  // ✅ Générer les jours du calendrier
  get calendarDays(): (number | null)[] {
    const year = this.currentViewDate.getFullYear();
    const month = this.currentViewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Lundi = 0, adapter firstDay (0=dim → 6, 1=lun → 0 ...)
    const startOffset = (firstDay === 0 ? 6 : firstDay - 1);
    const days: (number | null)[] = [];

    for (let i = 0; i < startOffset; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return days;
  }

  isToday(day: number | null): boolean {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      this.currentViewDate.getMonth() === today.getMonth() &&
      this.currentViewDate.getFullYear() === today.getFullYear()
    );
  }

  isSelected(day: number | null): boolean {
    if (!day || !this.selectedDate) return false;
    return (
      day === this.selectedDate.getDate() &&
      this.currentViewDate.getMonth() === this.selectedDate.getMonth() &&
      this.currentViewDate.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  // ✅ Navigation mois
  prevMonth(): void {
    this.currentViewDate = new Date(
      this.currentViewDate.getFullYear(),
      this.currentViewDate.getMonth() - 1, 1
    );
    this.showMonthList = false;
  }

  nextMonth(): void {
    this.currentViewDate = new Date(
      this.currentViewDate.getFullYear(),
      this.currentViewDate.getMonth() + 1, 1
    );
    this.showMonthList = false;
  }

  selectMonth(index: number): void {
    this.currentViewDate = new Date(
      this.currentViewDate.getFullYear(), index, 1
    );
    this.showMonthList = false;
  }

  toggleMonthList(): void {
    this.showMonthList = !this.showMonthList;
  }

  /* // ✅ Sélection d'un jour
  selectDay(day: number | null): void {
    if (!day) return;
    this.selectedDate = new Date(
      this.currentViewDate.getFullYear(),
      this.currentViewDate.getMonth(),
      day
    );
  } */

  changeHours(delta: number): void {
  this.hours = (this.hours + delta + 24) % 24;
  this.autoConfirm();
}


changeMinutes(delta: number): void {
  this.minutes = (this.minutes + delta + 60) % 60;
  this.autoConfirm();
}

changeSeconds(delta: number): void {
  this.seconds = (this.seconds + delta + 60) % 60;
  this.autoConfirm();
}

// ✅ Confirme sans fermer le panneau
private autoConfirm(): void {
  if (!this.selectedDate) return;
  const final = new Date(this.selectedDate);
  final.setHours(this.hours, this.minutes, this.seconds, 0);
  this.control?.setValue(final);
  this.onChange(final);
  this.onTouched();
}

  // ✅ Confirmer
  /* confirm(): void {
    if (!this.selectedDate) return;
    const final = new Date(this.selectedDate);
    final.setHours(this.hours, this.minutes, this.seconds, 0);
    this.control?.setValue(final);
    this.onChange(final);
    this.onTouched();
    this.isOpen = false;
  } */

  // ✅ Ouvrir / fermer
  open(): void {
    if (this.disabled) return;
    this.isOpen = true;
    this.showMonthList = false;
  }

  close(): void {
    this.isOpen = false;
    this.showMonthList = false;
  }

  clear(event: Event): void {
    event.stopPropagation();
    this.selectedDate = null;
    this.control?.setValue(null);
    this.onChange(null);
  }

  // ✅ ControlValueAccessor
  writeValue(value: any): void {
    if (value) {
      const d = value instanceof Date ? value : new Date(value);
      this.selectedDate = d;
      this.currentViewDate = new Date(d.getFullYear(), d.getMonth(), 1);
      this.hours = d.getHours();
      this.minutes = d.getMinutes();
      this.seconds = d.getSeconds();
    } else {
      this.selectedDate = null;
    }
  }

  // ✅ Sélection d'un jour → ferme directement si heure déjà définie
selectDay(day: number | null): void {
  if (!day) return;
  this.selectedDate = new Date(
    this.currentViewDate.getFullYear(),
    this.currentViewDate.getMonth(),
    day
  );
  this.autoConfirm();
  // Fermer après un court délai pour que l'utilisateur voit la sélection
  setTimeout(() => this.isOpen = false, 300);
}

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }
}

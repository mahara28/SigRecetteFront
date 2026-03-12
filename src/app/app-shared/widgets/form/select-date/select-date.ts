import { Component, EventEmitter, Input, Output, ChangeDetectorRef } from '@angular/core';

import { FormControl } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';

import moment from 'moment';
/** utilisation**
 * <st2i-select-date-time
 *[label]="'date.creation'"
  [control]="form.controls.dateCreation"
  [hasTooltip]="true"
  [minDate]="minDate"
  [maxDate]="maxDate"
  (onChangeEvent)="dateChanged($event)">
</st2i-select-date-time>
 */

@Component({
  selector: 'mc-select-date',
  standalone: false,
  templateUrl: './select-date.html',
  styleUrl: './select-date.css',
})
export class SelectDate {
  @Input() label!: string;

  @Input() control!: FormControl;

  @Input() min?: Date;
  @Input() max?: Date;

  @Input() hasTooltip = false;
  @Input() disabled = false;

  @Output() onChangeEvent = new EventEmitter<any>();

  constructor(
    private dateAdapter: DateAdapter<any>,
    private cdRef: ChangeDetectorRef,
  ) {}

  chooseDate(): void {
    const selectedDate = this.control.value;

    if (selectedDate) {
      const safeMoment = moment.isMoment(selectedDate) ? selectedDate : moment(selectedDate);

      this.control.setValue(safeMoment);

      this.onChangeEvent.emit(safeMoment);
    }

    this.dateAdapter.setLocale(moment.locale());
  }

  clear(event: MouseEvent) {
    event.stopPropagation();

    this.control.setValue(null);
  }

  getFormattedDateValueForTheTooltip(dateVal: any) {
    return moment(dateVal).format('DD/MM/YYYY HH:mm');
  }
}

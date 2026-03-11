
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { hasrequiredField, isEmptyValue, isSomeInputsChanged } from '../../../tools';
import moment from 'moment';


@Component({
  selector: 'mc-select-date',
  standalone: false,
  templateUrl: './select-date.html',
  styleUrl: './select-date.css',
})
export class SelectDate implements OnInit, OnChanges{
 @Input() min?: Date | null;
  @Input() max?: Date | null;
  @Input() control!: FormControl;
  @Input() label: string = '';
  @Input() hint: string = '';
  @Input() hideRequiredMarker: boolean = false;
  @Input() hasTooltip: boolean = false;

  @Output() onChangeEvent = new EventEmitter<any>();

  required = hasrequiredField;

  private adapter = inject(DateAdapter<any>);

  ngOnInit(): void {
    this.adapter.setLocale(moment.locale());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (isSomeInputsChanged(changes, ['min', 'max'])) {
      if (changes['min']?.currentValue !== changes['min']?.previousValue) {
        this.min = !isEmptyValue(changes['min']?.currentValue)
          ? new Date(changes['min']?.currentValue)
          : null;
        this.adapter.setLocale(moment.locale());
      }

      if (changes['max']?.currentValue !== changes['max']?.previousValue) {
        this.max = !isEmptyValue(changes['max']?.currentValue)
          ? new Date(changes['max']?.currentValue)
          : null;
        this.adapter.setLocale(moment.locale());
      }
    }
  }

  clear(mouseEvent: MouseEvent): void {
    mouseEvent.stopPropagation();
    this.control.setValue(undefined);
  }

  chooseDate(date: any): void {
    this.adapter.setLocale(moment.locale());
    this.onChangeEvent.emit(date);
  }
}

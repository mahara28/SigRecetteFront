import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DateAdapter, ThemePalette } from '@angular/material/core';
import moment from 'moment';
import { AppTranslateService } from '../../../services';
import { DateFormatheurePipe } from '../../../pipes';
import { hasrequiredField } from '../../../tools';

@Component({
  selector: 'mc-select-date-time',
  standalone: false,
  templateUrl: './select-date-time.html',
  styleUrl: './select-date-time.css',
})
export class SelectDateTime implements OnInit, OnChanges, AfterViewChecked{
 @Input() disabled: boolean = false;
  @Input() showSpinners: boolean = true;
  @Input() showSeconds: boolean = false;
  @Input() touchUi: boolean = false;
  @Input() enableMeridian: boolean = false;
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() label: string = '';
  @Input() currentDateValue: moment.Moment = moment();
  @Input() hasTooltip: boolean = false;
  @Input() control!: FormControl;

  @Output() onChangeEvent = new EventEmitter<any>();


  public color: ThemePalette = 'primary';
  public stepHour: number = 1;
  public stepMinute: number = 1;
  public stepSecond: number = 1;

  required = hasrequiredField;

  private appTranslateService = inject(AppTranslateService);
  private dateAdapter = inject(DateAdapter<any>);
  private cdRef = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.dateAdapter.setLocale(moment.locale());
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentDateValue = changes['currentDateValue'];
    if (currentDateValue?.currentValue !== currentDateValue?.previousValue) {
      // logique si nécessaire
    }
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  clear(mouseEvent: MouseEvent): void {
    mouseEvent.stopPropagation();
    this.control.setValue(undefined);
  }

  chooseDate(): void {
    const selectedDate = this.control?.value;
    if (selectedDate) {
      const safeMoment = moment.isMoment(selectedDate)
        ? selectedDate
        : moment(selectedDate);
      this.control.setValue(safeMoment);
      this.onChangeEvent.emit(safeMoment);
    }
    this.dateAdapter.setLocale(moment.locale());
  }

  dateChange(date: any): void {
    this.onChangeEvent.emit(date);
  }

  getFormattedDateValueForTheTooltip(dateVal: any): string {
    return new DateFormatheurePipe().transform(dateVal);
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'mc-checkbox',
  imports: [CommonModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatTooltipModule,
    TranslateModule],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.css',
})
export class Checkbox implements OnInit {

  @Input() checked: boolean = false;
  @Input() disabled: boolean = false;
  @Output() checkedChange = new EventEmitter<boolean>();
  @Input() tooltipMessage?: string;

  constructor() {}

  ngOnInit(): void {

  }

  onCheckboxChange(event: any): void {
    const newValue = event.checked;
    this.checked = newValue;
    this.checkedChange.emit(newValue);
  }
}




import {Component, Input, OnInit} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner-container',
  standalone:false,
  templateUrl: './spinner-container.component.html',
  styleUrls: ['./spinner-container.component.css'],
})
export class SpinnerContainerComponent implements OnInit {
  @Input() isLoading!: boolean;
  @Input() diametre = 30;
  @Input() color: ThemePalette = 'primary';
  @Input() wrapperBackground: string = 'rgba(255, 255, 255, 0.82)';
  @Input() mode: ProgressSpinnerMode = 'indeterminate';
  @Input() value = 0;
  @Input() msg = '';
  @Input() withoutSpinner = false;

  constructor() {}

  ngOnInit(): void {}
}

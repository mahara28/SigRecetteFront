import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'mc-item',
  imports: [CommonModule],
  templateUrl: './item.html',
  styleUrl: './item.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Item {
 label = input<string | undefined>();
  value = input<string | number | undefined>();
}

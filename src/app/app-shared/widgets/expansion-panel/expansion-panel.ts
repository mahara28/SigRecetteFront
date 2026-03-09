import { Component, input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'mc-expansion-panel',
  imports: [MatExpansionModule, TranslateModule],
  templateUrl: './expansion-panel.html',
  styleUrl: './expansion-panel.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpansionPanel {
title = input<string>('');
  expanded = input<boolean>(false);
}


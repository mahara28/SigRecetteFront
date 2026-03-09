import { Component, input, output, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'mc-filter-actions',
  imports: [CommonModule, MatButtonModule, MatIconModule, TranslateModule],
  templateUrl: './filter-actions.html',
  styleUrl: './filter-actions.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterActions {
  // Signal Inputs
  hasShowMorebtn = input<boolean>(false);

  // Signal Outputs
  onSearchClicked = output<void>();
  onResetClicked = output<void>();
  onShowMoreClicked = output<boolean>();

  // État local réactif
  protected showMore = signal<boolean>(false);

  protected toggleShowMoreFlag() {
    this.showMore.update(v => !v);
    this.onShowMoreClicked.emit(this.showMore());
  }

  protected reset() {
    this.onResetClicked.emit();
  }
}

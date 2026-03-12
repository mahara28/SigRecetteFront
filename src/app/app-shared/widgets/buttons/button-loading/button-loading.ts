import { Component, input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'mc-button-loading',
  standalone: false,
  templateUrl: './button-loading.html',
  styleUrl: './button-loading.css',
})
export class ButtonLoading {
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  btnClass = input<string>('');
  raised = input<boolean>(true);
  loadingText = input<string>('general.errors.waiting');
  type = input<'button' | 'submit'>('submit');
  color = input<'primary' | 'accent' | 'warn'>('primary');
}

import { Component, Input, computed, signal } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { isEmptyValue } from '../../../tools';
import { MatCard, MatCardContent } from "@angular/material/card";
@Component({
  selector: 'mc-empty-list',
  imports: [MatCard, MatCardContent],
  templateUrl: './empty-list.html',
  styleUrl: './empty-list.css',
})
export class EmptyList {
  private dataSignal = signal<any[] | any | null | undefined>([]);
  private msgSignal = signal<string>('general.empty_list_table');
  public withoutBorderSignal = signal<boolean>(false);

  @Input() set data(value: any[] | any | null | undefined) {
    this.dataSignal.set(value);
  }

  @Input() set msg(value: string) {
    this.msgSignal.set(value);
  }

  @Input() set withoutBorder(value: boolean) {
    this.withoutBorderSignal.set(value);
  }

  // Computed values
  protected isArray = computed(() => Array.isArray(this.dataSignal()));

  protected isEmpty = computed(() => {
    const data = this.dataSignal();
    return isEmptyValue(data) || (this.isArray() && !data?.length);
  });

  protected isNotEmpty = computed(() => {
    const data = this.dataSignal();
    return !isEmptyValue(data) || (this.isArray() && data?.length > 0);
  });

  protected containerClass = computed(() => ({
    'without-border': this.withoutBorderSignal()
  }));
}

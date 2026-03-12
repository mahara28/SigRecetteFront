import { Component, input, ChangeDetectionStrategy, ViewEncapsulation, computed } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AppTranslateService } from '../../services/translate/translate.service';


@Component({
  selector: 'mc-heading',
  imports: [CommonModule, MatIconModule],
  templateUrl: './heading.html',
  styleUrl: './heading.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Heading {

 icon = input<string | undefined>();
  text = input.required<string>();

  constructor(private translate: AppTranslateService) {}

  // ✅ Correction : On utilise computed pour transformer la méthode en signal réactif
  protected readonly dir = computed(() => this.translate.getDir());
}



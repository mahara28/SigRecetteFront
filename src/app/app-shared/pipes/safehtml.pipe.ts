// safehtml.pipe.ts
import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safehtml',
  standalone: true // Pour les composants standalone
})
export class SafehtmlPipe implements PipeTransform {
  private readonly sanitized = inject(DomSanitizer);

  /**
   * Transforme une chaîne HTML en SafeHtml pour contourner la sanitization d'Angular
   * @param value - La chaîne HTML à sécuriser
   * @returns SafeHtml - Le contenu HTML sécurisé
   */
  transform(value: string): SafeHtml {
    if (!value) return '';
    return this.sanitized.bypassSecurityTrustHtml(value);
  }
}

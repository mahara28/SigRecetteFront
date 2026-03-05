import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
    selector: '[mcEnableOnlyArabic]',
})
export class EnableOnlyArabicDirective {
     @Input() mcEnableOnlyArabic: boolean = true;

    // Regex pour les caractères arabes, chiffres et espaces
    private readonly arabicRegex = /^[\u0621-\u064A0-9 ]+$/;

    constructor(private elRef: ElementRef) {}

    @HostListener('keypress', ['$event'])
     onKeypress(event: KeyboardEvent): boolean {

          if (!this.mcEnableOnlyArabic) {
            return true; // Autoriser tous les caractères
        }

        const isArabic = this.arabicRegex.test(event.key);

        if (!isArabic) {
            event.preventDefault(); // Empêcher la saisie
        }

        return isArabic;
    }

}

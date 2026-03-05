import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
    selector: '[MCEnableOnlyArabic]',
})
export class EnableOnlyArabicDirective {
    @Input() MCEnableOnlyArabic = true;

    constructor(private elRef: ElementRef) {
    }

    regex = '^[\u0621-\u064A0-9 ]+$';

    @HostListener('keypress', ['$event'])
    onKeyress(event: any) {

        if (this.MCEnableOnlyArabic) {
            return new RegExp(this.regex).test(event.key);
        }
    }


}

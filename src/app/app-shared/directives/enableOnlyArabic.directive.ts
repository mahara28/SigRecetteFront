import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
    selector: '[MCEnableOnlyArabic]',
})
export class EnableOnlyArabicDirective {
    @Input() st2iEnableOnlyArabic = true;

    constructor(private elRef: ElementRef) {
    }

    regex = '^[\u0621-\u064A0-9 ]+$';

    @HostListener('keypress', ['$event'])
    onKeyress(event: any) {

        if (this.st2iEnableOnlyArabic) {
            return new RegExp(this.regex).test(event.key);
        }
    }


}

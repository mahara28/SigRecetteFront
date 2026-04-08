import {Directive, ElementRef} from '@angular/core';

@Directive({
    selector: '[appCard]',
})
export class CardDirective {
    constructor(el: ElementRef) {
        // el.nativeElement.style.borderRadius = '10px';
        // el.nativeElement.style.padding = '12px 12px';
        // el.nativeElement.style.boxShadow = '9px 7px 28px 2px rgba(255, 255, 255, 0.6), 0 10px 10px rgba(144, 127, 127, 0.37)';
        el.nativeElement.style.border = '1px solid #dadce0';
        el.nativeElement.style.boxShadow = '0px 6px 22px -8px rgba(0,0,0,0.2)';
        el.nativeElement.style.borderRadius = '10px';
        // el.nativeElement.style.overflow = 'auto';
    }
}

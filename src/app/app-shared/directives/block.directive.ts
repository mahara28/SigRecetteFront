import {Directive, ElementRef} from '@angular/core';

@Directive({
    selector: '[MCBlock]',
})
export class BlockDirective {
    constructor(el: ElementRef) {
        el.nativeElement.style.width = '100%';
    }
}

import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
    selector: '[MCOnlyNumber]',
})
export class NumbersOnlyInputDirective {
    private readonly regEx = new RegExp("^[0-9]*(\.[0-9]{0,1})?$");

    constructor(private el: ElementRef) {}

    @Input() MCOnlyNumber: boolean = true;
    @Input() maxlength: number = 20;


    @HostListener("input", ["$event"]) onInputChange(event : any) {
        if (this.MCOnlyNumber) {
            const initialValue = this.el.nativeElement.value;

            // Replace all characters except digits and a single dot
            const sanitizedValue = initialValue.replace(/[^\d.]/g, '');

            // Check if the value contains more than one dot, if so, remove extra dots
            const dotCount = sanitizedValue.split('.').length - 1;
            if (dotCount > 1) {
                const dotIndex = sanitizedValue.lastIndexOf('.');
                this.el.nativeElement.value = sanitizedValue.slice(0, dotIndex) + sanitizedValue.slice(dotIndex + 1);
            } else {
                this.el.nativeElement.value = sanitizedValue;
            }

            // If the value has changed, stop the event propagation
            if (initialValue !== this.el.nativeElement.value) {
                event.stopPropagation();

            }
        }
    }
}

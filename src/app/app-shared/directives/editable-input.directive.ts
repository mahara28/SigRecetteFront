import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
    selector: '[MCEditableInput]',
})
export class EditableInputDirective {
    @Input('appEditableInput') isEditMode: boolean;

    constructor(private el: ElementRef) {
    }
}

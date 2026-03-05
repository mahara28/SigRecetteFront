import {Directive, ElementRef, Input, OnChanges, SimpleChanges,} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

@Directive({
    selector: '[appControlError]',
})
export class ControlErrorDirective implements OnChanges {
    @Input() control!: AbstractControl;
    el: ElementRef;

    constructor(el: ElementRef, private translateService: TranslateService) {
        this.el = el;
    }

    getFirstError(): Observable<string> {
        const firstKey = Object.keys(this.control.errors || {})[0];

        const generalKeys = ['required', 'matDatepickerMin', 'matDatepickerMax', 'max'];

        if (generalKeys.includes(firstKey)) {
            return this.translateService.get((`general.errors.${firstKey}`) || ' ');
        } else {
            return this.translateService.get(firstKey || ' ');
        }
    }

    setContent(text: string) {
        if (text.length >= 17) {
            this.el.nativeElement.style.fontSize = '90%';
        }

        this.el.nativeElement.innerHTML = text;
    }

    emptyContent() {
        this.el.nativeElement.innerHTML = '';
    }

    showFirstError() {
        this.getFirstError().subscribe((msg) => this.setContent(msg));
    }

    handleStatusChange() {
        const isValid = this.control.status === 'VALID';
        if (isValid) {
            this.emptyContent();
        } else {
            this.showFirstError();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        const {
            control: {previousValue, currentValue},
        } = changes;
        if (!previousValue && !!currentValue) {
            this.handleStatusChange();
            this.control.statusChanges.subscribe((value) => {
                this.handleStatusChange();
            });
        }
    }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatFormFieldAppearance} from '@angular/material/form-field';
import {AbstractControl, UntypedFormControl} from '@angular/forms';
import { hasrequiredField } from '../../../tools/utils';



@Component({
    selector: 'app-text-area',
    standalone:false,
    templateUrl: './text-area.component.html',
    styleUrls: ['./text-area.component.css']
})
export class TextAreaComponent implements OnInit {
    @Input() appearance: MatFormFieldAppearance = 'outline';
    @Input() type = 'text';
    @Input() control!: UntypedFormControl | AbstractControl | null;
    @Input() label = '';
    @Input() value = '';
    @Input() disabled = false;
    required = hasrequiredField;
    @Input() number = false;
    @Input() d = false;
    @Input() rows: number = 2;
    @Input() hasTooltip: boolean = false;
    @Input() maxlength?: any;
    @Input() insideEditableTable: boolean = false;
    @Input() readonly: boolean = false;
    @Input() hideRequiredMarker: boolean = false;


    @Output() onChange = new EventEmitter();

    constructor() {
    }

    ngOnInit(): void {
    }
}

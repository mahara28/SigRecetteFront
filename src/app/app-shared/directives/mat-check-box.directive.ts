import {Directive, Input} from "@angular/core";
import {MatCheckbox} from "@angular/material/checkbox";

@Directive({
  selector: "mat-checkbox[checkboxValue]",
  exportAs: "checkboxValue",
})
export class MatCheckBoxDirective {
  @Input("checkboxValue") checkbox!: MatCheckbox;
  @Input() falseValue: string = "N";
  @Input() trueValue: string = "Y";

  ngOnInit() {
    this.checkbox.value = this.checkbox.checked
      ? this.trueValue
      : this.falseValue;
    this.checkbox.registerOnChange((checked: boolean) => {
      this.checkbox.value = checked ? this.trueValue : this.falseValue;
    });
  }
}

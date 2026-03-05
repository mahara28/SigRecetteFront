import {Directive, ElementRef, HostListener, Input} from "@angular/core";

@Directive({
  selector: "[mcOnlyNumber]",
})
export class OnlyNumber {
  private readonly regEx = new RegExp("^[0-9,.]*$");

  constructor(private el: ElementRef) {}

  @Input() mcOnlyNumber: boolean = true;
  @Input() maxlength: number = 20;

  @HostListener("input", ["$event"]) onInputChange(event:any) {
    if (this.mcOnlyNumber) {
      const initalValue = this.el.nativeElement.value;

      this.el.nativeElement.value = initalValue
        .replace(/[^\d,.]/g, "")
        .replace(",", ".");

      if (initalValue !== this.el.nativeElement.value) {
        event.stopPropagation();
      }
    }
  }

  @HostListener("keydown", ["$event"]) onKeyDown(event:any) {
    let e = <KeyboardEvent>event;
    if (this.mcOnlyNumber) {
      if (
        [46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
        (e.keyCode == 65 && e.ctrlKey === true) ||
        (e.keyCode == 67 && e.ctrlKey === true) ||
        (e.keyCode == 86 && e.ctrlKey === true) ||
        (e.keyCode == 88 && e.ctrlKey === true) ||
        (e.keyCode >= 35 && e.keyCode <= 39)
      ) {
        return;
      }

      if (!this.isValid(event.key)) e.preventDefault();
    }
  }

  @HostListener("paste", ["$event"]) onPaste(e:any) {
    if (this.mcOnlyNumber) {
      let pastedText = e.clipboardData.getData("text/plain");
      if (pastedText) {
        if (!this.isValid(pastedText)) {
          event!.preventDefault();
        }
      }
    }
  }

  private isValid(pastedText: string): boolean {
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(pastedText);
    return this.regEx.test(pastedText) && !this.isOverSize(next);
  }

  private isOverSize(str: string): boolean {
    if (this.maxlength && str) {
      return str.length > this.maxlength;
    }
    return false;
  }
}

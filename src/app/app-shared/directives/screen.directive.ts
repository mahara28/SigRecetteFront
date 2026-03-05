import {Directive, ElementRef} from "@angular/core";

@Directive({
  selector: "[mcScreen]",
})
export class ScreenDirective {
  constructor(el: ElementRef) {
    el.nativeElement.style.padding = undefined;
  }
}

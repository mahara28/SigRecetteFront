import {Directive, ElementRef} from "@angular/core";

@Directive({
  selector: "[MCScreen]",
})
export class ScreenDirective {
  constructor(el: ElementRef) {
    el.nativeElement.style.padding = undefined;
  }
}

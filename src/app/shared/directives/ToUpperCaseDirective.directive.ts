import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appToUpperCase]',
})
export class ToUpperCaseDirective {

  control = inject(NgControl);

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const startPos = input.selectionStart;

    if (this.control.control) {
      this.control.control.setValue(input.value.toUpperCase(), { emitEvent: false });
    }

    // Esto tuve que colocarlo para prevenir el loop
    setTimeout(() => {
      input.setSelectionRange(startPos, startPos);
    });
  }

}

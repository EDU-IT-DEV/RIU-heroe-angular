import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appUppercase]',
  standalone: true,
})
export class UppercaseDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event']) onInput(event: Event): void {
    const input = (event.target as HTMLInputElement) || this.el.nativeElement;
    const value = input.value.toUpperCase();

    if (input.selectionStart === null || input.selectionEnd === null) {
      input.value = value;
      return;
    }

    const start = input.selectionStart;
    const end = input.selectionEnd;

    input.value = value;
    input.setSelectionRange(start, end);
  }
}

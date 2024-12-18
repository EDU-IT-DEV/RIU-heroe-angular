import { ElementRef } from '@angular/core';
import { UppercaseDirective } from './uppercase.directive';

describe('UppercaseDirective', () => {
  let inputElement: HTMLInputElement;
  let directive: UppercaseDirective;

  beforeEach(() => {
    inputElement = document.createElement('input');
    document.body.appendChild(inputElement);
    const elementRef = { nativeElement: inputElement } as ElementRef<HTMLInputElement>;
    directive = new UppercaseDirective(elementRef);
  });

  afterEach(() => {
    document.body.removeChild(inputElement);
  });

  it('should create the directive successfully', () => {
    expect(directive).toBeTruthy();
  });

  it('should convert text to uppercase when typing', () => {
    inputElement.focus();
    inputElement.value = 'superman';
    const event = new Event('input', { bubbles: true });
    inputElement.dispatchEvent(event);

    expect(inputElement.value).toBe('SUPERMAN');
  });

  it('should convert text to uppercase when calling the onInput method directly', () => {
    inputElement.value = 'hello';
    inputElement.focus();

    directive.onInput(new Event('input'));

    expect(inputElement.value).toBe('HELLO');
  });

  it('should maintain cursor position correctly after converting to uppercase', () => {
    inputElement.focus();
    inputElement.value = 'batman';
    inputElement.setSelectionRange(3, 3);
    const event = new Event('input', { bubbles: true });
    inputElement.dispatchEvent(event);

    expect(inputElement.selectionStart).toBe(3);
    expect(inputElement.selectionEnd).toBe(3);
  });

  it('should handle empty text without errors', () => {
    inputElement.focus();
    inputElement.value = '';
    const event = new Event('input', { bubbles: true });
    inputElement.dispatchEvent(event);

    expect(inputElement.value).toBe('');
  });
});

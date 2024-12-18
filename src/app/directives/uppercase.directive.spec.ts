import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UppercaseDirective } from './uppercase.directive';

@Component({
  template: `<input type="text" appUppercase />`
})
class TestComponent {}

describe('UppercaseDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: HTMLInputElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [UppercaseDirective]
    });

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should convert input value to uppercase', () => {
    inputElement.value = 'test';
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputElement.value).toBe('TEST');
  });

  it('should preserve the cursor position after transforming to uppercase', () => {
    inputElement.value = 'test';
    inputElement.setSelectionRange(2, 2);
    inputElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(inputElement.value).toBe('TEST');
    expect(inputElement.selectionStart).toBe(2);
    expect(inputElement.selectionEnd).toBe(2);
  });
});

import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl, NgControl, FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ToUpperCaseDirective } from './ToUpperCaseDirective.directive';

@Component({
  template: `<input [formControl]="ctrl" appToUpperCase />`,
  standalone: true,
  imports: [ReactiveFormsModule, ToUpperCaseDirective]
})
class TestHostComponent {
  ctrl = new FormControl('');
}

describe('ToUpperCaseDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let inputEl: DebugElement;
  let component: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    inputEl = fixture.debugElement.query(By.css('input'));
    fixture.detectChanges();
  });

  it('should create the directive', () => {
    expect(inputEl).toBeTruthy();
  });

  it('should transform input to uppercase on user input', () => {
    inputEl.nativeElement.value = 'batman';
    inputEl.triggerEventHandler('input', { target: inputEl.nativeElement });
    fixture.detectChanges();
    expect(component.ctrl.value).toBe('BATMAN');
  });

  it('should preserve cursor position after transformation', (done) => {
    inputEl.nativeElement.value = 'batman';
    inputEl.nativeElement.setSelectionRange(3, 3);
    inputEl.triggerEventHandler('input', { target: inputEl.nativeElement });
    setTimeout(() => {
      expect(inputEl.nativeElement.selectionStart).toBe(3);
      expect(inputEl.nativeElement.value).toBe('BATMAN');
      done();
    });
  });

  it('should work with programmatic value changes', () => {
    component.ctrl.setValue('spiderman');
    inputEl.triggerEventHandler('input', { target: inputEl.nativeElement });
    fixture.detectChanges();
    expect(inputEl.nativeElement.value).toBe('SPIDERMAN');
  });
});

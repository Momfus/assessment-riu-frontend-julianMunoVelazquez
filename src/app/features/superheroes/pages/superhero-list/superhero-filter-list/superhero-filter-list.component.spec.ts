import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperheroFilterListComponent } from './superhero-filter-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe('SuperheroFilterListComponent', () => {
  let component: SuperheroFilterListComponent;
  let fixture: ComponentFixture<SuperheroFilterListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperheroFilterListComponent, ReactiveFormsModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroFilterListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit searchChange with the entered value', (done) => {
    component.searchChange.subscribe((value) => {
      expect(value).toBe('batman');
      done();
    });
    component.searchControl.setValue('batman');
  });

  it('should emit searchChange with empty string when value is falsy', (done) => {
    component.searchChange.subscribe((value) => {
      expect(value).toBe('');
      done();
    });
    component.searchControl.setValue(null);
  });
});

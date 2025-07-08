import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SuperHero } from '@interfaces/superhero.interface';
import { SuperheroFormComponent } from '@superheroes/shared/superhero-form/superhero-form.component';

describe('SuperheroFormComponent', () => {
  let component: SuperheroFormComponent;
  let fixture: ComponentFixture<SuperheroFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuperheroFormComponent, ReactiveFormsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(SuperheroFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.heroForm.valid).toBeFalse();
  });

  it('should validate required fields', () => {
    component.heroForm.setValue({
      name: '',
      realName: '',
      universe: '',
      powers: '',
      weaknesses: '',
    });
    expect(component.heroForm.valid).toBeFalse();
    component.heroForm.patchValue({ name: 'Sup', universe: 'Marvel', powers: 'web' });
    expect(component.heroForm.valid).toBeTrue();
  });

  it('should emit formSubmit with correct data on valid submit', () => {
    spyOn(component.formSubmit, 'emit');
    component.heroForm.patchValue({
      name: 'Batman',
      realName: 'Bruce Wayne',
      universe: 'DC',
      powers: 'intelligence, martial arts',
      weaknesses: 'none',
    });
    component.onSubmit();
    expect(component.formSubmit.emit).toHaveBeenCalledWith({
      name: 'Batman',
      realName: 'Bruce Wayne',
      universe: 'DC',
      powers: ['intelligence', 'martial arts'],
      weaknesses: ['none'],
    });
  });

  it('should not emit formSubmit if form is invalid', () => {
    spyOn(component.formSubmit, 'emit');
    component.heroForm.patchValue({ name: '', universe: '', powers: '' });
    component.onSubmit();
    expect(component.formSubmit.emit).not.toHaveBeenCalled();
  });

  it('should patch form values when hero input changes', () => {
    const hero: SuperHero = {
      id: '1',
      name: 'Wonder Woman',
      realName: 'Diana',
      universe: 'DC',
      powers: ['strength', 'flight'],
      weaknesses: ['none'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    component.heroForm.patchValue({
      name: hero.name,
      realName: hero.realName ?? '',
      universe: hero.universe,
      powers: hero.powers.join(', '),
      weaknesses: hero.weaknesses?.join(', ') ?? '',
    });

    expect(component.heroForm.value.name).toBe('Wonder Woman');
    expect(component.heroForm.value.realName).toBe('Diana');
    expect(component.heroForm.value.universe).toBe('DC');
    expect(component.heroForm.value.powers).toContain('strength');
  });

  it('should emit cancel event on cancel', () => {
    spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(component.cancel.emit).toHaveBeenCalled();
  });
});

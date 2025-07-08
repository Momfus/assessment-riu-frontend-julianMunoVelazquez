import { TestBed } from '@angular/core/testing';
import { SuperheroModalFormComponent } from './superhero-modal-form.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SuperheroDataService } from '@services/superhero-data.service';
import { of, throwError } from 'rxjs';
import { SuperHero } from '@interfaces/superhero.interface';


describe('SuperheroModalFormComponent', () => {
  let component: SuperheroModalFormComponent;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<SuperheroModalFormComponent>>;
  let dataServiceSpy: jasmine.SpyObj<SuperheroDataService>;
  let mockHero: SuperHero;

  beforeEach(() => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    dataServiceSpy = jasmine.createSpyObj('SuperheroDataService', ['update', 'create', 'refreshData']);
    mockHero = {
      id: '1',
      name: 'Superman',
      universe: 'DC',
      powers: ['flight'],
      weaknesses: ['kryptonite'],
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });

  function createComponent(data: any) {
    TestBed.configureTestingModule({
      imports: [SuperheroModalFormComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: SuperheroDataService, useValue: dataServiceSpy },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    });
    component = TestBed.createComponent(SuperheroModalFormComponent).componentInstance;
  }

  it('should call update and close dialog on edit', () => {
    dataServiceSpy.update.and.returnValue(of(mockHero));
    dataServiceSpy.refreshData.and.stub();
    createComponent({ hero: mockHero });
    const heroData = { name: 'Superman', universe: 'DC' as const, powers: ['flight'] };
    component.onFormSubmit(heroData);
    expect(dataServiceSpy.update).toHaveBeenCalled();
    expect(dataServiceSpy.refreshData).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should call create and close dialog on create', () => {
    dataServiceSpy.create.and.returnValue(of(mockHero));
    dataServiceSpy.refreshData.and.stub();
    createComponent({});
    const heroData = { name: 'Batman', universe: 'DC' as const, powers: ['detective'] };
    component.onFormSubmit(heroData);
    expect(dataServiceSpy.create).toHaveBeenCalled();
    expect(dataServiceSpy.refreshData).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should handle error on update', () => {
    spyOn(console, 'error');
    dataServiceSpy.update.and.returnValue(throwError(() => new Error('fail')));
    createComponent({ hero: mockHero });
    const heroData = { name: 'Superman', universe: 'DC' as const, powers: ['flight'] };
    component.onFormSubmit(heroData);
    expect(dataServiceSpy.update).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('should handle error on create', () => {
    spyOn(console, 'error');
    dataServiceSpy.create.and.returnValue(throwError(() => new Error('fail')));
    createComponent({});
    const heroData = { name: 'Batman', universe: 'DC' as const, powers: ['detective'] };
    component.onFormSubmit(heroData);
    expect(dataServiceSpy.create).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it('should close dialog on cancel', () => {
    createComponent({});
    component.onCancel();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});

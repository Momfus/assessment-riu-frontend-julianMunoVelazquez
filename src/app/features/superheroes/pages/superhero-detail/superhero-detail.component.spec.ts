import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperheroDetailComponent } from './superhero-detail.component';
import { SuperheroApiService } from '@services/superhero-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SpinnerService } from '@shared/services/spinner.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { SuperHero } from '@interfaces/superhero.interface';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SuperheroDetailComponent', () => {
  let component: SuperheroDetailComponent;
  let fixture: ComponentFixture<SuperheroDetailComponent>;
  let apiSpy: jasmine.SpyObj<SuperheroApiService>;
  let routeSpy: jasmine.SpyObj<ActivatedRoute>;
  let routerSpy: jasmine.SpyObj<Router>;
  let locationSpy: jasmine.SpyObj<Location>;
  let spinnerServiceSpy: jasmine.SpyObj<SpinnerService>;

  const mockHero: SuperHero = {
    id: '1',
    name: 'Superman',
    realName: 'Clark Kent',
    universe: 'DC',
    powers: ['flight', 'super strength', 'heat vision'],
    weaknesses: ['kryptonite'],
    createdAt: new Date('2022-12-27T00:00:00.000Z'),
    updatedAt: new Date('2022-12-28T00:00:00.000Z')
  };

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('SuperheroApiService', ['getById']);
    routeSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      params: of({ id: '1' })
    });
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    locationSpy = jasmine.createSpyObj('Location', ['back', 'getState']);
    spinnerServiceSpy = jasmine.createSpyObj('SpinnerService', [], {
      isLoading: signal(false)
    });

    apiSpy.getById.and.returnValue(of(mockHero));

    await TestBed.configureTestingModule({
      imports: [SuperheroDetailComponent, NoopAnimationsModule],
      providers: [
        { provide: SuperheroApiService, useValue: apiSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: SpinnerService, useValue: spinnerServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject services correctly', () => {
    expect(component.spinnerService).toBe(spinnerServiceSpy);
  });

  describe('goBack', () => {
    it('should call location.back() when navigationId > 1', () => {
      locationSpy.getState.and.returnValue({ navigationId: 2 });

      component.goBack();

      expect(locationSpy.back).toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should navigate to /heroes when navigationId <= 1', () => {
      locationSpy.getState.and.returnValue({ navigationId: 1 });

      component.goBack();

      expect(locationSpy.back).not.toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes'], {
        queryParamsHandling: 'preserve'
      });
    });

    it('should navigate to /heroes when navigationId is undefined', () => {
      locationSpy.getState.and.returnValue({});

      component.goBack();

      expect(locationSpy.back).not.toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes'], {
        queryParamsHandling: 'preserve'
      });
    });

    it('should navigate to /heroes when state is null', () => {
      locationSpy.getState.and.returnValue(null);

      component.goBack();

      expect(locationSpy.back).not.toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes'], {
        queryParamsHandling: 'preserve'
      });
    });
  });

  describe('getUniverseColor', () => {
    it('should return blue color for DC universe', () => {
      const result = component.getUniverseColor('DC');
      expect(result).toBe('bg-blue-500 text-white');
    });

    it('should return red color for Marvel universe', () => {
      const result = component.getUniverseColor('Marvel');
      expect(result).toBe('bg-red-500 text-white');
    });

    it('should return gray color for unknown universe', () => {
      const result = component.getUniverseColor('Unknown');
      expect(result).toBe('bg-gray-500 text-white');
    });

    it('should return gray color for empty string', () => {
      const result = component.getUniverseColor('');
      expect(result).toBe('bg-gray-500 text-white');
    });

    it('should return gray color for null', () => {
      const result = component.getUniverseColor(null as any);
      expect(result).toBe('bg-gray-500 text-white');
    });
  });

  describe('template rendering with hero data', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display hero name in uppercase', () => {
      const title = fixture.debugElement.query(By.css('mat-card-title'));
      expect(title.nativeElement.textContent.trim()).toBe('SUPERMAN');
    });

    it('should display real name when available', () => {
      const subtitle = fixture.debugElement.query(By.css('mat-card-subtitle'));
      expect(subtitle.nativeElement.textContent.trim()).toBe('Clark Kent');
    });

    it('should display "Unknown real name" when realName is not available', () => {
      const heroWithoutRealName = { ...mockHero, realName: undefined };
      apiSpy.getById.and.returnValue(of(heroWithoutRealName));

      fixture = TestBed.createComponent(SuperheroDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const subtitle = fixture.debugElement.query(By.css('mat-card-subtitle'));
      expect(subtitle.nativeElement.textContent.trim()).toBe('Unknown real name');
    });

    it('should display universe with correct color class', () => {
      const universeSpan = fixture.debugElement.query(By.css('span.rounded-full'));
      expect(universeSpan).toBeTruthy();
      expect(universeSpan.nativeElement.className).toContain('bg-blue-500');
      expect(universeSpan.nativeElement.textContent.trim()).toBe('DC');
    });

    it('should display powers as chips when available', () => {
      const powerChips = fixture.debugElement.queryAll(By.css('.bg-green-100'));
      expect(powerChips.length).toBe(3);
      expect(powerChips[0].nativeElement.textContent.trim()).toBe('flight');
      expect(powerChips[1].nativeElement.textContent.trim()).toBe('super strength');
      expect(powerChips[2].nativeElement.textContent.trim()).toBe('heat vision');
    });

    it('should display "Unknown powers" when powers array is empty', () => {
      const heroWithoutPowers = { ...mockHero, powers: [] };
      apiSpy.getById.and.returnValue(of(heroWithoutPowers));

      fixture = TestBed.createComponent(SuperheroDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const unknownPowers = fixture.debugElement.query(By.css('.text-gray-500'));
      expect(unknownPowers.nativeElement.textContent.trim()).toBe('Unknown powers');
    });

        it('should display "Unknown powers" when powers is empty array', () => {
      const heroWithoutPowers = { ...mockHero, powers: [] };
      apiSpy.getById.and.returnValue(of(heroWithoutPowers));

      fixture = TestBed.createComponent(SuperheroDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const unknownPowers = fixture.debugElement.query(By.css('.text-gray-500'));
      expect(unknownPowers.nativeElement.textContent.trim()).toBe('Unknown powers');
    });

    it('should display weaknesses as chips when available', () => {
      const weaknessChips = fixture.debugElement.queryAll(By.css('.bg-red-100'));
      expect(weaknessChips.length).toBe(1);
      expect(weaknessChips[0].nativeElement.textContent.trim()).toBe('kryptonite');
    });

    it('should display "Unknown weaknesses" when weaknesses array is empty', () => {
      const heroWithoutWeaknesses = { ...mockHero, weaknesses: [] };
      apiSpy.getById.and.returnValue(of(heroWithoutWeaknesses));

      fixture = TestBed.createComponent(SuperheroDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const unknownWeaknesses = fixture.debugElement.queryAll(By.css('.text-gray-500'));
      expect(unknownWeaknesses.length).toBeGreaterThan(0);
      const weaknessesText = unknownWeaknesses.find(el =>
        el.nativeElement.textContent.trim() === 'Unknown weaknesses'
      );
      expect(weaknessesText).toBeTruthy();
    });

    it('should display "Unknown weaknesses" when weaknesses is undefined', () => {
      const heroWithoutWeaknesses = { ...mockHero, weaknesses: undefined };
      apiSpy.getById.and.returnValue(of(heroWithoutWeaknesses));

      fixture = TestBed.createComponent(SuperheroDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const unknownWeaknesses = fixture.debugElement.queryAll(By.css('.text-gray-500'));
      expect(unknownWeaknesses.length).toBeGreaterThan(0);
      const weaknessesText = unknownWeaknesses.find(el =>
        el.nativeElement.textContent.trim() === 'Unknown weaknesses'
      );
      expect(weaknessesText).toBeTruthy();
    });

  });

  describe('template rendering without hero data', () => {
    beforeEach(() => {
      apiSpy.getById.and.returnValue(of(null as any));
    });

    it('should show loading message when spinner is loading', () => {
      Object.defineProperty(spinnerServiceSpy, 'isLoading', {
        value: signal(true),
        writable: true
      });

      fixture = TestBed.createComponent(SuperheroDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const loadingMessage = fixture.debugElement.query(By.css('.text-center p'));
      expect(loadingMessage).toBeTruthy();
      expect(loadingMessage.nativeElement.textContent.trim()).toBe('Loading Hero...');
    });

    it('should show "Hero not found" message when not loading and no hero', () => {
      Object.defineProperty(spinnerServiceSpy, 'isLoading', {
        value: signal(false),
        writable: true
      });

      fixture = TestBed.createComponent(SuperheroDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const notFoundMessage = fixture.debugElement.query(By.css('.text-center p'));
      expect(notFoundMessage).toBeTruthy();
      expect(notFoundMessage.nativeElement.textContent.trim()).toBe('Hero not found');
    });

    it('should show warning icon when hero not found', () => {
      Object.defineProperty(spinnerServiceSpy, 'isLoading', {
        value: signal(false),
        writable: true
      });

      fixture = TestBed.createComponent(SuperheroDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const warningIcon = fixture.debugElement.query(By.css('.text-center mat-icon'));
      expect(warningIcon).toBeTruthy();
      expect(warningIcon.nativeElement.textContent.trim()).toBe('warning');
    });
  });

  describe('button interactions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call goBack when back button is clicked', () => {
      spyOn(component, 'goBack');

      const backButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));
      backButton.nativeElement.click();

      expect(component.goBack).toHaveBeenCalled();
    });

    it('should have back button with correct text and icon', () => {
      const backButton = fixture.debugElement.query(By.css('button[mat-raised-button]'));
      const icon = backButton.query(By.css('mat-icon'));

      expect(backButton.nativeElement.textContent.trim()).toContain('Back');
      expect(icon.nativeElement.textContent.trim()).toBe('arrow_back');
    });
  });
});

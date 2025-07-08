import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperheroDetailComponent } from './superhero-detail.component';
import { SuperheroApiService } from '@services/superhero-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { SpinnerService } from '@shared/services/spinner.service';
import { of } from 'rxjs';
import { SuperHero } from '@interfaces/superhero.interface';
import { By } from '@angular/platform-browser';

const MOCK_HERO: SuperHero = {
  id: '1',
  name: 'Batman',
  realName: 'Bruce Wayne',
  universe: 'DC',
  powers: ['intelligence', 'martial arts'],
  weaknesses: ['none'],
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-12-01'),
};

describe('SuperheroDetailComponent', () => {
  let component: SuperheroDetailComponent;
  let fixture: ComponentFixture<SuperheroDetailComponent>;
  let apiSpy: jasmine.SpyObj<SuperheroApiService>;
  let routeSpy: any;
  let routerSpy: jasmine.SpyObj<Router>;
  let locationSpy: jasmine.SpyObj<Location>;
  let spinnerSpy: jasmine.SpyObj<SpinnerService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('SuperheroApiService', ['getById']);

    apiSpy.getById.and.returnValue(of(MOCK_HERO));
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    locationSpy = jasmine.createSpyObj('Location', ['back', 'getState']);
    spinnerSpy = jasmine.createSpyObj('SpinnerService', [], {
      isLoading: jasmine.createSpy().and.returnValue(false)
    });

    routeSpy = {
      params: of({ id: '1' })
    };

    await TestBed.configureTestingModule({
      imports: [SuperheroDetailComponent],
      providers: [
        { provide: SuperheroApiService, useValue: apiSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: locationSpy },
        { provide: SpinnerService, useValue: spinnerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load hero data when component initializes', async () => {
    apiSpy.getById.and.returnValue(of(MOCK_HERO));

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.hero()).toEqual(MOCK_HERO);
    expect(apiSpy.getById).toHaveBeenCalledWith('1');
  });

  it('should display hero name in uppercase', async () => {
    apiSpy.getById.and.returnValue(of(MOCK_HERO));

    fixture.detectChanges();
    await fixture.whenStable();

    const titleElement = fixture.debugElement.query(By.css('mat-card-title'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('BATMAN');
  });

  it('should display real name when available', async () => {
    apiSpy.getById.and.returnValue(of(MOCK_HERO));

    fixture.detectChanges();
    await fixture.whenStable();

    const subtitleElement = fixture.debugElement.query(By.css('mat-card-subtitle'));
    expect(subtitleElement.nativeElement.textContent.trim()).toBe('Bruce Wayne');
  });

  it('should display "Unknown real name" when real name is not available', async () => {
    const heroWithoutRealName = { ...MOCK_HERO, realName: undefined };
    apiSpy.getById.and.returnValue(of(heroWithoutRealName));
    fixture = TestBed.createComponent(SuperheroDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Unknown real name');
  });

  it('should display powers as chips', async () => {
    apiSpy.getById.and.returnValue(of(MOCK_HERO));

    fixture.detectChanges();
    await fixture.whenStable();

    const powerChips = fixture.debugElement.queryAll(By.css('.bg-green-100'));
    expect(powerChips.length).toBe(2);
    expect(powerChips[0].nativeElement.textContent.trim()).toBe('intelligence');
    expect(powerChips[1].nativeElement.textContent.trim()).toBe('martial arts');
  });

  it('should display "Unknown powers" when no powers available', async () => {
    const heroWithoutPowers = { ...MOCK_HERO, powers: [] };
    apiSpy.getById.and.returnValue(of(heroWithoutPowers));
    fixture = TestBed.createComponent(SuperheroDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Unknown powers');
  });

  it('should display weaknesses as chips', async () => {
    apiSpy.getById.and.returnValue(of(MOCK_HERO));

    fixture.detectChanges();
    await fixture.whenStable();

    const weaknessChips = fixture.debugElement.queryAll(By.css('.bg-red-100'));
    expect(weaknessChips.length).toBe(1);
    expect(weaknessChips[0].nativeElement.textContent.trim()).toBe('none');
  });

  it('should display "Unknown weaknesses" when no weaknesses available', async () => {
    const heroWithoutWeaknesses = { ...MOCK_HERO, weaknesses: [] };
    apiSpy.getById.and.returnValue(of(heroWithoutWeaknesses));
    fixture = TestBed.createComponent(SuperheroDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Unknown weaknesses');
  });

  it('should display loading message when spinner is active', async () => {
    spinnerSpy.isLoading.and.returnValue(true);
    apiSpy.getById.and.returnValue(of(null as any));
    fixture = TestBed.createComponent(SuperheroDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Loading Hero...');
  });

  it('should display "Hero not found" when hero is null and not loading', async () => {
    spinnerSpy.isLoading.and.returnValue(false);
    apiSpy.getById.and.returnValue(of(null as any));
    fixture = TestBed.createComponent(SuperheroDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Hero not found');
  });

  it('should navigate back using location.back() when navigationId > 1', () => {
    locationSpy.getState.and.returnValue({ navigationId: 2 });

    component.goBack();

    expect(locationSpy.back).toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to heroes list when navigationId <= 1', () => {
    locationSpy.getState.and.returnValue({ navigationId: 1 });

    component.goBack();

    expect(locationSpy.back).not.toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes'], {
      queryParamsHandling: 'preserve'
    });
  });

  it('should navigate to heroes list when no state available', () => {
    locationSpy.getState.and.returnValue(null);

    component.goBack();

    expect(locationSpy.back).not.toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/heroes'], {
      queryParamsHandling: 'preserve'
    });
  });

  describe('getUniverseColor', () => {
    it('should return blue color for DC universe', () => {
      const color = component.getUniverseColor('DC');
      expect(color).toBe('bg-blue-500 text-white');
    });

    it('should return red color for Marvel universe', () => {
      const color = component.getUniverseColor('Marvel');
      expect(color).toBe('bg-red-500 text-white');
    });

    it('should return gray color for other universes', () => {
      const color = component.getUniverseColor('Other');
      expect(color).toBe('bg-gray-500 text-white');
    });

    it('should return gray color for unknown universe', () => {
      const color = component.getUniverseColor('Unknown');
      expect(color).toBe('bg-gray-500 text-white');
    });
  });
});

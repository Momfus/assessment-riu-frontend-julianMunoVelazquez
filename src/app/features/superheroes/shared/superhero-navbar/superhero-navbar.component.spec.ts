import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperheroNavbarComponent } from './superhero-navbar.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SuperheroModalFormComponent } from '../superhero-modal-form/superhero-modal-form.component';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

describe('SuperheroNavbarComponent', () => {
  let component: SuperheroNavbarComponent;
  let fixture: ComponentFixture<SuperheroNavbarComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'parseUrl'], {
      url: '/heroes',
    });

    await TestBed.configureTestingModule({
      imports: [SuperheroNavbarComponent],
      providers: [
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroNavbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isBaseRoute', () => {
    it('should return true when on /heroes route', () => {

      const mockUrlTree = {
        root: {
          children: {
            primary: {
              segments: [{ path: 'heroes' }],
            },
          },
        },
      };
      routerSpy.parseUrl.and.returnValue(mockUrlTree as any);

      expect(component.isBaseRoute).toBe(true);
    });

    it('should return false when on /heroes/:id route', () => {

      const mockUrlTree = {
        root: {
          children: {
            primary: {
              segments: [{ path: 'heroes' }, { path: '123' }],
            },
          },
        },
      };
      routerSpy.parseUrl.and.returnValue(mockUrlTree as any);

      expect(component.isBaseRoute).toBe(false);
    });

    it('should return false when on different route', () => {
      const mockUrlTree = {
        root: {
          children: {
            primary: {
              segments: [{ path: 'other' }],
            },
          },
        },
      };
      routerSpy.parseUrl.and.returnValue(mockUrlTree as any);

      expect(component.isBaseRoute).toBe(false);
    });

    it('should return false when primary children does not exist', () => {
      const mockUrlTree = {
        root: {
          children: {},
        },
      };
      routerSpy.parseUrl.and.returnValue(mockUrlTree as any);

      expect(component.isBaseRoute).toBe(false);
    });

    it('should return false when segments length is not 1', () => {
      const mockUrlTree = {
        root: {
          children: {
            primary: {
              segments: [],
            },
          },
        },
      };
      routerSpy.parseUrl.and.returnValue(mockUrlTree as any);

      expect(component.isBaseRoute).toBe(false);
    });

    it('should return false when first segment path is not heroes', () => {
      const mockUrlTree = {
        root: {
          children: {
            primary: {
              segments: [{ path: 'not-heroes' }],
            },
          },
        },
      };
      routerSpy.parseUrl.and.returnValue(mockUrlTree as any);

      expect(component.isBaseRoute).toBe(false);
    });
  });

  describe('createHero', () => {
    it('should open dialog with correct configuration', () => {
      dialogSpy.open.and.returnValue({
        afterClosed: () => of(undefined),
      } as any);

      component.createHero();

      expect(dialogSpy.open).toHaveBeenCalledWith(SuperheroModalFormComponent, {
        width: '500px',
        disableClose: true,
        data: {
          hero: undefined,
        },
      });
    });
  });

  describe('goHome', () => {
    it('should navigate to home route', () => {
      component.goHome();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    });
  });

  describe('template rendering', () => {
    it('should show Add Hero button when isBaseRoute is true', () => {

      spyOnProperty(component, 'isBaseRoute').and.returnValue(true);

      fixture.detectChanges();

      const addHeroButton = fixture.debugElement.query(
        By.css('button[matButton="filled"]')
      );
      expect(addHeroButton).toBeTruthy();
      expect(addHeroButton.nativeElement.textContent.trim()).toBe('Add Hero');
    });

    it('should not show Add Hero button when isBaseRoute is false', () => {
      spyOnProperty(component, 'isBaseRoute').and.returnValue(false);

      fixture.detectChanges();

      const addHeroButton = fixture.debugElement.query(
        By.css('button[matButton="filled"]')
      );
      expect(addHeroButton).toBeFalsy();
    });

    it('should always show Hero List button', () => {
      const mockUrlTree = {
        root: {
          children: {
            primary: {
              segments: [{ path: 'heroes' }],
            },
          },
        },
      };
      routerSpy.parseUrl.and.returnValue(mockUrlTree as any);

      fixture.detectChanges();

      const heroListButton = fixture.debugElement.query(
        By.css('button:not([matButton="filled"])')
      );
      expect(heroListButton).toBeTruthy();
      expect(heroListButton.nativeElement.textContent.trim()).toBe('Hero List');
    });
  });

  describe('button interactions', () => {
    it('should call goHome when Hero List button is clicked', () => {
      spyOn(component, 'goHome');

      const mockUrlTree = {
        root: {
          children: {
            primary: {
              segments: [{ path: 'heroes' }],
            },
          },
        },
      };
      routerSpy.parseUrl.and.returnValue(mockUrlTree as any);

      fixture.detectChanges();

      const heroListButton = fixture.debugElement.query(
        By.css('button:not([matButton="filled"])')
      );
      heroListButton.nativeElement.click();

      expect(component.goHome).toHaveBeenCalled();
    });

    it('should call createHero when Add Hero button is clicked', () => {
      spyOn(component, 'createHero');
      spyOnProperty(component, 'isBaseRoute').and.returnValue(true);
      fixture.detectChanges();

      const addHeroButton = fixture.debugElement.query(
        By.css('button[matButton="filled"]')
      );
      addHeroButton.nativeElement.click();

      expect(component.createHero).toHaveBeenCalled();
    });
  });
});

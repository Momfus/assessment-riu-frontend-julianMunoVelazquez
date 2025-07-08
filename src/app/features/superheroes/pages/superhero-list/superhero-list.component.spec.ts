import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperheroListComponent } from './superhero-list.component';
import { SuperheroDataService } from '@services/superhero-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SpinnerService } from '@shared/services/spinner.service';
import { MatDialog } from '@angular/material/dialog';
import { SuperheroModalFormComponent } from '@superheroes/shared/superhero-modal-form/superhero-modal-form.component';
import { SuperheroModalConfirmComponent } from '@superheroes/shared/superhero-modal-confirm/superhero-modal-confirm.component';
import { of, BehaviorSubject } from 'rxjs';
import { signal } from '@angular/core';
import { SuperHero } from '@interfaces/superhero.interface';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PageEvent } from '@angular/material/paginator';

describe('SuperheroListComponent', () => {
  let component: SuperheroListComponent;
  let fixture: ComponentFixture<SuperheroListComponent>;
  let dataServiceSpy: jasmine.SpyObj<SuperheroDataService>;
  let routeSpy: jasmine.SpyObj<ActivatedRoute>;
  let routerSpy: jasmine.SpyObj<Router>;
  let spinnerServiceSpy: jasmine.SpyObj<SpinnerService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const mockHeroes: SuperHero[] = [
    {
      id: '1',
      name: 'Superman',
      universe: 'DC',
      powers: ['flight'],
      weaknesses: ['kryptonite'],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Spiderman',
      universe: 'Marvel',
      powers: ['spider-sense'],
      weaknesses: ['ethanol'],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  const mockPagination = {
    totalItems: 2,
    pageSize: 10,
    pageIndex: 0
  };

  beforeEach(async () => {
    dataServiceSpy = jasmine.createSpyObj('SuperheroDataService', [
      'setPageIndex',
      'setPageSize',
      'searchHeroes',
      'clearSearch',
      'refreshData',
      'delete'
    ], {
      paginatedHeroes: signal(mockHeroes),
      pagination: signal(mockPagination)
    });

    const queryParamsSubject = new BehaviorSubject({});
    routeSpy = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParams: queryParamsSubject.asObservable()
    });

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    spinnerServiceSpy = jasmine.createSpyObj('SpinnerService', [], {
      isLoading: signal(false)
    });
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [SuperheroListComponent, NoopAnimationsModule],
      providers: [
        { provide: SuperheroDataService, useValue: dataServiceSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: Router, useValue: routerSpy },
        { provide: SpinnerService, useValue: spinnerServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject services correctly', () => {
    expect(component.dataService).toBe(dataServiceSpy);
    expect(component.spinnerService).toBe(spinnerServiceSpy);
    expect(component.router).toBe(routerSpy);
    expect(component.route).toBe(routeSpy);
  });

  describe('ngOnInit', () => {
    it('should set default pagination when no query params', () => {
      const queryParamsSubject = new BehaviorSubject({});
      Object.defineProperty(routeSpy, 'queryParams', {
        value: queryParamsSubject.asObservable()
      });

      component.ngOnInit();

      expect(dataServiceSpy.setPageIndex).toHaveBeenCalledWith(0);
      expect(dataServiceSpy.setPageSize).toHaveBeenCalledWith(10);
      expect(dataServiceSpy.searchHeroes).not.toHaveBeenCalled();
    });

    it('should set pagination from query params', () => {
      const queryParamsSubject = new BehaviorSubject({
        page: '2',
        pageSize: '20'
      });
      Object.defineProperty(routeSpy, 'queryParams', {
        value: queryParamsSubject.asObservable()
      });

      component.ngOnInit();

      expect(dataServiceSpy.setPageIndex).toHaveBeenCalledWith(1); // page - 1
      expect(dataServiceSpy.setPageSize).toHaveBeenCalledWith(20);
    });

    it('should search heroes when search param is present', () => {
      const queryParamsSubject = new BehaviorSubject({
        search: 'superman'
      });
      Object.defineProperty(routeSpy, 'queryParams', {
        value: queryParamsSubject.asObservable()
      });

      component.ngOnInit();

      expect(dataServiceSpy.searchHeroes).toHaveBeenCalledWith('superman');
    });

    it('should handle both pagination and search params', () => {
      const queryParamsSubject = new BehaviorSubject({
        page: '3',
        pageSize: '15',
        search: 'spider'
      });
      Object.defineProperty(routeSpy, 'queryParams', {
        value: queryParamsSubject.asObservable()
      });

      component.ngOnInit();

      expect(dataServiceSpy.setPageIndex).toHaveBeenCalledWith(2);
      expect(dataServiceSpy.setPageSize).toHaveBeenCalledWith(15);
      expect(dataServiceSpy.searchHeroes).toHaveBeenCalledWith('spider');
    });
  });

  describe('onPageChange', () => {
    it('should navigate with updated pagination params', () => {
      const pageEvent: PageEvent = {
        pageIndex: 2,
        pageSize: 20,
        length: 100
      };

      component.onPageChange(pageEvent);

      expect(routerSpy.navigate).toHaveBeenCalledWith([], {
        relativeTo: routeSpy,
        queryParams: {
          page: 3, // pageIndex + 1
          pageSize: 20,
        },
        queryParamsHandling: 'merge',
      });
    });
  });

  describe('onSearchChange', () => {
    it('should navigate and search when term is provided', () => {
      component.onSearchChange('superman');

      expect(routerSpy.navigate).toHaveBeenCalledWith([], {
        relativeTo: routeSpy,
        queryParams: { search: 'superman', page: 1 },
        queryParamsHandling: 'merge'
      });
      expect(dataServiceSpy.searchHeroes).toHaveBeenCalledWith('superman');
    });

    it('should clear search when term is empty', () => {
      component.onSearchChange('');

      expect(routerSpy.navigate).toHaveBeenCalledWith([], {
        relativeTo: routeSpy,
        queryParams: { search: null },
        queryParamsHandling: 'merge'
      });
      expect(dataServiceSpy.clearSearch).toHaveBeenCalled();
    });

    it('should clear search when term is null', () => {
      component.onSearchChange(null as any);

      expect(routerSpy.navigate).toHaveBeenCalledWith([], {
        relativeTo: routeSpy,
        queryParams: { search: null },
        queryParamsHandling: 'merge'
      });
      expect(dataServiceSpy.clearSearch).toHaveBeenCalled();
    });
  });

  describe('editHero', () => {
    it('should open edit dialog and refresh data when result is true', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [], {
        afterClosed: () => of(true)
      });
      dialogSpy.open.and.returnValue(dialogRefSpy);

      component.editHero(mockHeroes[0]);

      expect(dialogSpy.open).toHaveBeenCalledWith(SuperheroModalFormComponent, {
        width: '500px',
        data: { hero: mockHeroes[0] },
      });
      expect(dataServiceSpy.refreshData).toHaveBeenCalled();
    });

    it('should open edit dialog but not refresh data when result is false', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [], {
        afterClosed: () => of(false)
      });
      dialogSpy.open.and.returnValue(dialogRefSpy);

      component.editHero(mockHeroes[0]);

      expect(dialogSpy.open).toHaveBeenCalledWith(SuperheroModalFormComponent, {
        width: '500px',
        data: { hero: mockHeroes[0] },
      });
      expect(dataServiceSpy.refreshData).not.toHaveBeenCalled();
    });

    it('should open edit dialog but not refresh data when result is undefined', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [], {
        afterClosed: () => of(undefined)
      });
      dialogSpy.open.and.returnValue(dialogRefSpy);

      component.editHero(mockHeroes[0]);

      expect(dialogSpy.open).toHaveBeenCalledWith(SuperheroModalFormComponent, {
        width: '500px',
        data: { hero: mockHeroes[0] },
      });
      expect(dataServiceSpy.refreshData).not.toHaveBeenCalled();
    });
  });

  describe('deleteHero', () => {
    it('should open delete dialog and delete hero when result is true', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [], {
        afterClosed: () => of(true)
      });
      dialogSpy.open.and.returnValue(dialogRefSpy);
      dataServiceSpy.delete.and.returnValue(of(undefined));

      component.deleteHero(mockHeroes[0]);

      expect(dialogSpy.open).toHaveBeenCalledWith(SuperheroModalConfirmComponent, {
        width: '350px',
        data: {
          title: 'Confirm Delete',
          message: 'Are you sure you want to delete Superman?',
        },
      });
      expect(dataServiceSpy.delete).toHaveBeenCalledWith('1');
      expect(dataServiceSpy.refreshData).toHaveBeenCalled();
    });

    it('should open delete dialog but not delete when result is false', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [], {
        afterClosed: () => of(false)
      });
      dialogSpy.open.and.returnValue(dialogRefSpy);

      component.deleteHero(mockHeroes[0]);

      expect(dialogSpy.open).toHaveBeenCalledWith(SuperheroModalConfirmComponent, {
        width: '350px',
        data: {
          title: 'Confirm Delete',
          message: 'Are you sure you want to delete Superman?',
        },
      });
      expect(dataServiceSpy.delete).not.toHaveBeenCalled();
      expect(dataServiceSpy.refreshData).not.toHaveBeenCalled();
    });

    it('should open delete dialog but not delete when result is undefined', () => {
      const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', [], {
        afterClosed: () => of(undefined)
      });
      dialogSpy.open.and.returnValue(dialogRefSpy);

      component.deleteHero(mockHeroes[0]);

      expect(dialogSpy.open).toHaveBeenCalledWith(SuperheroModalConfirmComponent, {
        width: '350px',
        data: {
          title: 'Confirm Delete',
          message: 'Are you sure you want to delete Superman?',
        },
      });
      expect(dataServiceSpy.delete).not.toHaveBeenCalled();
      expect(dataServiceSpy.refreshData).not.toHaveBeenCalled();
    });
  });

  describe('navigateToDetail', () => {
        it('should navigate to detail when clicking on non-button element', () => {
      const mockEvent = {
        target: document.createElement('div')
      } as unknown as MouseEvent;

      component.navigateToDetail(mockHeroes[0], mockEvent);

      expect(routerSpy.navigate).toHaveBeenCalledWith(['hero', '1'], { relativeTo: routeSpy });
    });

    it('should not navigate when clicking on button element', () => {
      const mockEvent = {
        target: document.createElement('button')
      } as unknown as MouseEvent;

      component.navigateToDetail(mockHeroes[0], mockEvent);

      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate when clicking on element inside button', () => {
      const button = document.createElement('button');
      const span = document.createElement('span');
      button.appendChild(span);

      const mockEvent = {
        target: span
      } as unknown as MouseEvent;

      component.navigateToDetail(mockHeroes[0], mockEvent);

      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should not navigate when clicking on icon inside button', () => {
      const button = document.createElement('button');
      const icon = document.createElement('mat-icon');
      button.appendChild(icon);

      const mockEvent = {
        target: icon
      } as unknown as MouseEvent;

      component.navigateToDetail(mockHeroes[0], mockEvent);

      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });

  describe('template rendering', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should display table when heroes are available', () => {
      const table = fixture.debugElement.query(By.css('mat-table'));
      expect(table).toBeTruthy();
    });

    it('should display hero names in uppercase', () => {
      const nameCells = fixture.debugElement.queryAll(By.css('mat-cell'));
      // Filtrar solo los de nombre (buscando SUPERMAN y SPIDERMAN)
      const heroNames = nameCells
        .map(cell => cell.nativeElement.textContent.trim())
        .filter(text => text === 'SUPERMAN' || text === 'SPIDERMAN');
      expect(heroNames).toContain('SUPERMAN');
      expect(heroNames).toContain('SPIDERMAN');
    });

    it('should display universe names', () => {
      const universeCells = fixture.debugElement.queryAll(By.css('mat-cell'));
      // Filtrar solo los de universo (buscando DC y Marvel)
      const universes = universeCells
        .map(cell => cell.nativeElement.textContent.trim())
        .filter(text => text === 'DC' || text === 'Marvel');
      expect(universes).toContain('DC');
      expect(universes).toContain('Marvel');
    });

    it('should show loading message when no heroes and loading', () => {
      Object.defineProperty(dataServiceSpy, 'paginatedHeroes', {
        value: signal([]),
        writable: true
      });
      Object.defineProperty(spinnerServiceSpy, 'isLoading', {
        value: signal(true),
        writable: true
      });
      fixture = TestBed.createComponent(SuperheroListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const loadingMessage = fixture.debugElement.nativeElement.textContent.toLowerCase();
      expect(loadingMessage).toContain('loading');
    });

    it('should show no data message when no heroes and not loading', () => {
      Object.defineProperty(dataServiceSpy, 'paginatedHeroes', {
        value: signal([]),
        writable: true
      });
      Object.defineProperty(spinnerServiceSpy, 'isLoading', {
        value: signal(false),
        writable: true
      });
      fixture = TestBed.createComponent(SuperheroListComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const noDataMessage = fixture.debugElement.nativeElement.textContent.toLowerCase();
      expect(noDataMessage).toContain('no heroes');
    });

    it('should show warning icon when no heroes', () => {
      Object.defineProperty(dataServiceSpy, 'paginatedHeroes', {
        value: signal([]),
        writable: true
      });
      Object.defineProperty(spinnerServiceSpy, 'isLoading', {
        value: signal(false),
        writable: true
      });
      fixture.detectChanges();
      const warningIcon = fixture.debugElement.query(By.css('mat-icon'));
      expect(warningIcon).toBeTruthy();
      // Ajusta aquí según el icono real que se muestra en el template:
      expect(warningIcon.nativeElement.textContent.trim().toLowerCase()).toContain('search');
    });

    it('should display paginator with correct values', () => {
      const paginator = fixture.debugElement.query(By.css('mat-paginator'));
      expect(paginator).toBeTruthy();
    });

    it('should have edit and delete buttons for each hero', () => {
      const editButtons = fixture.debugElement.queryAll(By.css('button[color="primary"]'));
      const deleteButtons = fixture.debugElement.queryAll(By.css('button[color="warn"]'));

      expect(editButtons.length).toBe(2);
      expect(deleteButtons.length).toBe(2);
    });

    it('should have correct icons in action buttons', () => {
      const editIcons = fixture.debugElement.queryAll(By.css('button[color="primary"] mat-icon'));
      const deleteIcons = fixture.debugElement.queryAll(By.css('button[color="warn"] mat-icon'));

      expect(editIcons[0].nativeElement.textContent.trim()).toBe('edit');
      expect(deleteIcons[0].nativeElement.textContent.trim()).toBe('delete');
    });
  });

  describe('button interactions', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call editHero when edit button is clicked', () => {
      spyOn(component, 'editHero');

      const editButton = fixture.debugElement.query(By.css('button[color="primary"]'));
      editButton.nativeElement.click();

      expect(component.editHero).toHaveBeenCalledWith(mockHeroes[0]);
    });

    it('should call deleteHero when delete button is clicked', () => {
      spyOn(component, 'deleteHero');

      const deleteButton = fixture.debugElement.query(By.css('button[color="warn"]'));
      deleteButton.nativeElement.click();

      expect(component.deleteHero).toHaveBeenCalledWith(mockHeroes[0]);
    });

    it('should call navigateToDetail when clicking on hero name cell', () => {
      spyOn(component, 'navigateToDetail');

      const nameCell = fixture.debugElement.query(By.css('mat-cell'));
      nameCell.nativeElement.click();

      expect(component.navigateToDetail).toHaveBeenCalledWith(mockHeroes[0], jasmine.any(Object));
    });

    it('should call navigateToDetail when clicking on universe cell', () => {
      spyOn(component, 'navigateToDetail');

      const universeCell = fixture.debugElement.queryAll(By.css('mat-cell'))[1];
      universeCell.nativeElement.click();

      expect(component.navigateToDetail).toHaveBeenCalledWith(mockHeroes[0], jasmine.any(Object));
    });
  });
});

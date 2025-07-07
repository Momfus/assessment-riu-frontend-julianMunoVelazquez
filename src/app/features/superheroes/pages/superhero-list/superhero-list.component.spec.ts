import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuperheroListComponent } from './superhero-list.component';
import { SuperheroDataService } from '@services/superhero-data.service';
import { SpinnerService } from '@shared/services/spinner.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { SuperHero } from '@interfaces/superhero.interface';
import { PageEvent } from '@angular/material/paginator';
import { signal } from '@angular/core';

const HEROES: SuperHero[] = [
  { id: '1', name: 'Superman', universe: 'DC', powers: ['flight'], weaknesses: ['kryptonite'], createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Spiderman', universe: 'Marvel', powers: ['spider-sense'], weaknesses: ['ethanol'], createdAt: new Date(), updatedAt: new Date() },
];

describe('SuperheroListComponent', () => {
  let component: SuperheroListComponent;
  let fixture: ComponentFixture<SuperheroListComponent>;
  let dataServiceSpy: jasmine.SpyObj<SuperheroDataService>;
  let spinnerSpy: jasmine.SpyObj<SpinnerService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let routeSpy: any;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    dataServiceSpy = jasmine.createSpyObj('SuperheroDataService', [
      'setPageIndex', 'setPageSize', 'searchHeroes', 'clearSearch', 'refreshData', 'delete'
    ], {
      paginatedHeroes: () => HEROES,
      pagination: signal({ pageIndex: 0, pageSize: 10, totalItems: HEROES.length })
    });
    spinnerSpy = jasmine.createSpyObj('SpinnerService', ['show', 'hide']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routeSpy = { queryParams: of({}), snapshot: { queryParams: {} } };
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [SuperheroListComponent],
      providers: [
        { provide: SuperheroDataService, useValue: dataServiceSpy },
        { provide: SpinnerService, useValue: spinnerSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: routeSpy },
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SuperheroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and set page index/size from query params', () => {
    component.ngOnInit();
    expect(dataServiceSpy.setPageIndex).toHaveBeenCalled();
    expect(dataServiceSpy.setPageSize).toHaveBeenCalled();
  });

  it('should handle page change', () => {
    const event: PageEvent = { pageIndex: 1, pageSize: 5, length: 10 };
    component.onPageChange(event);
    expect(routerSpy.navigate).toHaveBeenCalled();
  });

  it('should handle search change with term', () => {
    component.onSearchChange('man');
    expect(routerSpy.navigate).toHaveBeenCalled();
    expect(dataServiceSpy.searchHeroes).toHaveBeenCalledWith('man');
  });

  it('should handle search change with empty term', () => {
    component.onSearchChange('');
    expect(routerSpy.navigate).toHaveBeenCalled();
    expect(dataServiceSpy.clearSearch).toHaveBeenCalled();
  });

  it('should open edit dialog and refresh data after close with result', () => {
    const afterClosed$ = of(true);
    dialogSpy.open.and.returnValue({ afterClosed: () => afterClosed$ } as any);
    component.editHero(HEROES[0]);
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(dataServiceSpy.refreshData).toHaveBeenCalled();
  });

  it('should open delete dialog and call delete/refresh if confirmed', () => {
    const afterClosed$ = of(true);
    dialogSpy.open.and.returnValue({ afterClosed: () => afterClosed$ } as any);
    dataServiceSpy.delete.and.returnValue(of(void 0));
    component.deleteHero(HEROES[0]);
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(dataServiceSpy.delete).toHaveBeenCalledWith(HEROES[0].id);
    expect(dataServiceSpy.refreshData).toHaveBeenCalled();
  });

  it('should not call delete if dialog not confirmed', () => {
    const afterClosed$ = of(false);
    dialogSpy.open.and.returnValue({ afterClosed: () => afterClosed$ } as any);
    component.deleteHero(HEROES[0]);
    expect(dataServiceSpy.delete).not.toHaveBeenCalled();
  });

  it('should navigate to detail on row click (not button)', () => {
    const event = { target: document.createElement('div') } as unknown as MouseEvent;
    component.navigateToDetail(HEROES[0], event);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['hero', HEROES[0].id], { relativeTo: routeSpy });
  });

  it('should not navigate to detail if click is on a button', () => {
    const button = document.createElement('button');
    const event = { target: button } as unknown as MouseEvent;
    component.navigateToDetail(HEROES[0], event);
    expect(routerSpy.navigate).not.toHaveBeenCalledWith(['hero', HEROES[0].id], jasmine.anything());
  });
});

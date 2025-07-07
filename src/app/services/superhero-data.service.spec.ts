import { TestBed } from '@angular/core/testing';
import { SuperheroDataService } from './superhero-data.service';
import { SuperheroApiService } from './superhero-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SuperHero } from '@interfaces/superhero.interface';

const HEROES: SuperHero[] = [
  { id: '1', name: 'Superman', universe: 'DC', powers: ['flight'], weaknesses: ['kryptonite'], createdAt: new Date(), updatedAt: new Date() },
  { id: '2', name: 'Spiderman', universe: 'Marvel', powers: ['spider-sense'], weaknesses: ['ethanol'], createdAt: new Date(), updatedAt: new Date() },
  { id: '3', name: 'Batman', universe: 'DC', powers: ['intelligence'], weaknesses: ['none'], createdAt: new Date(), updatedAt: new Date() },
];

describe('SuperheroDataService', () => {
  let service: SuperheroDataService;
  let apiSpy: jasmine.SpyObj<SuperheroApiService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    apiSpy = jasmine.createSpyObj('SuperheroApiService', ['getAll', 'create', 'update', 'delete', 'search']);

    apiSpy.getAll.and.returnValue(of([]));
    apiSpy.create.and.returnValue(of({ id: '0', name: '', universe: 'DC', powers: [] }));
    apiSpy.update.and.returnValue(of({ id: '0', name: '', universe: 'DC', powers: [] }));
    apiSpy.delete.and.returnValue(of(void 0));
    apiSpy.search.and.returnValue(of([]));
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], { snapshot: { queryParams: {} } });

    TestBed.configureTestingModule({
      providers: [
        SuperheroDataService,
        { provide: SuperheroApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    });
    service = TestBed.inject(SuperheroDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all heroes', () => {
    apiSpy.getAll.and.returnValue(of(HEROES));
    service.refreshData();
    expect(apiSpy.getAll).toHaveBeenCalled();
  });

  it('should create a hero and refresh data', (done) => {
    apiSpy.create.and.returnValue(of(HEROES[0]));
    spyOn(service, 'refreshData').and.callThrough();
    service.create({ name: 'Ironman', universe: 'Marvel', powers: ['tech'] }).subscribe(() => {
      expect(apiSpy.create).toHaveBeenCalled();
      expect(service.refreshData).toHaveBeenCalled();
      done();
    });
  });

  it('should update a hero and refresh data', (done) => {
    apiSpy.update.and.returnValue(of(HEROES[0]));
    spyOn(service, 'refreshData').and.callThrough();
    service.update(HEROES[0]).subscribe(() => {
      expect(apiSpy.update).toHaveBeenCalled();
      expect(service.refreshData).toHaveBeenCalled();
      done();
    });
  });

  it('should delete a hero and refresh data', (done) => {
    apiSpy.delete.and.returnValue(of(void 0));
    spyOn(service, 'refreshData').and.callThrough();
    service.delete('1').subscribe(() => {
      expect(apiSpy.delete).toHaveBeenCalledWith('1');
      expect(service.refreshData).toHaveBeenCalled();
      done();
    });
  });

  it('should search heroes by term', () => {
    apiSpy.search.and.returnValue(of([HEROES[1]]));
    service.searchHeroes('Spider');

    service.allHeroes();
    expect(service['searchTerm']()).toBe('Spider');
    expect(apiSpy.search).toHaveBeenCalledWith('Spider');
  });

  it('should clear search', () => {
    apiSpy.getAll.and.returnValue(of(HEROES));
    service.clearSearch();
    expect(service['searchTerm']()).toBe('');
    expect(apiSpy.getAll).toHaveBeenCalled();
  });

  it('should set page index within bounds', () => {
    service.pagination.set({ pageIndex: 0, pageSize: 10, totalItems: 30 });
    service.setPageIndex(2);
    expect(service.pagination().pageIndex).toBe(2);
    service.setPageIndex(-1);
    expect(service.pagination().pageIndex).toBe(0);
    service.setPageIndex(100);
    expect(service.pagination().pageIndex).toBe(service.totalPages() - 1);
  });

  it('should set page size and adjust page index', () => {
    service.pagination.set({ pageIndex: 2, pageSize: 10, totalItems: 30 });
    service.setPageSize(5);
    expect(service.pagination().pageSize).toBe(5);
    expect(service.pagination().pageIndex).toBeLessThanOrEqual(Math.ceil(30 / 5) - 1);
  });

  it('should calculate total pages correctly', () => {
    service.pagination.set({ pageIndex: 0, pageSize: 10, totalItems: 25 });
    expect(service.totalPages()).toBe(3);
    service.pagination.set({ pageIndex: 0, pageSize: 10, totalItems: 0 });
    expect(service.totalPages()).toBe(1);
  });

  it('should adjust pagination and navigate if pageIndex is out of bounds', () => {
    service.pagination.set({ pageIndex: 5, pageSize: 10, totalItems: 20 });
    spyOn(service, 'allHeroes').and.returnValue(HEROES);
    service['adjustPagination']();
    expect(routerSpy.navigate).toHaveBeenCalled();
  });
});

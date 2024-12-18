import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { HeroesListComponent } from './heroes-list.component';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../models/hero.model';
import { of } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('HeroesListComponent', () => {
  let component: HeroesListComponent;
  let fixture: ComponentFixture<HeroesListComponent>;
  let mockHeroesService: jasmine.SpyObj<HeroesService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  const heroesMock: Hero[] = [
    { id: '1', name: 'Superman' },
    { id: '2', name: 'Batman' },
    { id: '3', name: 'Spiderman' },
  ];

  beforeEach(async () => {
    mockHeroesService = jasmine.createSpyObj('HeroesService', ['getHeroes', 'searchHeroes', 'deleteHero']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        HeroesListComponent,
        BrowserAnimationsModule,
      ],
      providers: [
        provideRouter([]),
        { provide: HeroesService, useValue: mockHeroesService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => '1' } } } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesListComponent);
    component = fixture.componentInstance;
    mockHeroesService.getHeroes.and.returnValue(of(heroesMock));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch heroes on init', () => {
    expect(mockHeroesService.getHeroes).toHaveBeenCalled();
    expect(component.heroes()).toEqual(heroesMock);
  });

  it('should update paginated heroes on page change', () => {
    component.onPageChange({ pageIndex: 1, pageSize: 1, length: 3 } as any);
    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(1);
    expect(component.paginatedHeroes()).toEqual([heroesMock[1]]);
  });

  it('should search heroes based on search term', fakeAsync(() => {
    const searchTerm = 'Superman';
    mockHeroesService.searchHeroes.and.returnValue(of([heroesMock[0]]));

    component.searchForm.get('searchTerm')?.setValue(searchTerm);
    tick(500);
    fixture.detectChanges();

    expect(mockHeroesService.searchHeroes).toHaveBeenCalledWith(searchTerm);
    expect(component.heroes()).toEqual([heroesMock[0]]);

    flush();
  }));

  it('should fetch heroes when search term is empty', fakeAsync(() => {
    const searchTerm = '';
    mockHeroesService.getHeroes.and.returnValue(of(heroesMock));

    component.searchForm.get('searchTerm')?.setValue(searchTerm);
    tick(500);
    fixture.detectChanges();

    expect(mockHeroesService.getHeroes).toHaveBeenCalled();
    expect(component.heroes()).toEqual(heroesMock);

    flush();
  }));

  it('should paginate heroes correctly', () => {
    component.pageIndex = 0;
    component.pageSize = 2;
    component.updatePaginatedHeroes();

    expect(component.paginatedHeroes()).toEqual([heroesMock[0], heroesMock[1]]);

    component.onPageChange({ pageIndex: 1, pageSize: 2, length: 3 } as any);
    expect(component.paginatedHeroes()).toEqual([heroesMock[2]]);
  });
});

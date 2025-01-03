import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../models/hero.model';
import { of, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeroesFormComponent } from './heroes-form.component';
import { Location } from '@angular/common';

describe('HeroesFormComponent', () => {
  let component: HeroesFormComponent;
  let fixture: ComponentFixture<HeroesFormComponent>;
  let mockHeroesService: jasmine.SpyObj<HeroesService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let router: Router;
  let location: Location;

  const heroesMock: Hero[] = [
    { id: '1', name: 'Superman' },
    { id: '2', name: 'Batman' },
    { id: '3', name: 'Spiderman' },
  ];

  beforeEach(async () => {
    mockHeroesService = jasmine.createSpyObj('HeroesService', [
      'getHeroes',
      'getHeroById',
      'addHero',
      'updateHero',
      'deleteHero',
    ]);

    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [HeroesFormComponent, BrowserAnimationsModule],
      providers: [
        provideRouter([]),
        { provide: HeroesService, useValue: mockHeroesService },
        { provide: MatDialog, useValue: mockDialog },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesFormComponent);
    component = fixture.componentInstance;

    mockHeroesService.getHeroById.and.returnValue(
      of({ id: '1', name: 'Superman' })
    );
    mockHeroesService.getHeroes.and.returnValue(of(heroesMock));
    mockDialog.open.and.returnValue({ afterClosed: () => of(false) } as any);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load hero data if heroId exists', () => {
    const formValue = component.heroForm.value;
    expect(formValue.id).toBe('1');
    expect(formValue.name.toLowerCase()).toBe('superman');
  });

  it('should validate the form as invalid if name is empty', () => {
    component.heroForm.get('name')?.setValue('');
    expect(component.heroForm.invalid).toBeTrue();
  });

  it('should validate the form as valid with correct input', () => {
    component.heroForm.get('name')?.setValue('Wonder Woman');
    expect(component.heroForm.valid).toBeTrue();
  });

  it('should call updateHero when heroId exists', () => {
    spyOn(router, 'navigate');
    const updateHeroSpy = mockHeroesService.updateHero.and.returnValue(
      of({ id: '1', name: 'Updated Hero' })
    );

    component.saveHero();

    expect(updateHeroSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should call addHero when heroId does not exist', () => {
    spyOn(router, 'navigate');
    mockHeroesService.getHeroes.and.returnValue(of(heroesMock));
    const addHeroSpy = mockHeroesService.addHero.and.returnValue(
      of({ id: '4', name: 'Green Lantern' })
    );

    component.heroId = null;
    component.heroForm.get('name')?.setValue('Green Lantern');

    component.saveHero();

    expect(addHeroSpy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle errors when saveHero fails', () => {
    spyOn(console, 'error');
    const errorMessage = 'Update failed';
    mockHeroesService.updateHero.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    component.saveHero();

    expect(mockHeroesService.updateHero).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error updating hero:',
      errorMessage
    );
  });

  it('should navigate back when cancel is called', () => {
    spyOn(router, 'navigate');

    component.cancel();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle errors when fetching heroes fails', () => {
    spyOn(console, 'error');
    const errorMessage = 'Error fetching heroes';
    mockHeroesService.getHeroes.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    component.heroId = null;
    component.saveHero();

    expect(mockHeroesService.getHeroes).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching heroes:',
      errorMessage
    );
  });

  it('should handle errors when adding hero fails', () => {
    spyOn(console, 'error');
    const errorMessage = 'Error adding hero';
    mockHeroesService.getHeroes.and.returnValue(of(heroesMock));
    mockHeroesService.addHero.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    component.heroId = null;
    component.heroForm.get('name')?.setValue('Flash');

    component.saveHero();

    expect(mockHeroesService.addHero).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error adding hero:',
      errorMessage
    );
  });

  it('should handle errors when updating hero fails', () => {
    spyOn(console, 'error');
    const errorMessage = 'Error updating hero';
    mockHeroesService.updateHero.and.returnValue(
      throwError(() => new Error(errorMessage))
    );

    component.heroId = '1';
    component.heroForm.get('name')?.setValue('Aquaman');

    component.saveHero();

    expect(mockHeroesService.updateHero).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Error updating hero:',
      errorMessage
    );
  });

  it('should prevent default and stop propagation when event is provided', () => {
    const preventDefaultSpy = jasmine.createSpy('preventDefault');
    const stopPropagationSpy = jasmine.createSpy('stopPropagation');

    const eventMock = {
      preventDefault: preventDefaultSpy,
      stopPropagation: stopPropagationSpy,
    } as unknown as Event;

    component.heroId = null;
    component.heroForm.get('name')?.setValue('Hero Test');

    mockHeroesService.addHero.and.returnValue(of({ id: '5', name: 'Hero Test' }));

    component.saveHero(eventMock);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(mockHeroesService.addHero).toHaveBeenCalled();
  });
});

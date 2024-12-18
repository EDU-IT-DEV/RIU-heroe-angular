import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HeroesService } from './heroes.service';
import { Hero } from '../models/hero.model';

describe('HeroesService', () => {
  let service: HeroesService;
  let httpMock: HttpTestingController;

  const mockApiUrl = 'http://localhost:3000';
  const mockHero: Hero = { id: '1', name: 'Superman' };
  const mockHeroes: Hero[] = [
    { id: '1', name: 'Superman' },
    { id: '2', name: 'Batman' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HeroesService]
    });

    service = TestBed.inject(HeroesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all heroes via GET', () => {
    const url = `${mockApiUrl}/heroes`;

    service.getHeroes().subscribe((heroes) => {
      expect(heroes.length).toBe(2);
      expect(heroes).toEqual(mockHeroes);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes);
  });

  it('should retrieve a hero by ID via GET', () => {
    const heroId = '1';
    const url = `${mockApiUrl}/heroes/${heroId}`;

    service.getHeroById(heroId).subscribe((hero) => {
      expect(hero).toEqual(mockHero);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockHero);
  });

  it('should return null if hero is not found', () => {
    const heroId = '999';
    const url = `${mockApiUrl}/heroes/${heroId}`;

    service.getHeroById(heroId).subscribe((hero) => {
      expect(hero).toBeNull();
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(null);
  });

  it('should add a new hero via POST', () => {
    const newHero: Hero = { id: '3', name: 'Flash' };
    const url = `${mockApiUrl}/heroes`;

    service.addHero(newHero).subscribe((hero) => {
      expect(hero).toEqual(newHero);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newHero);
    req.flush(newHero);
  });

  it('should search heroes by name', () => {
    const searchTerm = 'man';
    const url = `${mockApiUrl}/heroes`;

    service.searchHeroes(searchTerm).subscribe((heroes) => {
      expect(heroes.length).toBe(2);
      expect(heroes).toEqual(mockHeroes);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes);
  });

  it('should return an empty array if no heroes match the search term', () => {
    const searchTerm = 'unknown';
    const url = `${mockApiUrl}/heroes`;

    service.searchHeroes(searchTerm).subscribe((heroes) => {
      expect(heroes.length).toBe(0);
      expect(heroes).toEqual([]);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes);
  });

  it('should update a hero', () => {
    const updatedHero: Hero = { id: '1', name: 'Updated Hero' };
    const url = `${mockApiUrl}/heroes/${updatedHero.id}`;

    service.updateHero(updatedHero).subscribe((hero) => {
      expect(hero).toEqual(updatedHero);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedHero);
  });

  it('should delete a hero', () => {
    const heroId = '1';
    const url = `${mockApiUrl}/heroes/${heroId}`;

    service.deleteHero(heroId).subscribe(() => {
      expect(true).toBe(true);
    });

    const req = httpMock.expectOne(url);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});

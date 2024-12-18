import { TestBed, async, inject } from '@angular/core/testing';
import { HeroesService } from './heroes.service';

describe('Service: Heroes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeroesService]
    });
  });

  it('should ...', inject([HeroesService], (service: HeroesService) => {
    expect(service).toBeTruthy();
  }));
});

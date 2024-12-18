import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService]
    });

    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize loading signal with false', () => {
    expect(service.loading()).toBeFalse();
  });

  it('should set loading to true', () => {
    const expectedValue = true;

    service.setLoading(expectedValue);

    expect(service.loading()).toBeTrue();
  });

  it('should set loading to false', () => {

    const expectedValue = false;
    service.setLoading(true);

    service.setLoading(expectedValue);

    expect(service.loading()).toBeFalse();
  });

  it('should toggle loading state correctly', () => {
    service.setLoading(true);
    expect(service.loading()).toBeTrue();

    service.setLoading(false);
    expect(service.loading()).toBeFalse();

    service.setLoading(true);
    expect(service.loading()).toBeTrue();
  });
});

import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LoadingService } from './services/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  let loadingServiceSpy: jasmine.SpyObj<LoadingService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('LoadingService', ['loading']);

    await TestBed.configureTestingModule({
      imports: [AppComponent, MatProgressSpinnerModule, RouterTestingModule],
      providers: [{ provide: LoadingService, useValue: spy }]
    }).compileComponents();

    loadingServiceSpy = TestBed.inject(LoadingService) as jasmine.SpyObj<LoadingService>;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should show loading spinner when isLoading is true', () => {
    loadingServiceSpy.loading.and.returnValue(true);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-progress-spinner')).toBeTruthy();
  });

  it('should not show loading spinner when isLoading is false', () => {
    loadingServiceSpy.loading.and.returnValue(false);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-progress-spinner')).toBeNull();
  });

  it('should render router-outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const environment = {
  apiUrl: 'http://localhost:3000'
};

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync()]
};

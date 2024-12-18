import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  loading = signal<boolean>(false);
  setLoading(value: boolean) {
    this.loading.set(value);
  }
}

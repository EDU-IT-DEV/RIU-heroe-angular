import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'heroUppercase',
  standalone: true
})
export class HeroUppercasePipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.toUpperCase() : '';
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Hero } from '../models/hero.model';
import { environment } from '../app.config';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.apiUrl}/heroes`);
  }

  getHeroById(id: string): Observable<Hero | null> {
    return this.http
      .get<Hero>(`${this.apiUrl}/heroes/${id}`)
      .pipe(map((hero) => (hero ? hero : null)));
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(`${this.apiUrl}/heroes`, hero);
  }

  updateHero(hero: Hero): Observable<Hero> {
    return this.http
      .put<Hero>(`${this.apiUrl}/heroes/${hero.id}`, hero)
      .pipe(tap((value) => console.log('Hero updated!', value)));
  }

  deleteHero(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/heroes/${id}`);
  }

  searchHeroes(term: string): Observable<Hero[]> {
    return this.getHeroes().pipe(
      map((heroes: Hero[]) =>
        heroes.filter((hero) =>
          hero.name.toLowerCase().includes(term.toLowerCase())
        )
      )
    );
  }
}

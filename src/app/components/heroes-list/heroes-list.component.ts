import { Component, OnInit, signal } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../models/hero.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-heroes-list',
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterLink,
    MatDialogModule
  ]
})
export class HeroesListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  heroes = signal<Hero[]>([]);
  searchForm: FormGroup;

  constructor(
    private heroesService: HeroesService,
    private fb: FormBuilder,
  ) {
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }

  ngOnInit(): void {
    this.fetchHeroes();
    this.searchForm.get('searchTerm')?.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((term: string) => {
      const trimmedTerm = term.trim();
      if (trimmedTerm) {
        this.heroesService.searchHeroes(trimmedTerm).subscribe(data => {
          this.heroes.set(data);
        });
      } else {
        this.fetchHeroes();
      }
    });
  }

  fetchHeroes(): void {
    this.heroesService.getHeroes().subscribe(data => {
      this.heroes.set(data);
    });
  }

  deleteHero(id: string): void {
    this.heroesService.deleteHero(id).subscribe(() => this.fetchHeroes());
  }
}

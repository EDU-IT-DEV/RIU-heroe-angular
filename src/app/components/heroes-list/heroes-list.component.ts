import { Component, OnInit, signal } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../models/hero.model';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog.component';

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
    MatPaginatorModule,
    RouterLink,
    MatDialogModule,
    MatCardModule
  ]
})
export class HeroesListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'actions'];
  heroes = signal<Hero[]>([]);
  paginatedHeroes = signal<Hero[]>([]);
  searchForm: FormGroup;

  pageSize = 10;
  pageIndex = 0;

  constructor(
    private heroesService: HeroesService,
    private fb: FormBuilder,
    private dialog: MatDialog
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
          this.updatePaginatedHeroes();
        });
      } else {
        this.fetchHeroes();
      }
    });
  }

  fetchHeroes(): void {
    this.heroesService.getHeroes().subscribe(data => {
      this.heroes.set(data);
      this.updatePaginatedHeroes();
    });
  }

  updatePaginatedHeroes(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedHeroes.set(this.heroes().slice(startIndex, endIndex));
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedHeroes();
  }

  deleteHero(id: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      width: '300px',
      data: { message: '¿Seguro que quieres borrar este héroe?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.heroesService.deleteHero(id).subscribe(() => this.fetchHeroes());
      }
    });
  }
}

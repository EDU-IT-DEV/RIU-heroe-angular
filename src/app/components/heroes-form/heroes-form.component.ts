import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../models/hero.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { UppercaseDirective } from '../../directives/uppercase.directive';

@Component({
  selector: 'app-heroes-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    UppercaseDirective,
  ],
  templateUrl: './heroes-form.component.html',
  styleUrls: ['./heroes-form.component.scss'],
})
export class HeroesFormComponent implements OnInit {
  heroId: string | null = null;
  heroForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private heroesService: HeroesService
  ) {
    this.heroForm = this.fb.group({
      id: [''],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ ]+$'),
        ],
      ],
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.heroId = idParam;
      this.heroesService.getHeroById(this.heroId).subscribe((hero) => {
        if (hero) {
          this.heroForm.patchValue({
            ...hero,
            id: hero.id,
          });
          const nameControl = this.heroForm.get('name');
          if (nameControl?.value) {
            nameControl.setValue((nameControl.value).toUpperCase());
          }
        }
      });
    }
  }

  saveHero(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const hero: Hero = this.heroForm.value;

    hero.name = hero.name.toUpperCase();

    if (this.heroId) {
      this.heroesService.updateHero(hero).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => console.error('Error updating hero:', err.message),
      });
    } else {
      this.heroesService.getHeroes().subscribe({
        next: (heroes) => {
          const maxId =
            heroes.length > 0
              ? Math.max(...heroes.map((h) => Number(h.id)))
              : 0;
          hero.id = (maxId + 1).toString();
          this.heroesService.addHero(hero).subscribe({
            next: () => this.router.navigate(['/']),
            error: (err) => console.error('Error adding hero:', err.message),
          });
        },
        error: (err) => console.error('Error fetching heroes:', err.message),
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}

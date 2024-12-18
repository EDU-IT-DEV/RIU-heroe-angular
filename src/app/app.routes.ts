import { Routes } from '@angular/router';
import { HeroesListComponent } from './components/heroes-list/heroes-list.component';
import { HeroesFormComponent } from './components/heroes-form/heroes-form.component';

export const routes: Routes = [
  { path: '', component: HeroesListComponent },
  { path: 'add', component: HeroesFormComponent },
  { path: 'edit/:id', component: HeroesFormComponent },
  { path: '**', redirectTo: '' }
];

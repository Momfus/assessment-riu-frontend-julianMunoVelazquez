import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadChildren: () => import('./features/superheroes/superheroes.routes')
  }

];

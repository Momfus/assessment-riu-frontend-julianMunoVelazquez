import { Routes } from "@angular/router";
import { PageNotFoundComponent } from "../../shared/components/page-not-found/page-not-found.component";
import { SuperheroesLayoutComponent } from "./layouts/superheroes-layout/superheroes-layout.component";
import { SuperheroDetailComponent } from "./pages/superhero-detail/superhero-detail.component";
import { SuperheroListComponent } from "./pages/superhero-list/superhero-list.component";


export const superHeroesRoutes: Routes = [
  {
    path: 'heroes',
    component: SuperheroesLayoutComponent,
    children: [
      {
        path: '',
        component: SuperheroListComponent
      },
      {
        path: 'hero/:id',
        component: SuperheroDetailComponent
      },
      {
        path: '**',
        component: PageNotFoundComponent
      }
    ]
  },

  {
    path: '**',
    redirectTo: 'heroes',
    pathMatch: 'full'
  }
];

export default superHeroesRoutes;

import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AuthGuard } from './_helpers/auth.guard'
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component'
import { LoginComponent } from './pages/login/login.component'
import { HomeComponent } from './pages/home/home.component'
import { StoryComponent } from './pages/story/story.component'
import { ReadComponent } from './pages/read/read.component'
import { FavoriteComponent } from './pages/favorite/favorite.component'
import { HistoryComponent } from './pages/history/history.component'
import { RegisterComponent } from './pages/register/register.component'
import { SearchStoryComponent } from './pages/searchStory/searchStory.component'

const routes: Routes = [
  // { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'story/:id',
    component: StoryComponent,
  },
  {
    path: 'read/:storyId/:chapterId',
    component: ReadComponent,
  },
  {
    path: 'favorite',
    component: FavoriteComponent,
  },
  {
    path: 'history',
    component: HistoryComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'search',
    component: SearchStoryComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

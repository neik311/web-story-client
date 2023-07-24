import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CategoryComponent } from './category/category.component'
import { StoryComponent } from './story/story.component'
import { ChapterComponent } from './chapter/chapter.component'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'category', component: CategoryComponent },
      { path: 'story', component: StoryComponent },
      { path: 'chapter/:id', component: ChapterComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

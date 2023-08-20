import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CategoryComponent } from './category/category.component'
import { StoryComponent } from './story/story.component'
import { ChapterComponent } from './chapter/chapter.component'
import { CommentComponent } from './comment/comment.component'
import { UserComponent } from './user/user.component'

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'category', component: CategoryComponent },
      { path: 'story', component: StoryComponent },
      { path: 'user', component: UserComponent },
      { path: 'chapter/:id', component: ChapterComponent },
      { path: 'comment/:id', component: CommentComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

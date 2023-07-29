import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { enumData } from '../../core/enumData'
import { ApiService, CoreService, NotifyService } from '../../services'

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
})
export class StoryComponent implements OnInit {
  storyId: string = ''
  story: any = {}
  lstChapter: any[] = []

  constructor(private route: ActivatedRoute, private notifyService: NotifyService, private apiService: ApiService) {}

  ngOnInit() {
    this.storyId = this.route.snapshot.paramMap.get('id') || ''
    this.loadDataStory()
    this.loadChapter()
  }

  loadDataStory() {
    this.apiService.post(this.apiService.STORY.GET_STORY, { id: this.storyId }).then((res: any) => {
      this.story = res
      // console.log(res)
      // this.notifyService.hideloading()
    })
  }

  loadChapter() {
    this.apiService.post(this.apiService.CHAPTER.GET_CHAPTER_BY_STORY, { id: this.storyId }).then((res: any) => {
      this.lstChapter = res
      console.log(res)
    })
  }
}

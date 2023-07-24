import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { enumData } from '../../../core/enumData'
import { ApiService, CoreService, NotifyService } from '../../../services'
import { AddOrEditChapterComponent } from './add-or-edit-chapter/add-or-edit-chapter.component'
// import { AddOrEditStoryComponent } from './add-or-edit-story/add-or-edit-story.component'

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
})
export class ChapterComponent implements OnInit {
  pageIndex = enumData.Page.pageIndex
  pageSize = enumData.Page.pageSize
  lstPageSize = enumData.Page.lstPageSize
  total = enumData.Page.total
  pageSizeMax = enumData.Page.pageSizeMax
  loading = true
  storyId: string = ''
  story: any = {}
  lstChapter: any[] = []

  constructor(
    private route: ActivatedRoute,
    private notifyService: NotifyService,
    private apiService: ApiService,
    private coreService: CoreService,
    private dialog: MatDialog,
  ) {}

  async ngOnInit() {
    this.notifyService.showloading()
    this.storyId = this.route.snapshot.paramMap.get('id') || ''
    await this.loadData()
    this.notifyService.hideloading()
  }

  async loadData(reset = false) {
    this.loading = true
    if (reset) this.pageIndex = 1
    const [story, lstChapter]: [any, any] = await Promise.all([
      this.apiService.post(this.apiService.STORY.GET_STORY, { id: this.storyId }),
      this.apiService.post(this.apiService.CHAPTER.GET_CHAPTER_BY_STORY, { id: this.storyId }),
    ])
    this.story = story
    this.lstChapter = lstChapter
    this.loading = false
  }

  clickAdd() {
    this.dialog
      .open(AddOrEditChapterComponent, { disableClose: false })
      .afterClosed()
      .subscribe((res: any) => {
        if (res) {
          this.loadData()
        }
      })
  }

  clickEdit(object: any) {
    this.dialog
      .open(AddOrEditChapterComponent, { disableClose: false, data: object })
      .afterClosed()
      .subscribe((res: any) => {
        if (res) this.loadData()
      })
  }

  clickDetail(data: any) {}

  onActive(data: any) {
    this.notifyService.showloading()
    this.apiService.post(this.apiService.STORY.DELETE, { id: data.id }).then((res: any) => {
      this.notifyService.hideloading()
      if (res) {
        this.notifyService.showSuccess('Cập nhật trạng thái thành công!')
        this.loadData()
      }
    })
  }
}

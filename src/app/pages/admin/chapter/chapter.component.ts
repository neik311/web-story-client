import { NzAvatarModule } from 'ng-zorro-antd/avatar'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { enumData } from '../../../core/enumData'
import { ApiService, CoreService, NotifyService } from '../../../services'
import { AddOrEditChapterComponent } from './add-or-edit-chapter/add-or-edit-chapter.component'
import { ChapterDetailComponent } from './chapter-detail/chapter-detail.component'
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
  dataSearch: any = {}
  loading = true
  storyId: string = ''
  story: any = {}
  lstChapter: any[] = []
  dataFilterStatus: any[] = []

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
    this.dataFilterStatus = this.coreService.convertObjToArray(enumData.StatusFilter)
    this.dataSearch.isDeleted = enumData.StatusFilter.Active.value
    await this.loadData()
    this.notifyService.hideloading()
  }

  async loadData(reset = false) {
    if (reset) this.pageIndex = 1
    const where = await this.filterDataSearch()
    this.loading = true
    const dataSearch = {
      where: where,
      skip: (this.pageIndex - 1) * this.pageSize,
      take: this.pageSize,
    }

    const [story, lstChapter]: [any, any] = await Promise.all([
      this.apiService.post(this.apiService.STORY.GET_STORY, { id: this.storyId }),
      this.apiService.post(this.apiService.CHAPTER.PAGINATION, dataSearch),
    ])
    this.story = story
    this.lstChapter = lstChapter[0]
    this.total = lstChapter[1]
    this.loading = false
  }

  async filterDataSearch(dataSearch?: any) {
    if (!dataSearch) dataSearch = this.dataSearch
    const where: any = { storyId: this.storyId }
    if (dataSearch.name && dataSearch.name !== '') where.name = dataSearch.name
    if (dataSearch.isDeleted === false || dataSearch.isDeleted === true) where.isDeleted = dataSearch.isDeleted
    return where
  }

  clickAdd() {
    this.dialog
      .open(AddOrEditChapterComponent, { disableClose: false, data: { storyId: this.storyId, type: this.story.type, storyName: this.story.name } })
      .afterClosed()
      .subscribe((res: any) => {
        if (res) {
          this.loadData()
        }
      })
  }

  clickEdit(object: any) {
    this.dialog
      .open(AddOrEditChapterComponent, {
        disableClose: false,
        data: { ...object, storyId: this.storyId, type: this.story.type, storyName: this.story.name },
      })
      .afterClosed()
      .subscribe((res: any) => {
        if (res) this.loadData()
      })
  }

  clickDetail(data: any) {
    this.dialog
      .open(ChapterDetailComponent, {
        disableClose: false,
        data: { ...data, storyId: this.storyId, type: this.story.type, storyName: this.story.name },
      })
      .afterClosed()
      .subscribe()
  }

  onActive(data: any) {
    this.notifyService.showloading()
    this.apiService.post(this.apiService.CHAPTER.DELETE, { id: data.id }).then((res: any) => {
      this.notifyService.hideloading()
      if (res) {
        this.notifyService.showSuccess('Cập nhật trạng thái thành công!')
        this.loadData()
      }
    })
  }
}

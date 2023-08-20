import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { enumData } from '../../../core/enumData'
import { ApiService, CoreService, NotifyService } from '../../../services'
import { AddOrEditStoryComponent } from './add-or-edit-story/add-or-edit-story.component'
import { StoryDetailComponent } from './story-detail/story-detail.component'
import { StoryPrintComponent } from './story-print/story-print.component'

@Component({
  templateUrl: './story.component.html',
})
export class StoryComponent implements OnInit {
  pageIndex = enumData.Page.pageIndex
  pageSize = enumData.Page.pageSize
  lstPageSize = enumData.Page.lstPageSize
  total = enumData.Page.total
  pageSizeMax = enumData.Page.pageSizeMax
  loading = true
  dataSearch: any = {
    name: null,
    type: null,
    finished: null,
    sortBy: 'updatedAt',
    orderBy: 'DESC',
    lstCateId: [],
  }
  listOfData: any[] = []
  lstStoryType: any[] = []
  lstCate: any[] = []
  lstSortBy: any[] = [
    { value: 'updatedAt', name: 'Thời gian cập nhật' },
    { value: 'name', name: 'Tên' },
    { value: 'totalView', name: 'Lượt xem' },
    { value: 'commentCount', name: 'Lượt bình luận' },
    { value: 'favoriteCount', name: 'Lượt yêu thích' },
    { value: 'chapterCount', name: 'Số chương' },
  ]
  lstOrderBy: any[] = [
    { value: 'DESC', name: 'Giảm dần' },
    { value: 'ASC', name: 'Tăng dần' },
  ]
  isVisible = false
  currentStoryId: string = ''
  isCollapseFilter = false
  dataFilterStatus: any[] = []
  constructor(
    private notifyService: NotifyService,
    private apiService: ApiService,
    private coreService: CoreService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.dataFilterStatus = this.coreService.convertObjToArray(enumData.StatusFilter)
    this.lstStoryType = this.coreService.convertObjToArray(enumData.StoryType)
    this.dataSearch.isDeleted = enumData.StatusFilter.Active.value
    this.searchData(true)
    this.loadDataCategory()
  }

  async searchData(reset = false) {
    if (reset) this.pageIndex = 1
    const where = await this.filterDataSearch()
    this.loading = true
    const dataSearch = {
      where: where,
      skip: (this.pageIndex - 1) * this.pageSize,
      take: this.pageSize,
    }

    this.apiService.post(this.apiService.STORY.PAGINATION, dataSearch).then((res: any) => {
      if (res) {
        this.loading = false
        this.total = res[1]
        this.listOfData = res[0]
      }
    })
  }

  loadDataCategory() {
    this.apiService.post(this.apiService.CATEGORY.PAGINATION, { where: { isDeleted: false }, skip: 0, take: this.pageSizeMax }).then((res: any) => {
      this.lstCate = res[0]
      this.notifyService.hideloading()
    })
  }

  navigateToChapter(storyId: string) {
    this.router.navigate([`admin/chapter/${storyId}`])
  }

  navigateToComment(storyId: string) {
    this.router.navigate([`admin/comment/${storyId}`])
  }
  // loadDataSelectBox() {
  //   this.apiService.post(this.apiService..DATA_SELECT, {}).then((res: any) => {
  //     if (res) {
  //       this.lstType = res
  //     }
  //   })
  // }

  async filterDataSearch(dataSearch?: any) {
    if (!dataSearch) dataSearch = this.dataSearch
    const where: any = {}
    if (dataSearch.name && dataSearch.name !== '') where.name = dataSearch.name
    if (dataSearch.type && dataSearch.type !== '') where.type = dataSearch.type
    if (dataSearch.finished && dataSearch.finished !== '') where.finished = dataSearch.finished
    if (dataSearch.sortBy && dataSearch.sortBy !== '') where.sortBy = dataSearch.sortBy
    if (dataSearch.orderBy && dataSearch.orderBy !== '') where.orderBy = dataSearch.orderBy
    if (dataSearch.lstCateId && dataSearch.lstCateId.length > 0) where.lstCateId = dataSearch.lstCateId
    if (dataSearch.isDeleted === false || dataSearch.isDeleted === true) where.isDeleted = dataSearch.isDeleted
    return where
  }

  clickAdd() {
    this.dialog
      .open(AddOrEditStoryComponent, { disableClose: false })
      .afterClosed()
      .subscribe((res: any) => {
        if (res) {
          this.searchData()
        }
      })
  }

  clickEdit(object: any) {
    this.dialog
      .open(AddOrEditStoryComponent, { disableClose: false, data: object })
      .afterClosed()
      .subscribe((res: any) => {
        if (res) this.searchData()
      })
  }

  clickDetail(data: any) {
    this.dialog
      .open(StoryDetailComponent, {
        disableClose: false,
        data,
      })
      .afterClosed()
      .subscribe()
  }

  clickPrint(data: any) {
    this.dialog
      .open(StoryPrintComponent, {
        disableClose: false,
        data,
      })
      .afterClosed()
      .subscribe()
  }

  onActive(data: any) {
    if (!data.isDeleted) {
      this.currentStoryId = data.id
      this.isVisible = true
      return
    }
    this.notifyService.showloading()
    this.apiService.post(this.apiService.STORY.DELETE, { id: data.id }).then((res: any) => {
      this.notifyService.hideloading()
      if (res) {
        this.notifyService.showSuccess('Cập nhật trạng thái thành công!')
        this.searchData()
      }
    })
  }

  showModal(): void {
    this.isVisible = true
  }

  handleOk(): void {
    this.notifyService.showloading()
    this.apiService.post(this.apiService.STORY.DELETE, { id: this.currentStoryId }).then((res: any) => {
      this.notifyService.hideloading()
      this.isVisible = false
      if (res) {
        this.notifyService.showSuccess('Cập nhật trạng thái thành công!')
        this.searchData()
      }
    })
  }

  handleCancel(): void {
    this.isVisible = false
  }
}

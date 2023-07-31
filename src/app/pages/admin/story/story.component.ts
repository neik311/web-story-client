import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { enumData } from '../../../core/enumData'
import { ApiService, CoreService, NotifyService } from '../../../services'
import { AddOrEditStoryComponent } from './add-or-edit-story/add-or-edit-story.component'

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
  dataSearch: any = {}
  listOfData: any[] = []
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
    this.dataSearch.isDeleted = enumData.StatusFilter.Active.value
    this.searchData(true)
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

  clickDetail(data: any) {}

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

  onActive(data: any) {
    this.notifyService.showloading()
    this.apiService.post(this.apiService.STORY.DELETE, { id: data.id }).then((res: any) => {
      this.notifyService.hideloading()
      if (res) {
        this.notifyService.showSuccess('Cập nhật trạng thái thành công!')
        this.searchData()
      }
    })
  }
}

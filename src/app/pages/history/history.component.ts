import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService, CoreService, NotifyService } from '../../services'
import { enumData } from '../../core/enumData'

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  pageIndex = enumData.Page.pageIndex
  pageSize = enumData.Page.pageSize
  lstPageSize = enumData.Page.lstPageSize
  total = enumData.Page.total
  pageSizeMax = enumData.Page.pageSizeMax
  dataSearch: any = {}
  listOfData: any[] = []
  constructor(private notifyService: NotifyService, private apiService: ApiService, private coreService: CoreService, private router: Router) {}

  async ngOnInit() {
    this.searchData(true)
  }

  async searchData(reset = false) {
    if (reset) this.pageIndex = 1
    const where = await this.filterDataSearch()
    this.notifyService.showloading()
    const dataSearch = {
      where: where,
      skip: (this.pageIndex - 1) * this.pageSize,
      take: this.pageSize,
    }

    this.apiService.post(this.apiService.HISTORY.GET_BY_USER, dataSearch).then((res: any) => {
      if (res) {
        this.notifyService.hideloading()
        this.total = res[1]
        this.listOfData = res[0]
      }
    })
  }

  async filterDataSearch(dataSearch?: any) {
    if (!dataSearch) dataSearch = this.dataSearch
    const where: any = { isDeleted: false }
    if (dataSearch.name && dataSearch.name !== '') where.name = dataSearch.name
    return where
  }

  navigateToStory(storyId: string) {
    this.router.navigate([`story/${storyId}`])
  }

  navigateToChapter(storyId: string, chapterId: string) {
    this.router.navigate([`read/${storyId}/${chapterId}`])
  }

  deleteHistory(id: string) {
    this.notifyService.showloading()
    this.apiService.post(this.apiService.HISTORY.DELETE, { id }).then((res: any) => {
      if (res) {
        this.notifyService.showSuccess('Xóa lịch sử thành công')
        this.searchData()
      }
    })
  }
}

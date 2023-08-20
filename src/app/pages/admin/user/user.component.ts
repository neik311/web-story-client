import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { enumData } from '../../../core/enumData'
import { ApiService, CoreService, NotifyService } from '../../../services'

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
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
  lstVerified: any[] = [
    { value: false, name: 'Chưa xác minh' },
    { value: true, name: 'Đã xác minh' },
  ]
  constructor(private notifyService: NotifyService, private apiService: ApiService, private coreService: CoreService, private dialog: MatDialog) {}

  async ngOnInit() {
    this.dataFilterStatus = this.coreService.convertObjToArray(enumData.StatusFilter)
    this.dataSearch.isDeleted = enumData.StatusFilter.Active.value
    this.dataSearch.verified = true
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

    this.apiService.post(this.apiService.AUTH.PAGINATION, dataSearch).then((res: any) => {
      if (res) {
        this.loading = false
        this.total = res[1]
        this.listOfData = res[0]
      }
    })
  }

  async filterDataSearch(dataSearch?: any) {
    if (!dataSearch) dataSearch = this.dataSearch
    const where: any = {}
    if (dataSearch.name && dataSearch.name !== '') where.name = dataSearch.name
    if (dataSearch.email && dataSearch.email !== '') where.email = dataSearch.email
    if (dataSearch.isDeleted === false || dataSearch.isDeleted === true) where.isDeleted = dataSearch.isDeleted
    if (dataSearch.verified === false || dataSearch.verified === true) where.verified = dataSearch.verified
    return where
  }

  onActive(data: any) {
    this.notifyService.showloading()
    this.apiService.post(this.apiService.AUTH.DELETE, { id: data.id }).then((res: any) => {
      this.notifyService.hideloading()
      if (res) {
        this.notifyService.showSuccess('Cập nhật trạng thái thành công!')
        this.searchData()
      }
    })
  }
}

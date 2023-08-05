import { Component, OnInit } from '@angular/core'
import { ApiService, CoreService, NotifyService } from '../../services'
import { MatDialog } from '@angular/material/dialog'
import { enumData } from '../../core/enumData'
import { Router } from '@angular/router'

@Component({
  selector: 'app-searchStory',
  templateUrl: './searchStory.component.html',
  styleUrls: ['./searchStory.component.scss'],
})
export class SearchStoryComponent implements OnInit {
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

  responsiveOptions: any[] = []
  constructor(
    private notifyService: NotifyService,
    private apiService: ApiService,
    private coreService: CoreService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {
    this.notifyService.showloading()
    this.lstStoryType = this.coreService.convertObjToArray(enumData.StoryType)
    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ]
    this.loadDataCategory()
    this.searchData()
  }

  loadDataCategory() {
    this.apiService.post(this.apiService.CATEGORY.PAGINATION, { where: { isDeleted: false }, skip: 0, take: this.pageSizeMax }).then((res: any) => {
      this.lstCate = res[0]
      this.notifyService.hideloading()
    })
  }

  navigateToStory(storyId: string) {
    this.router.navigate([`story/${storyId}`])
  }

  async searchData(reset = false) {
    this.notifyService.showloading()
    if (reset) this.pageIndex = 1
    const where = await this.filterDataSearch()
    this.loading = true
    const dataSearch = {
      where: where,
      skip: (this.pageIndex - 1) * this.pageSize,
      take: this.pageSize,
    }
    this.apiService.post(this.apiService.STORY.PAGINATION, dataSearch).then((res: any) => {
      this.listOfData = res[0]
      this.total = res[1]
      this.notifyService.hideloading()
    })
  }

  async filterDataSearch(dataSearch?: any) {
    if (!dataSearch) dataSearch = this.dataSearch
    const where: any = {}
    if (dataSearch.name && dataSearch.name !== '') where.name = dataSearch.name
    if (dataSearch.type && dataSearch.type !== '') where.type = dataSearch.type
    if (dataSearch.finished && dataSearch.finished !== '') where.finished = dataSearch.finished
    if (dataSearch.sortBy && dataSearch.sortBy !== '') where.sortBy = dataSearch.sortBy
    if (dataSearch.orderBy && dataSearch.orderBy !== '') where.orderBy = dataSearch.orderBy
    if (dataSearch.lstCateId && dataSearch.lstCateId.length > 0) where.lstCateId = dataSearch.lstCateId
    return where
  }

  getSeverity(status: string) {
    switch (status) {
      case 'INSTOCK':
        return 'success'
      case 'LOWSTOCK':
        return 'warning'
      case 'OUTOFSTOCK':
        return 'danger'
      default:
        return ''
    }
  }
}

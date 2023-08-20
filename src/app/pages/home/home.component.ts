import { Component, OnInit } from '@angular/core'
import { ApiService, CoreService, NotifyService } from '../../services'
import { MatDialog } from '@angular/material/dialog'
import { enumData } from '../../core/enumData'
import { Router } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  pageIndex = enumData.Page.pageIndex
  pageSize = 20
  lstPageSize = enumData.Page.lstPageSize
  total = enumData.Page.total
  pageSizeMax = enumData.Page.pageSizeMax
  loading = true
  dataSearch: any = {}
  listOfData: any[] = []
  lstTopProduct: any[] = []

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
    this.loadSlideProduct()
    this.searchData()
  }

  loadSlideProduct() {
    this.apiService
      .post(this.apiService.STORY.PAGINATION, { where: { sortBy: 'totalView', orderBy: 'DESC', isDeleted: false }, skip: 0, take: 8 })
      .then((res: any) => {
        this.lstTopProduct = res[0]
        this.notifyService.hideloading()
      })
  }

  navigateToStory(storyId: string) {
    this.router.navigate([`story/${storyId}`])
  }

  async searchData(reset = false) {
    this.notifyService.showloading()
    if (reset) this.pageIndex = 1
    this.loading = true
    const dataSearch = {
      where: { isDeleted: false },
      skip: (this.pageIndex - 1) * this.pageSize,
      take: this.pageSize,
    }
    this.apiService.post(this.apiService.STORY.PAGINATION, dataSearch).then((res: any) => {
      this.listOfData = res[0]
      this.total = res[1]
      this.notifyService.hideloading()
    })
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

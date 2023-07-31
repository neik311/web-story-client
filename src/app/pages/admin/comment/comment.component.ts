import { NzAvatarModule } from 'ng-zorro-antd/avatar'
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { enumData } from '../../../core/enumData'
import { ApiService, CoreService, NotifyService } from '../../../services'
import { AnyPtrRecord } from 'dns'

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  pageIndex = enumData.Page.pageIndex
  pageSize = enumData.Page.pageSize
  lstPageSize = enumData.Page.lstPageSize
  total = enumData.Page.total
  pageSizeMax = enumData.Page.pageSizeMax
  dataSearch: any = {}
  loading = true
  storyId: string = ''
  story: any = {}
  lstComment: any[] = []
  dataFilterStatus: any[] = []
  isVisible = false
  currentCmtId: string = ''
  feedbackComment: string = ''

  expandSet = new Set<number>()
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id)
    } else {
      this.expandSet.delete(id)
    }
  }
  listOfData = [
    {
      id: 1,
      name: 'John Brown',
      age: 32,
      expand: false,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
    },
    {
      id: 2,
      name: 'Jim Green',
      age: 42,
      expand: false,
      address: 'London No. 1 Lake Park',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
    },
    {
      id: 3,
      name: 'Joe Black',
      age: 32,
      expand: false,
      address: 'Sidney No. 1 Lake Park',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.',
    },
  ]

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
    console.log(this.lstComment)
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
      this.apiService.post(this.apiService.COMMENT.PAGINATION, dataSearch),
    ])
    this.story = story
    this.lstComment = lstChapter[0]
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

  onActive(data: any) {
    this.notifyService.showloading()
    this.apiService.post(this.apiService.COMMENT.DELETE, { id: data.id }).then((res: any) => {
      this.notifyService.hideloading()
      if (res) {
        this.notifyService.showSuccess('Cập nhật trạng thái thành công!')
        this.loadData()
      }
    })
  }

  showFeedback(commentId: string) {
    this.isVisible = true
    this.currentCmtId = commentId
    this.feedbackComment = ''
  }

  feedback() {
    this.apiService
      .post(this.apiService.COMMENT.CREATE, { storyId: this.storyId, content: this.feedbackComment, parentId: this.currentCmtId })
      .then((res: any) => {
        this.isVisible = false
        this.currentCmtId = ''
        this.loadData()
      })
  }

  handleCancel(): void {
    this.isVisible = false
    this.currentCmtId = ''
  }
}

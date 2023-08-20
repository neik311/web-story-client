import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { formatDistance } from 'date-fns'
import { ActivatedRoute } from '@angular/router'
import { ApiService, AuthenticationService, CoreService, NotifyService } from '../../services'
import { enumData } from '../../core/enumData'

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.scss'],
})
export class StoryComponent implements OnInit {
  storyId: string = ''
  story: any = {}
  lstChapter: any[] = []
  lstComment: any[] = []
  pagComment: any = {
    pageIndex: enumData.Page.pageIndex,
    pageSize: enumData.Page.pageSize,
    lstPageSize: enumData.Page.lstPageSize,
    total: enumData.Page.total,
    pageSizeMax: enumData.Page.pageSizeMax,
  }
  currentComment: string = ''
  currentFeedback: string = ''
  parentId: string = ''
  isFavorite: boolean = false

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthenticationService, private apiService: ApiService) {}

  ngOnInit() {
    this.storyId = this.route.snapshot.paramMap.get('id') || ''
    this.loadDataStory()
    this.loadChapter()
    this.loadComment()
  }

  loadDataStory() {
    this.apiService.post(this.apiService.STORY.GET_STORY, { id: this.storyId }).then((res: any) => {
      this.story = res
      this.isFavorite = this.story.lstUserIdFavorite.includes(this.authService.currentUserValue.id)
      // console.log(res)
      // this.notifyService.hideloading()
    })
  }

  loadChapter() {
    this.apiService.post(this.apiService.CHAPTER.GET_CHAPTER_BY_STORY, { id: this.storyId }).then((res: any) => {
      this.lstChapter = res
    })
  }

  loadComment(reset = false) {
    if (reset) this.pagComment.pageIndex = 1
    const dataSearch = {
      where: { isDeleted: false, storyId: this.storyId },
      skip: (this.pagComment.pageIndex - 1) * this.pagComment.pageSize,
      take: this.pagComment.pageSize,
    }
    this.apiService.post(this.apiService.COMMENT.PAGINATION, dataSearch).then((res: any) => {
      this.lstComment = res[0]
      this.pagComment = { ...this.pagComment, total: res[1] }
    })
  }

  navigateToChapter(chapterId: string) {
    this.router.navigate([`read/${this.storyId}/${chapterId}`])
  }

  favoriteStory() {
    this.apiService.post(this.apiService.FAVORITE.CREATE, { storyId: this.story.id }).then((res: any) => {
      this.isFavorite = true
    })
  }

  deleteFavoriteStory() {
    this.apiService.post(this.apiService.FAVORITE.DELETE, { storyId: this.story.id }).then((res: any) => {
      this.isFavorite = false
    })
  }

  sendComment() {
    this.apiService.post(this.apiService.COMMENT.CREATE, { storyId: this.storyId, content: this.currentComment }).then((res: any) => {
      this.currentComment = ''
      this.loadComment()
    })
  }

  formatDate(date: any) {
    return formatDistance(new Date(date), new Date())
  }

  feedbackComment(commentId: string) {
    this.parentId = commentId
  }

  cancelFeedbackComment() {
    this.parentId = ''
  }

  sendFeedbackComment() {
    this.apiService
      .post(this.apiService.COMMENT.CREATE, { storyId: this.storyId, content: this.currentFeedback, parentId: this.parentId })
      .then((res: any) => {
        this.parentId = ''
        this.currentFeedback = ''
        this.loadComment()
      })
  }
}

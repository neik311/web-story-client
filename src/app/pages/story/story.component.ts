import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { formatDistance } from 'date-fns'
import { ActivatedRoute } from '@angular/router'
import { User } from '../../models/user.model'
import { ApiService, AuthenticationService, CoreService, NotifyService } from '../../services'
import { enumData } from '../../core/enumData'
import { timeStamp } from 'console'
import { ACTION_BUY_CHAPTER_SUCCESS } from '../../core/constants'

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
  setOfCheckedId = new Set<any>()
  setChapterBuyer = new Set<any>()
  currentUser: User | undefined
  isLogin: boolean = false
  isVisible = false;
  totalPrice: number = 0

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthenticationService, private apiService: ApiService,private notifyService: NotifyService) {}

  ngOnInit() {
    this.storyId = this.route.snapshot.paramMap.get('id') || ''
    this.currentUser = this.authService.currentUserValue
    if (this.currentUser) {
      this.isLogin = true
      this.setChapterBuyer = new Set(this.currentUser.lstChapter)
    }
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

  onItemChecked(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id)
    } else {
      this.setOfCheckedId.delete(id)
    }
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

  showModal(): void {
    this.isVisible = true;
    for(let chapter of this.lstChapter){
      if(this.setOfCheckedId.has(chapter.id)){
        this.totalPrice += +chapter.price
      }
    }
    this.totalPrice = +this.totalPrice.toFixed(4)
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  confirmBuyChapter(){  
    this.notifyService.showloading()
    let lstChapterId = Array.from(this.setOfCheckedId)
    const lstChapter = lstChapterId.map((chapterId)=> ({chapterId: chapterId}))
    this.apiService.post(this.apiService.WALLET.BUY_CHAPTER, lstChapter).then((res: any)=>{
     if(this.currentUser) {
      this.currentUser.amount = +this.currentUser.amount - +res.totalPrice
      this.currentUser.lstChapter = [...this.currentUser.lstChapter,...lstChapterId]
      this.setChapterBuyer = new Set(this.currentUser.lstChapter)
      this.notifyService.hideloading()
      this.isVisible = false;
      this.notifyService.showSuccess(ACTION_BUY_CHAPTER_SUCCESS)
      this.setOfCheckedId.clear()
      this.authService.login(this.currentUser)
     }
    })
  }

}

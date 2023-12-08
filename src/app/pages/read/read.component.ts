import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import { ApiService, AuthenticationService, CoreService, NotifyService } from '../../services'
import { enumData } from '../../core/enumData'
import { User } from '../../models/user.model'
import { ACTION_BUY_CHAPTER_SUCCESS } from '../../core/constants'

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss'],
})
export class ReadComponent implements OnInit {
  currentUser: User | undefined
  chapterId: string = ''
  storyId: string = ''
  selectedChapter: string = ''
  lstChapter: any[] = []
  lstImage: any[] = []
  chapter: any = {}
  isBuyer: boolean = false
  isFree: boolean = false
  isLogin: boolean = false
  fontSize: string = '16px'
  lstFontSize: any[] = [
    { value: '13px', name: '13' },
    { value: '14px', name: '14' },
    { value: '15px', name: '15' },
    { value: '16px', name: '16' },
    { value: '17px', name: '17' },
    { value: '18px', name: '18' },
    { value: '19px', name: '19' },
    { value: '20px', name: '20' },
    { value: '21px', name: '21' },
    { value: '22px', name: '22' },
    { value: '23px', name: '23' },
  ]

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthenticationService, private apiService: ApiService, private notifyService: NotifyService) {}

  ngOnInit() {
    this.loadData()
  }

  loadData(chapterId?: string, storyId?: string) {
    this.isBuyer = false
    this.isFree = false
    this.isLogin = false
    this.currentUser = this.authService.currentUserValue
    if(this.currentUser) this.isLogin = true
    this.chapterId = chapterId || this.route.snapshot.paramMap.get('chapterId') || ''
    this.storyId = storyId || this.route.snapshot.paramMap.get('storyId') || ''
    this.selectedChapter = this.chapterId
    if(this.currentUser?.lstChapter.find((chapterId: string) => chapterId === this.chapterId)){
      this.isBuyer = true
    }
    this.addToHistory()
    this.plusView()
    this.loadDataChapter()
  }

  loadDataChapter() {
    this.apiService.post(this.apiService.CHAPTER.GET_CHAPTER_BY_Id, { id: this.chapterId }).then((res: any) => {
      this.chapter = res
      if(+this.chapter.price === 0) this.isFree = true
      this.lstChapter = res.lstChapter
      if (this.chapter.storyType === enumData.StoryType.comic.code) this.lstImage = this.chapter.content.split(', ')
      this.router.navigate([`read/${this.storyId}/${this.chapterId}`])
    })
  }

  getLabelChapter(chapter: any) {
    return 'Chương ' + chapter.chapterNumber + (chapter.name ? '. ' + chapter.name : '')
  }

  navigateToChapter(chapterId: string) {
    this.loadData(chapterId)
  }

  onChangeChapter(chapterId: string) {
    this.loadData(chapterId)
  }

  navigateToStory() {
    this.router.navigate([`story/${this.storyId}`])
  }

  navigateToLogIn() {
    this.router.navigate(['login'])
  }

  confirmBuyChapter(){
    this.apiService.post(this.apiService.WALLET.BUY_CHAPTER, [{ chapterId: this.chapterId }]).then((res: any)=>{
     if(this.currentUser) {
      this.currentUser.amount = +this.currentUser.amount - +res.totalPrice
      this.currentUser.lstChapter.push(this.chapterId)
      this.notifyService.showSuccess(ACTION_BUY_CHAPTER_SUCCESS)
      this.authService.login(this.currentUser)
     }
     this.isBuyer = true
    })
  }

  addToHistory() {
    if (!this.authService.currentUserValue?.id) return
    this.apiService.post(this.apiService.HISTORY.CREATE, { chapterId: this.chapterId })
  }

  plusView() {
    this.apiService.post(this.apiService.CHAPTER.PLUS_VIEW, { id: this.chapterId })
  }
}

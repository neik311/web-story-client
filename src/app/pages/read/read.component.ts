import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import { ApiService, AuthenticationService, CoreService, NotifyService } from '../../services'
@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss'],
})
export class ReadComponent implements OnInit {
  chapterId: string = ''
  storyId: string = ''
  selectedChapter: string = ''
  lstChapter: any[] = []
  chapter: any = {}

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthenticationService, private apiService: ApiService) {}

  ngOnInit() {
    this.loadData()
  }

  loadData(chapterId?: string, storyId?: string) {
    this.chapterId = chapterId || this.route.snapshot.paramMap.get('chapterId') || ''
    this.storyId = storyId || this.route.snapshot.paramMap.get('storyId') || ''
    this.selectedChapter = this.chapterId
    this.addToHistory()
    this.plusView()
    this.loadDataChapter()
  }

  loadDataChapter() {
    this.apiService.post(this.apiService.CHAPTER.GET_CHAPTER_BY_Id, { id: this.chapterId }).then((res: any) => {
      this.chapter = res
      this.lstChapter = res.lstChapter
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

  addToHistory() {
    if (!this.authService.currentUserValue?.id) return
    this.apiService.post(this.apiService.HISTORY.CREATE, { chapterId: this.chapterId })
  }

  plusView() {
    this.apiService.post(this.apiService.CHAPTER.PLUS_VIEW, { id: this.chapterId })
  }
}

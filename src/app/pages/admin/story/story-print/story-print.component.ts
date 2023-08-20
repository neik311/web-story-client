import { Component, Inject, Input, OnInit, Optional } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ApiService, NotifyService } from '../../../../services'

@Component({
  selector: 'app-story-print',
  templateUrl: './story-print.component.html',
})
export class StoryPrintComponent implements OnInit {
  dataObject: any = {}
  modalTitle = 'in truyện'
  lstChapter: any[] = []
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

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<StoryPrintComponent>,
    private apiService: ApiService,
  ) {}

  ngOnInit() {
    this.dataObject = { ...this.data }
    console.log(this.dataObject)
    this.loadDatChapter()
  }

  loadDatChapter() {
    this.apiService.post(this.apiService.CHAPTER.GET_CHAPTER_PRINT, { id: this.dataObject.id }).then((res: any) => {
      this.lstChapter = res
    })
  }

  closeDialog(flag: any) {
    this.dialogRef.close(flag)
  }

  getUrlBackground(url: string) {
    return `url(${url})`
  }
}

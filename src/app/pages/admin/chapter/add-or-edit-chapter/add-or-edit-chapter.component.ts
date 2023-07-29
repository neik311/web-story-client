import { AfterViewInit, Component, Inject, OnInit, Optional, ViewChild } from '@angular/core'
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { RichTextEditorComponent } from '@syncfusion/ej2-angular-richtexteditor'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ApiService, NotifyService } from '../../../../services'
import { enumData } from '../../../../core/enumData'

@Component({
  selector: 'app-add-or-edit-chapter',
  templateUrl: './add-or-edit-chapter.component.html',
})
export class AddOrEditChapterComponent implements OnInit, AfterViewInit {
  dataObject: any = {
    chapterNumber: null,
    name: null,
    content: '<p></p>',
    storyId: null,
  }
  public customToolbar: Object = {
    items: [
      'Undo',
      'Redo',
      '|',
      'Bold',
      'Italic',
      'Underline',
      'StrikeThrough',
      '|',
      'FontName',
      'FontSize',
      'FontColor',
      'BackgroundColor',
      '|',
      'SubScript',
      'SuperScript',
      '|',
      'LowerCase',
      'UpperCase',
      '|',
      'Formats',
      'Alignments',
      '|',
      'OrderedList',
      'UnorderedList',
      '|',
      'Indent',
      'Outdent',
      '|',
      'CreateLink',
      'Image',
      '|',
      'ClearFormat',
      'Print',
      'SourceCode',
      '|',
      'FullScreen',
    ],
  }
  public height: number = 800
  public iframe: object = { enable: true }
  public mode: string = 'Markdown'
  @ViewChild('exampleRTE')
  public componentObject!: RichTextEditorComponent

  isCreate = true
  modalTitle = 'Thêm mới chapter'

  constructor(
    private notifyService: NotifyService,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<AddOrEditChapterComponent>,
    private fireStorage: AngularFireStorage,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.dataObject.storyId = this.data.storyId
    if (this.data && this.data.id) {
      this.dataObject = { ...this.data }
      this.isCreate = false
      this.modalTitle = 'Chỉnh sửa chapter'
    }
  }

  ngAfterViewInit() {
    this.componentObject.value = this.dataObject.content
  }
  async onSave() {
    this.dataObject.content = this.componentObject.getHtml()
    // console.log(this.componentObject.getHtml())
    this.notifyService.showloading()
    if (this.isCreate === false) {
      this.updateData()
      return
    }
    this.addData()
  }

  addData() {
    this.apiService.post(this.apiService.CHAPTER.CREATE, this.dataObject).then((res: any) => {
      if (res) {
        this.notifyService.showSuccess(enumData.Constants.Message_Create_Success)
        this.closeDialog(1)
      }
    })
  }

  updateData() {
    this.apiService.post(this.apiService.CHAPTER.UPDATE, this.dataObject).then((res: any) => {
      if (res) {
        this.notifyService.showSuccess(enumData.Constants.Message_Update_Success)
        this.closeDialog(1)
      }
    })
  }

  closeDialog(flag: any) {
    this.dialogRef.close(flag)
  }
}

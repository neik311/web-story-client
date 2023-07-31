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
    content: '',
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

  lstImageFile: any[] = []
  lstImage: any[] = []
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
      if (this.dataObject.type === enumData.StoryType.comic.code) {
        this.lstImage = this.dataObject.content.split(', ')
      }
      this.isCreate = false
      this.modalTitle = 'Chỉnh sửa chapter'
    }
  }

  ngAfterViewInit() {
    if (this.data.type === enumData.StoryType.word.code) this.componentObject.value = this.dataObject.content
  }
  async onSave() {
    this.notifyService.showloading()
    const length = this.lstImageFile.length
    if (this.data.type === enumData.StoryType.word.code) this.dataObject.content = this.componentObject.getHtml()
    else if (length > 0) {
      const lstTask: any[] = []
      for (let i = 0; i < length; i++) {
        lstTask.push(this.uploadImageToFirebase(this.lstImageFile[i], i))
      }
      const res = await Promise.all(lstTask)
      this.dataObject.content = res.join(', ')
    }
    // console.log(this.componentObject.getHtml())
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

  onChangeFile(e: any) {
    console.log(e.target.files)
    const files = e.target.files
    this.lstImageFile = files
    if (files.length === 0) return

    const mimeType = files[0].type
    if (mimeType.match(/image\/*/) == null) {
      return
    }
    const lstImage: any[] = []
    for (let imageFle of files) {
      const reader = new FileReader()
      reader.readAsDataURL(imageFle)
      reader.onload = (_event) => {
        lstImage.push(reader.result)
      }
    }
    this.lstImage = lstImage
  }

  async uploadImageToFirebase(file: any, fileName: number) {
    if (!file) return null
    const path = `data/${this.data.storyName}/${this.dataObject.chapterNumber}/${fileName.toString()}`
    const uploadTask = await this.fireStorage.upload(path, file)
    const url = await uploadTask.ref.getDownloadURL()
    return url
  }
}

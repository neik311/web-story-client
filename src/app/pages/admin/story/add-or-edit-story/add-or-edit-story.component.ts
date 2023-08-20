import { Component, Inject, OnInit, Optional } from '@angular/core'
import { AngularFireStorage } from '@angular/fire/compat/storage'
import { ApiService, CoreService, NotifyService } from '../../../../services'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { enumData } from '../../../../core/enumData'

@Component({
  templateUrl: './add-or-edit-story.component.html',
})
export class AddOrEditStoryComponent implements OnInit {
  dataObject: any = {
    avatar: null,
    name: null,
    otherName: null,
    author: null,
    finished: false,
    content: null,
    lstCategoryId: [],
  }
  avatarImage: any = ''
  isCreate = true
  lstCategory: any[] = []
  lstStoryType: any[] = []
  modalTitle = 'Thêm mới truyện'

  constructor(
    private notifyService: NotifyService,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<AddOrEditStoryComponent>,
    private fireStorage: AngularFireStorage,
    private coreService: CoreService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    this.lstStoryType = this.coreService.convertObjToArray(enumData.StoryType)
    this.loadDataSelectBox()
    if (this.data && this.data.id) {
      this.dataObject = { ...this.data }
      this.isCreate = false
      this.modalTitle = 'Chỉnh sửa truyện'
    }
  }

  async onSave() {
    this.notifyService.showloading()
    if (this.avatarImage) this.dataObject.avatar = await this.uploadImageToFirebase()
    if (!this.dataObject.avatar) {
      this.notifyService.showError('Hãy chọn ảnh đại diện')
      return
    }
    if (!this.dataObject.lstCategoryId || this.dataObject.lstCategoryId.length === 0) {
      this.notifyService.showError('Hãy chọn một danh mục')
      return
    }
    // console.log(this.dataObject)
    if (this.isCreate === false) {
      this.updateData()
      return
    }
    this.addData()
  }

  addData() {
    this.apiService.post(this.apiService.STORY.CREATE, this.dataObject).then((res: any) => {
      if (res) {
        this.notifyService.showSuccess(enumData.Constants.Message_Create_Success)
        this.closeDialog(1)
      }
    })
  }

  updateData() {
    this.apiService.post(this.apiService.STORY.UPDATE, this.dataObject).then((res: any) => {
      if (res) {
        this.notifyService.showSuccess(enumData.Constants.Message_Update_Success)
        this.closeDialog(1)
      }
    })
  }

  loadDataSelectBox() {
    this.apiService.post(this.apiService.CATEGORY.PAGINATION, { where: {}, skip: 0, take: enumData.Page.pageSizeMax }).then((res: any) => {
      if (res) {
        this.lstCategory = res[0]
      }
    })
  }

  closeDialog(flag: any) {
    this.dialogRef.close(flag)
  }

  onChangeFile(e: any) {
    this.avatarImage = e.target.files[0]
    const files = e.target.files
    if (files.length === 0) return

    const mimeType = files[0].type
    if (mimeType.match(/image\/*/) == null) {
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(files[0])
    reader.onload = (_event) => {
      this.dataObject.avatar = reader.result
    }
  }

  async uploadImageToFirebase() {
    if (!this.avatarImage) return null
    const path = `avatar/${this.avatarImage.name}`
    const uploadTask = await this.fireStorage.upload(path, this.avatarImage)
    const url = await uploadTask.ref.getDownloadURL()
    return url
  }
}

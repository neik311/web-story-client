import { Component, Inject, OnInit, Optional } from '@angular/core'
import { ApiService, NotifyService } from '../../../../services'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { enumData } from '../../../../core/enumData'

@Component({
  templateUrl: './add-or-edit-category.component.html',
})
export class AddOrEditCategoryComponent implements OnInit {
  dataObject: any = {
    name: null,
    description: null,
  }
  isCreate = true
  modalTitle = 'Thêm mới danh mục'

  constructor(
    private notifyService: NotifyService,
    private apiService: ApiService,
    private dialogRef: MatDialogRef<AddOrEditCategoryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    if (this.data && this.data.id) {
      this.dataObject = { ...this.data }
      this.isCreate = false
      this.modalTitle = 'Chỉnh sửa danh mục'
    }
  }

  onSave() {
    this.notifyService.showloading()
    if (this.isCreate === false) {
      this.updateData()
      return
    }
    this.addData()
  }

  addData() {
    this.apiService.post(this.apiService.CATEGORY.CREATE, this.dataObject).then((res: any) => {
      if (res) {
        this.notifyService.showSuccess(enumData.Constants.Message_Create_Success)
        this.closeDialog(1)
      }
    })
  }

  updateData() {
    this.apiService.post(this.apiService.CATEGORY.UPDATE, this.dataObject).then((res: any) => {
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

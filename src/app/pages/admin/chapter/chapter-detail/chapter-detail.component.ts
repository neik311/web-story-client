import { Component, Inject, Input, OnInit, Optional } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-chapter-detail',
  templateUrl: './chapter-detail.component.html',
})
export class ChapterDetailComponent implements OnInit {
  dataObject: any = {}
  modalTitle = 'Chi tiết chương'

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ChapterDetailComponent>) {}

  ngOnInit() {
    this.dataObject = { ...this.data }
  }

  closeDialog(flag: any) {
    this.dialogRef.close(flag)
  }
}

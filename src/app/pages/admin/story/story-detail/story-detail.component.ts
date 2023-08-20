import { Component, Inject, Input, OnInit, Optional } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'

@Component({
  selector: 'app-story-detail',
  templateUrl: './story-detail.component.html',
})
export class StoryDetailComponent implements OnInit {
  dataObject: any = {}
  modalTitle = 'Chi tiết truyện'

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<StoryDetailComponent>) {}

  ngOnInit() {
    this.dataObject = { ...this.data }
  }

  closeDialog(flag: any) {
    this.dialogRef.close(flag)
  }
}

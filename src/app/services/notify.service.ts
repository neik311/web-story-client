import { Component, Inject, Injectable } from '@angular/core'
import { MatSnackBar, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import * as $ from 'jquery'

@Injectable()
export class NotifyService {
  constructor(private readonly snackBar: MatSnackBar) {}

  showError(error: any) {
    let message = 'Đã có lỗi xãy ra'
    if (error.message) {
      message = error.message
    } else if (typeof error === 'string') {
      message = error
    }
    $('#mainLoading').removeClass('loading-service')
    this.openSnackBar(message, '', 'error-snackbar')
  }

  showInfo(message: string) {
    $('#mainLoading').removeClass('loading-service')
    this.openSnackBar(message, '', 'info-snackbar')
  }

  showSuccess(message: string) {
    $('#mainLoading').removeClass('loading-service')
    this.openSnackBar(message, '', 'success-snackbar')
  }

  showWarning(message: string) {
    $('#mainLoading').removeClass('loading-service')
    this.openSnackBar(message, '', 'warning-snackbar')
  }

  openSnackBar(message: string, action: string, className = '') {
    this.snackBar.openFromComponent(BasicSnackbarComponent, {
      data: message,
      duration: 4000,
      panelClass: [className],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    })
  }

  showloading(tag = '#mainLoading') {
    $(tag).addClass('loading-service')
  }

  hideloading(tag = '#mainLoading') {
    $(tag).removeClass('loading-service')
  }
}

// @Component({ template: `Thông báo!<br />{{ data }}` })
// export class BasicSnackbarComponent {
//   constructor(public sbRef: MatSnackBarRef<BasicSnackbarComponent>, @Inject(MAT_SNACK_BAR_DATA) public data: any) {}
// }

@Component({
  template: `Thông báo!<br />
    <span [innerHTML]="safeHtml"></span>`,
})
export class BasicSnackbarComponent {
  safeHtml: SafeHtml

  constructor(public sbRef: MatSnackBarRef<BasicSnackbarComponent>, @Inject(MAT_SNACK_BAR_DATA) public data: any, private sanitizer: DomSanitizer) {
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(data)
  }
}

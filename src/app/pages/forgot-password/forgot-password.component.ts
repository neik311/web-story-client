import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService, NotifyService } from '../../services'
import { FirebaseUpload } from '../../_helpers/firebaseUpload'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['../login/login.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
  userForgot = {
    email: '',
    password: '',
    cfPassword: '',
  }
  code: any = null
  isConfirm = false
  constructor(private notifyService: NotifyService, private apiService: ApiService, private firebaseUpload: FirebaseUpload, private router: Router) {}

  ngOnInit() {}

  async onSubmit() {
    if (this.userForgot.password !== this.userForgot.cfPassword) {
      this.notifyService.showWarning('Mật khẩu nhập lại không chính xác')
      return
    }
    this.notifyService.showloading()
    this.apiService.post(this.apiService.EMAIL.SEND_FORGOT_PW, { email: this.userForgot.email }).then((res: any) => {
      this.isConfirm = true
      this.notifyService.showSuccess('Nhập mã xác thực qua email để tiếp tục')
    })
  }

  async onConfirm() {
    this.notifyService.showloading()
    this.apiService.post(this.apiService.AUTH.FORGOT_PASSWORD, { ...this.userForgot, code: this.code }).then((res: any) => {
      this.notifyService.showSuccess('Thay đổi mật khẩu thành công')
      this.router.navigate(['login'])
    })
  }
}

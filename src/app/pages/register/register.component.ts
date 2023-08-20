import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ApiService, AuthenticationService, CoreService, NotifyService } from '../../services'
import { FirebaseUpload } from '../../_helpers/firebaseUpload'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css'],
})
export class RegisterComponent implements OnInit {
  userRegister = {
    username: '',
    email: '',
    avatar: null as any,
    password: '',
    cfPassword: '',
  }
  fileImage: any = null
  code: any = null
  isConfirm = false
  constructor(
    private notifyService: NotifyService,
    private apiService: ApiService,
    private authService: AuthenticationService,
    private firebaseUpload: FirebaseUpload,
    private router: Router,
  ) {}

  ngOnInit() {}

  async onSubmit() {
    if (this.userRegister.password !== this.userRegister.cfPassword) {
      this.notifyService.showWarning('Mật khẩu nhập lại không chính xác')
      return
    }
    this.notifyService.showloading()
    if (this.userRegister.avatar) this.userRegister.avatar = await this.firebaseUpload.uploadImageAvatar(this.fileImage, this.userRegister.username)
    console.log(this.userRegister)
    this.apiService.post(this.apiService.AUTH.REGISTER, this.userRegister).then((res: any) => {
      this.isConfirm = true
      this.notifyService.showSuccess('Nhập mã xác thực qua email để tiếp tục')
    })
  }

  async onConfirm() {
    this.notifyService.showloading()
    this.apiService.post(this.apiService.AUTH.VERIFY, { email: this.userRegister.email, code: this.code }).then((res: any) => {
      this.notifyService.showSuccess('Đăng ký thành công')
      this.router.navigate(['login'])
    })
  }

  onChangeFile(e: any) {
    this.fileImage = e.target.files[0]
    const files = e.target.files
    if (files.length === 0) return

    const mimeType = files[0].type
    if (mimeType.match(/image\/*/) == null) {
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(files[0])
    reader.onload = (_event) => {
      this.userRegister.avatar = reader.result
    }
  }
}

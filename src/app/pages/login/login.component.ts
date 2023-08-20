import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { Router } from '@angular/router'
import { ApiService, AuthenticationService, CoreService, NotifyService } from '../../services'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: string = ''
  password: string = ''
  constructor(
    private notifyService: NotifyService,
    private apiService: ApiService,
    private authService: AuthenticationService,
    private coreService: CoreService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.notifyService.showloading()
    this.apiService.post(this.apiService.AUTH.LOGIN, { username: this.username, email: this.username, password: this.password }).then((res: any) => {
      this.authService.login(res)
      this.notifyService.showSuccess('Đăng nhập thành công')
      this.router.navigate(['home'])
    })
  }

  navigate(link: any) {
    this.router.navigate([link])
  }
}

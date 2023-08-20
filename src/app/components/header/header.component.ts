import { Component, OnInit } from '@angular/core'
import { User } from '../../models/user.model'
import { ApiService, AuthenticationService, NotifyService } from '../../services'
import { Router } from '@angular/router'
import { enumData } from '../../core/enumData'
import { FirebaseUpload } from '../../_helpers/firebaseUpload'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentUser: User | undefined
  textSearch: string = ''
  isVisible = false
  avatarImage: any
  avatarUrl: any = ''
  constructor(
    private notifyService: NotifyService,
    private apiService: ApiService,
    private authService: AuthenticationService,
    private firebaseUpload: FirebaseUpload,
    private router: Router,
  ) {}

  ngOnInit() {
    // console.log(window.location.href.includes('admin'))
    this.currentUser = this.authService.currentUserValue
    console.log(this.currentUser)
  }

  showModal(): void {
    this.isVisible = true
    this.avatarUrl = this.authService.currentUserValue?.avatar
  }

  onSearch() {
    if (this.textSearch.trim() === '') return
    this.router.navigate(['search'], { queryParams: { name: this.textSearch } })
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
      this.avatarUrl = reader.result
    }
  }

  async handleOk() {
    this.notifyService.showloading()
    let avatar = this.avatarUrl
    if (this.avatarImage) avatar = (await this.firebaseUpload.uploadImageAvatar(this.avatarImage, this.getUsername())) || ''
    this.apiService.post(this.apiService.AUTH.UPDATE, { avatar }).then((res) => {
      const currentUser = this.authService.currentUserValue
      this.authService.login({ ...currentUser, avatar })
      this.notifyService.hideloading()
      this.isVisible = false
    })
  }

  handleCancel(): void {
    this.isVisible = false
  }

  navigate(link: any) {
    this.router.navigate([link])
  }

  handleLogout() {
    this.authService.logout()
  }

  isAdmin(): boolean {
    return this.authService.currentUserValue?.roleCode === enumData.Role.Admin.code
  }

  isUrlAdmin(): boolean {
    return window.location.href.includes('admin')
  }

  getUsername(): string {
    return this.authService.currentUserValue?.username
  }

  getEmail(): string {
    return this.authService.currentUserValue?.email
  }

  getAvatar(): string {
    return this.authService.currentUserValue?.avatar || 'https://i.pinimg.com/originals/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg'
  }
}

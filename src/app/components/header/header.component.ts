import { Component, OnInit } from '@angular/core'
import { User } from '../../models/user.model'
import { AuthenticationService } from '../../services'
import { Router } from '@angular/router'
import { enumData } from '../../core/enumData'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentUser: User | undefined
  textSearch: string = ''
  constructor(private authService: AuthenticationService, private router: Router) {}

  ngOnInit() {
    console.log(window.location.href.includes('admin'))
    this.currentUser = this.authService.currentUserValue
    console.log(this.currentUser)
  }

  navigate(link: any) {
    this.router.navigate([link])
  }

  isAdmin(): boolean {
    return this.currentUser?.roleCode === enumData.Role.Admin.code
  }

  isUrlAdmin(): boolean {
    return window.location.href.includes('admin')
  }
}

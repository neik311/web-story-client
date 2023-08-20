import { Component, OnInit } from '@angular/core'
import { ApiService, AuthenticationService } from './services'
import { Router } from '@angular/router'
import { User } from './models/user.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthenticationService, private apiService: ApiService) {}

  ngOnInit() {
    const currentUser = this.authService.currentUserValue
    console.log(currentUser)
    if (!currentUser || !currentUser?.accessToken) {
      this.authService.logout()
      return
    }
    this.apiService.post(this.apiService.AUTH.GET_INFO, {}).then((res: any) => {
      this.authService.login({ ...res, accessToken: currentUser?.accessToken })
    })
  }
}

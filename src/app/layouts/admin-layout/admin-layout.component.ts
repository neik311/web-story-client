import { Component, OnInit } from '@angular/core'
import { ApiService, AuthenticationService, CoreService } from '../../services'

@Component({
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  isCollapsed = false

  currentUser: any
  constructor(private apiService: ApiService, private authenticationService: AuthenticationService, public coreService: CoreService) {
    this.authenticationService.currentUser.subscribe((x) => (this.currentUser = x))
  }

  ngOnInit() {
    this.loadNotify()
  }

  logout() {
    this.authenticationService.logout()
    location.reload()
  }

  //#region Notify
  loadNotify() {
    // this.apiService.post(this.apiService.NOTIFY.LOAD, {}).then((res: any) => {})
  }
}

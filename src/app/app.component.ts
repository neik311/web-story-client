import { Component, OnInit } from '@angular/core'
import { AuthenticationService } from './services'
import { Router } from '@angular/router'
import { User } from './models/user.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  currentUser: User | undefined
  constructor(private authService: AuthenticationService, private router: Router) {}

  ngOnInit() {
    // this.currentUser = this.authService.currentUserValue
    // console.log(this.currentUser)
    // if (!this.authService.currentUserValue) {
    //   this.router.navigate(['login'])
    // }
  }
}

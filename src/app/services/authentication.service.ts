import { Injectable } from '@angular/core'
import { User } from '../models/user.model'
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject'
import { Observable } from 'rxjs/internal/Observable'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>
  public currentUser: Observable<User>
  constructor() {
    const temp: any = null
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser') || temp))
    this.currentUser = this.currentUserSubject.asObservable()
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value
  }

  login(user: User) {
    localStorage.setItem('currentUser', JSON.stringify(user))
    this.currentUserSubject.next(user)
  }

  logout() {
    localStorage.removeItem('currentUser')
    const temp: any = null
    this.currentUserSubject.next(temp)
  }
}

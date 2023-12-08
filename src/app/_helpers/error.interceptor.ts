import { Injectable } from '@angular/core'
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { AuthenticationService, NotifyService } from '../services'
import { environment } from '../../environments/environment'
import { INTERNAL_SERVER_ERROR,ERR_AUTH } from '../core/constants'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private notifyService: NotifyService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        this.notifyService.hideloading()
        if (err.error.path === '/auth/login') {
          this.notifyService.showWarning(err.error.message)
          return throwError(() => new Error(error))
        }
        if (err.status === 401) {
          if (err.error.message === 'Unauthorized' || err.statusText === 'Unauthorized') {
            this.authenticationService.logout()
            this.notifyService.showWarning(ERR_AUTH)
            return throwError(() => new Error(error))
          }
        }

        if (err.name == 'HttpErrorResponse' && err.statusText == 'Unknown Error') {
          err.statusText = INTERNAL_SERVER_ERROR
        }
        const error = err.error.message || err.statusText
        this.notifyService.showError(error)
        return throwError(() => new Error(error))
      }),
    )
  }
}

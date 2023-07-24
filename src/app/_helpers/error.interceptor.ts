import { Injectable } from '@angular/core'
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { AuthenticationService, NotifyService } from '../services'
import { environment } from '../../environments/environment'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService, private notifyService: NotifyService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        this.notifyService.hideloading()
        if (err.status === 401) {
          if (err.error.message === 'Unauthorized' || err.statusText === 'Unauthorized') {
            this.authenticationService.logout()
            if (err.url && err.url !== `${environment.apiUrl}/auth/login`) {
              location.reload()
            }
          }
        }

        if (err.name == 'HttpErrorResponse' && err.statusText == 'Unknown Error') {
          err.statusText = 'Server đang update hoặc mất kết nối, vui lòng thử lại sau.'
        }
        const error = err.error.message || err.statusText
        this.notifyService.showError(error)
        return throwError(() => new Error(error))
      }),
    )
  }
}

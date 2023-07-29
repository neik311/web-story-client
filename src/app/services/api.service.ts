import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { lastValueFrom } from 'rxjs'
import { environment } from '../../environments/environment'
@Injectable()
export class ApiService {
  constructor(private http: HttpClient) {}

  //#region API Construct
  AUTH = {
    LOGIN: `${environment.apiUrl}/auth/login`,
    REGISTER: `${environment.apiUrl}/auth/register`,
  }
  CATEGORY = {
    FIND: `${environment.apiUrl}/category/find`,
    CREATE: `${environment.apiUrl}/category/create_data`,
    DELETE: `${environment.apiUrl}/category/update_active`,
    UPDATE: `${environment.apiUrl}/category/update_data`,
    PAGINATION: `${environment.apiUrl}/category/pagination`,
  }

  STORY = {
    GET_STORY: `${environment.apiUrl}/story/get_story`,
    CREATE: `${environment.apiUrl}/story/create_data`,
    DELETE: `${environment.apiUrl}/story/update_active`,
    UPDATE: `${environment.apiUrl}/story/update_data`,
    PAGINATION: `${environment.apiUrl}/story/pagination`,
  }

  CHAPTER = {
    GET_CHAPTER_BY_STORY: `${environment.apiUrl}/chapter/get_chapter_by_story`,
    CREATE: `${environment.apiUrl}/chapter/create_data`,
    DELETE: `${environment.apiUrl}/chapter/update_active`,
    UPDATE: `${environment.apiUrl}/chapter/update_data`,
    PAGINATION: `${environment.apiUrl}/chapter/pagination`,
    PLUS_VIEW: `${environment.apiUrl}/chapter/plus_view_chapter`,
  }

  //#endregion

  //#region Handle

  objToQueryString = (obj: any) =>
    Object.keys(obj)
      .map((k) => {
        if (Array.isArray(obj[k])) {
          return `${k}=${JSON.stringify(obj[k])}`
        }
        return `${k}=${obj[k]}`
      })
      .join('&')

  post(url: string, data: any) {
    return new Promise((resolve, reject) => {
      const request = this.http.post(url, data)
      lastValueFrom(request)
        .then((res: any) => {
          resolve(res)
        })
        .catch((err: any) => {
          reject(err.response)
        })
    })
  }

  get(url: string, data: any) {
    const query = this.objToQueryString(data)
    const newUrl = `${url}?${query}`

    return new Promise((resolve, reject) => {
      const request = this.http.get(newUrl)
      lastValueFrom(request)
        .then((res: any) => {
          resolve(res)
        })
        .catch((err: any) => {
          reject(err.response)
        })
    })
  }
  //#endregion
}
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Column, Workbook } from 'exceljs'
import * as moment from 'moment'
import { ApiService } from '.'
import { enumData } from '../core/enumData'
import { User } from '../models/user.model'
import { NotifyService } from './notify.service'
const fs = require('file-saver')

@Injectable()
export class CoreService {
  enumData: any;
  currentUser: User | any;

  constructor(private http: HttpClient, private notifyService: NotifyService, private apiService: ApiService) {}

  public isEqual2Obj(objA: any, objB: any) {
    // Tạo các mảng chứa tên các property
    const aProps = Object.getOwnPropertyNames(objA)
    const bProps = Object.getOwnPropertyNames(objB)
    // Nếu độ dài của mảng không bằng nhau,
    // thì 2 objects đó không bằnh nhau.
    if (aProps.length !== bProps.length) {
      return false
    }

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i]
      // Nếu giá trị của cùng một property mà không bằng nhau,
      // thì 2 objects không bằng nhau.
      if (objA[propName] !== objB[propName]) {
        return false
      }
    }
    // Nếu code chạy đến đây,
    // tức là 2 objects được tính lằ bằng nhau.
    return true
  }

  public sumArray(arr: any, prop: any) {
    let total = 0
    for (let i = 0, len = arr.length; i < len; i++) {
      total += arr[i][prop]
    }
    return total
  }

  public groupByArray(data: any, key: any) {
    const groupedObj = data.reduce((prev: any, cur: any) => {
      if (!prev[cur[key]]) {
        prev[cur[key]] = [cur]
      } else {
        prev[cur[key]].push(cur)
      }
      return prev
    }, {})
    return Object.keys(groupedObj).map((Heading: any) => ({ heading: Heading, list: groupedObj[Heading] }))
  }

  /** Sort từ nhỏ tới lớn */
  public dynamicSort(data: any[], key: any) {
    return data.sort(this.sortArray(key))
  }

  public sortArray(key: any) {
    let sortOrder = 1
    if (key[0] === '-') {
      sortOrder = -1
      key = key.substr(1)
    }
    return (a: any, b: any) => {
      const result = a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0
      return result * sortOrder
    }
  }

  /** Sort từ lớn tới nhỏ */
  public sortBy(array: Array<any>, args: any) {
    if (array !== undefined) {
      array.sort((a: any, b: any) => {
        if (a[args] > b[args]) {
          return -1
        } else if (a[args] < b[args]) {
          return 1
        } else {
          return 0
        }
      })
    }
    return array
  }

  public convertObjToArray(obj: any) {
    const arr = []
    // tslint:disable-next-line:forin
    for (const key in obj) {
      const value = obj[key]
      arr.push(value)
    }
    return arr
  }

  public convertObjToParam(obj: any) {
    let str = ''
    // tslint:disable-next-line:forin
    for (const key in obj) {
      if (str !== '') {
        str += '&'
      }
      str += key + '=' + encodeURIComponent(obj[key])
    }
    return str
  }

  //#region get enum

  public getEnum(code: any, enumDataType: any) {
    const data = this.convertObjToArray(enumDataType)
    const item = data.find((p) => p.code === code)
    return item
  }

  public getEnumName(code: any, enumDataType: any) {
    const data = this.convertObjToArray(enumDataType)
    const item = data.find((p) => p.code === code)
    return item ? item.name : ''
  }

  //#endregion

  //#region get price month or year
  public getPrice(arr: any[], id: string, paymentPeriod: string) {
    const obj = arr.find((c: any) => c.id == id)
    if (obj) {
      if (paymentPeriod == 'MONTH') {
        return obj.priceMonth
      } else {
        return obj.priceYear
      }
    }
    return null
  }
  //#endregion

  /**
   * Lọc properties không có giá trị
   *
   * @author senhoang
   * @param {Object} where - Đối tượng cần lọc.
   * @returns {void} Hàm không trả về giá trị. Nó sửa đổi đối tượng được truyền làm tham số tại chỗ.
   */
  public filterDataSearch(where: any) {
    return Object.keys(where).forEach((k: any) => !(where[k] || where[k] === false || where[k] === 0) && delete where[k])
  }

  /**
   * @typedef {Object} configApi
   * @property {string} url - Đường dẫn API
   * @property {Object} where - Điều kiện
   * @property {string[]} lstField - Danh sách thứ tự các trường được trả về từ API
   */

  /**
   * DOWNLOAD FILE EXCEL.
   *
   * @param {number} fileName - Tên file
   * @param {string[]} templateHeader - Khai báo tên header
   * @param {string[]} columnFmt - Khai báo kiểu dữ liệu cho columns
   * @param {?configApi} configApi - Khai báo các thông tin lấy dữ liệu fill vào
   * @returns {underfined} Kết quả
   */
  async onDownload(fileName: string, templateHeader: string[], columnFmt: string[], configApi?: { url: string; where: any; lstField: string[] }) {
    this.notifyService.showloading()
    const date = new Date().toISOString()
    const workbook = new Workbook()
    const sheet1 = workbook.addWorksheet(fileName)
    // EXCEL-header--start

    // FORMAT FILE EXCEL--start
    const fmtTxt = '@'
    const fmtNum = '#,##0;[Red]-#,##0'

    const textFmt = 'text'
    const dateFmt = 'date'
    const dateTimeFmt = 'dateTime'
    const monthFmt = 'month'
    const numberFmt = 'number'

    // Khai báo các loại dữ liệu của cột số {thứ tụ cột:fmtTxt or fmtNum}
    // Khai báo các loại dữ liệu của cột {thứ tụ cột:fmtTxt or fmtNum}

    // CẤU HÌNH FMT
    // FMT ROW
    const fmtRow = (rowData: any, objStyle: any = {}) => {
      rowData.eachCell((cell: any, colNumber: any) => {
        cell.border = {
          top: { style: 'thin', color: { argb: '777777' } },
          left: { style: 'thin', color: { argb: '777777' } },
          bottom: { style: 'thin', color: { argb: '777777' } },
          right: { style: 'thin', color: { argb: '777777' } },
        }
        cell.font = { name: 'Calibri', family: 4, size: 11 }
        cell.alignment = { horizontal: 'left', vertical: 'middle' }
        for (const prop in objStyle) {
          cell[prop] = objStyle[prop]
        }
      })
    }

    // FORMAT FILE EXCEL--end

    let header: string[] = templateHeader
    const headerRow = sheet1.addRow(header)

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, colNumber) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '001E3E' },
      }
      cell.alignment = { horizontal: 'center', vertical: 'middle' }
      cell.font = { size: 11, bold: true, color: { argb: 'FFFFFF' } }
      cell.border = {
        top: { style: 'thin', color: { argb: '777777' } },
        left: { style: 'thin', color: { argb: '777777' } },
        bottom: { style: 'thin', color: { argb: '777777' } },
        right: { style: 'thin', color: { argb: '777777' } },
      }
    })
    headerRow.height = 24

    // EXCEL-header--end

    // EXCEL-data--start
    if (configApi?.url) {
      const where = {}
      Object.assign(where, configApi?.where)
      await this.filterDataSearch(where)

      const dataSearch = {
        where,
        skip: 0,
        order: { createdAt: 'DESC' },
        take: enumData.Page.pageSizeMax,
      }

      await this.apiService.post(configApi?.url, dataSearch).then((res: any) => {
        const lstData = res[0]

        // Add Data and Conditional Formatting
        for (const [index, data] of lstData.entries()) {
          const rowData: any[] = []
          for (const prop of configApi?.lstField) {
            let propData
            const path = prop.split('.')
            let current = JSON.parse(JSON.stringify(data))
            for (const key of path) {
              if (current) {
                current = current[key] || ''
              } else {
                propData = undefined
                break
              }
            }
            // debugger
            if (prop === 'isDeleted') {
              propData = current ? 'Ngưng hoạt động' : 'Đang hoạt động'
            } else {
              propData = current
            }
            rowData.push(propData)
          }

          const row = sheet1.addRow(rowData)
          fmtRow(row)
        }
      })
    }
    // EXCEL-data--end
    // EXCEL-format-last--start
    sheet1.columns.forEach((value: Partial<Column>, index: number, array: Partial<Column>[]) => {
      const indexColumn = +index + 1

      let column = value as Column
      let maxLength = 0

      // Format column .numFmt
      const fmtType = columnFmt[indexColumn]
      column.numFmt = fmtType === numberFmt ? fmtNum : fmtTxt

      column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        // Covert data to format data
        const value: any = cell.value

        // Covert data to format data
        if (rowNumber > 1) {
          if (fmtType === dateFmt) {
            const convertStringDate: string = moment(value).format('DD/MM/YYYY')
            cell.value = cell.value ? convertStringDate : ''
          } else if (fmtType === dateTimeFmt) {
            // dateTimeFmt
            const convertStringDate: string = moment(new Date(value)).format('DD/MM/YYYY HH:ss')
            cell.value = value ? convertStringDate : ''
          } else if (fmtType === monthFmt) {
            // monthFmt
            const convertStringDate: string = moment(new Date(value)).format('MM/YYYY')
            cell.value = value ? convertStringDate : ''
          } else if (fmtType === numberFmt) {
            // numberFmt
            cell.value = value ? +value : 0
          }
        }

        // assing max length
        maxLength = value?.toString().length > maxLength ? value?.toString().length : maxLength
      })

      column.width = maxLength + 5
    })
    // EXCEL-format-last--end

    // EXCEL-Compile--start
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      fs.saveAs(blob, `${fileName}-${date}.xlsx`)
      this.notifyService.hideloading()
    })
    // EXCEL-Compile--end
  }
}

import { Directive, ElementRef, HostListener } from '@angular/core'

@Directive({
  selector: 'input[numbersDecimal]',
})
export class NumberV2Directive {
  private oldValue: any = ''
  constructor(private _el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initialValue = this._el.nativeElement.value
    if (event.data === null) {
      this.oldValue = this._el.nativeElement.value
      return
    }
    if (isNaN(Number(event.data)) && event.data !== '.') {
      this._el.nativeElement.value = this.oldValue
      return
    }
    this._el.nativeElement.value = initialValue.replace(/[^0-9.]/g, '')
    this.oldValue = this._el.nativeElement.value
    if (initialValue !== this._el.nativeElement.value) {
      event.stopPropagation()
    }
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatSettingValue'
})
export class FormatSettingValuePipe implements PipeTransform {

  transform(value: number, args?: any): any {
    if(value > 0) {
      return '+' + value.toFixed(2)
    } else {
      return value
    }
  }

  isInt(n) {
    return n % 1 === 0;
  }

}

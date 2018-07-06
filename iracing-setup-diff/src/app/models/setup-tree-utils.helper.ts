import { Setup } from "./setup.model";
import { Section } from './section.model';
import { EventEmitter } from "@angular/core";
import { SettingValue } from "./settingValue.model";

export class SetupTreeUtils {

  isSection(input: string) {
    return input.startsWith('<H2><U>')
  }
  extractSectionName(value: string) {
    var myRegexp = /<H2><U>(.*):<\/U><\/H2>/g;
    return myRegexp.exec(value)[1];
  }

  isAdditionalValue(input: string) {
    return input.startsWith('<U>')
  }
  extractSettingName(value: string) {
    var myRegexp = /(.*)<U>/g;
    return myRegexp.exec(value)[1].replace(":", '').trim();
  }
  extractSettingValue(value: string) {
    var myRegexp = /<U>(.*)<\/U>/g;
    return myRegexp.exec(value)[1];
  }

  cleanRawContent(content) {
    content.pop()
    content.shift()
    content.shift()
    content.shift()
    content.shift()
    content.shift()
    return content
      .map(v => { return v.trim()})
      .filter(v => v !== '')
      .reduce((accumulator, currentValue) => {
        currentValue.split('\n').map(v => v.replace('\n', '')).forEach(element => {
          accumulator.push(element.trim())
        });
        return accumulator
      }, [])
  }

  diffSetup(setupFrom: Setup, currentSetup: Setup): Setup {

    for(var i=0; i<currentSetup.sections.length;i++) {
      for(var j=0; j<currentSetup.sections[i].settings.length;j++) {
        for(var k=0; k<currentSetup.sections[i].settings[j].values.length;k++) {
          
          const valTo = currentSetup.sections[i].settings[j].values[k]
          const valFrom = setupFrom.sections[i].settings[j].values[k]

          if(valTo.value !== valFrom.value) {
            currentSetup.sections[i].hasDiff = true
            currentSetup.sections[i].settings[j].hasDiff = true
            currentSetup.sections[i].settings[j].values[k].diff = this.getValueDiff(valTo, valFrom)
          }

        }
      }
    }

    return currentSetup
  }

  getValueDiff(valTo, valFrom) : number {
    return this.getNumericValue(valTo) - this.getNumericValue(valFrom)
  }
  getNumericValue(value: SettingValue) : number {
    return Number(value.value.replace(/[a-zA-Z\/]/g,'').trim())
  }

}
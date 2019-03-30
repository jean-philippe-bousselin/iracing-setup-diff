import { Setup } from "./setup.model";
import { Section } from './section.model';
import { EventEmitter } from "@angular/core";
import { SettingValue } from "./settingValue.model";
import { Setting } from "./setting.model";

export class SetupTreeUtils {

  isSection(input: string) {
    return input.startsWith('<H2><U>')
  }
  extractSectionName(value: string) {
    return /<H2><U>(.*)<\/U><\/H2>/g.exec(value)[1].replace(':', '');
  }

  isAdditionalValue(input: string) {
    return input.startsWith('<U>')
  }
  extractSettingName(value: string) {
    return /(.*)<U>/g.exec(value)[1].replace(":", '').trim();
  }
  extractSettingValue(value: string) {
    return /<U>(.*)<\/U>/g.exec(value)[1];
  }

  cleanRawContent(content) {
    
    // remove driver aids shit and unecessary data from the bottom of the file
    for(let i = content.indexOf('<H2><U>DRIVER AIDS:</U></H2>'); i < content.length; i++) {
      content.pop()
    }

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

        let currentSection = currentSetup.sections[i]
          let currentSetting = currentSetup.sections[i].settings[j]
          // find matching setting on setupFrom
          let sectionFrom = setupFrom.getSection(currentSection.name)
          if(sectionFrom) {
            let settingFrom = sectionFrom.getSetting(currentSetting.name)
            if(settingFrom) {
              // if matching setting exists, compare it
              for(var k=0; k<currentSetup.sections[i].settings[j].values.length;k++) {

                const valTo = currentSetup.sections[i].settings[j].values[k]
                const valFrom = settingFrom.values[k]
      
                if(valTo.value !== valFrom.value) {
                  currentSetup.sections[i].hasDiff = true
                  currentSetup.sections[i].settings[j].hasDiff = true
                  currentSetup.sections[i].settings[j].values[k].diff = this.getValueDiff(valTo, valFrom)
                }
              }
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
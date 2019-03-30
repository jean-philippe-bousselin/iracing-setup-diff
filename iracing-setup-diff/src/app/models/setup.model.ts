import { Setting } from './setting.model';
import { Section } from './section.model';
export class Setup {

  sections: Section[]

  constructor() {
    this.sections = []
  }

  isEmpty() {
    return this.sections.length === 0
  }

  addSection(section: Section) {
    if(!this.hasSection(section.name)) {
      this.sections.push(section)
    }
    return this
  }

  getSection(name: String) : Section|undefined {
    return this.sections.find(section => section.name == name)
  }

  hasSection(sectionName: string) {
    return this.sections.find(s => s.name === sectionName)
  }

  addSetting(setting: Setting, sectionName: string) {
    this.sections.map(s => {
      if(s.name === sectionName) {
        s.settings.push(setting)
      }
      return s
    })
    return this
  }

  addValue(value: string, settingName: string, sectionName: string) {
    this.sections.map(s => {
      if(s.name === sectionName) {
        s.settings.map(set => {
          if(set.name === settingName) {
            set.values.push({value: value, diff: 0})
          }
          return set
        })
      }
      return s
    })
    return this
  }

}
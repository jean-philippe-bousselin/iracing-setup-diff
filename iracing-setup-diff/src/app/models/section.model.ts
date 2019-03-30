import {Setting} from './setting.model'

export class Section {
  name?: string
  settings?: Setting[]
  hasDiff: boolean

  constructor(name = '', settings = [], hasDiff = false) {
    this.name = name
    this.settings = settings
    this.hasDiff = hasDiff
  }

  getSetting(name: string) : Setting|undefined {
    return this.settings.find(setting => setting.name == name)
  }

}
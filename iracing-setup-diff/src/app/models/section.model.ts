import {Setting} from './setting.model'

export interface Section {
  name?: string
  settings?: Setting[]
  hasDiff: boolean
}
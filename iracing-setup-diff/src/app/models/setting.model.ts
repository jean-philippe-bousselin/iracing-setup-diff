import { SettingValue } from "./settingValue.model";

export interface Setting {
  name: string
  values: SettingValue[]
  hasDiff: boolean
}
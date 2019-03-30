import { EventEmitter } from '@angular/core';
import { SetupTreeUtils,  } from './../models/setup-tree-utils.helper';
import { Component, OnInit, Input,Output, SimpleChange } from '@angular/core';
import { Setup } from '../models/setup.model';
import { Section } from '../models/section.model';

@Component({
  selector: 'setup-tree',
  templateUrl: './setup-tree.component.html',
  styleUrls: ['./setup-tree.component.css']
})
export class SetupTreeComponent extends SetupTreeUtils implements OnInit {

  
  @Input() set comparingSetup(value: Setup) {
    this._comparingSetup = value
    this.compareSetups()
  }
  @Output() setupChange: EventEmitter<Setup> = new EventEmitter()

  _comparingSetup: Setup
  file:any;
  fileReader = new FileReader()
  setup: Setup = new Setup()
  setupLoaded = false
  
  constructor() {
    super()
  }

  ngOnInit() {}

  fileChanged(e) {
    this.file = e.target.files[0];
    this.parseDocument(this.file) 
  }

  parseDocument(file) {
    this.fileReader.onload = (e) => {
      const cleanContent = this.cleanRawContent(this.fileReader.result.split("<br>"))
      var section = ''
      var setting = ''

      for(var i=0;i<cleanContent.length;i++) {
        
        const currentLine = cleanContent[i]
        if(this.isSection(currentLine)) {
          section = this.extractSectionName(currentLine)
          // this.setup.addSection({name: section, settings: [], hasDiff: false})
          this.setup.addSection(new Section(section))
        } else if(this.isAdditionalValue(currentLine)) {
          this.setup.addValue(
            this.extractSettingValue(currentLine),
            setting,
            section
          )
        } else { // is setting
          setting = this.extractSettingName(currentLine)
          this.setup.addSetting({name: setting, values: [], hasDiff: false}, section)
          this.setup.addValue(
            this.extractSettingValue(currentLine),
            setting,
            section
          )
        }
      }

      this.setupLoaded = true
      this.setupChange.emit(this.setup)
      this.compareSetups()
    }
    this.fileReader.readAsText(this.file);
  }

  unloadSetup() {
    this.setupLoaded = false
    this.setup = new Setup()
    this.setupChange.emit(this.setup)
  }

  compareSetups() {
    if(this._comparingSetup && !this._comparingSetup.isEmpty()) {
      if(this.setupLoaded) {
        this.setup = this.diffSetup(this._comparingSetup, this.setup)
      }
    }
  }
}

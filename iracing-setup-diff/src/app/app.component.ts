
import { Component } from '@angular/core';
import { Setup } from './models/setup.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  setup1: Setup = new Setup()

  refreshSetup(setup: Setup) {
    this.setup1 = setup
  }

}

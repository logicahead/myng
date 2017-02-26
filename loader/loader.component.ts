import {Component, Input} from '@angular/core';


@Component({
  selector: 'app-loader',
  templateUrl: './loader.template.html',
  styleUrls: ['./loader.style.scss']
})
export class LoaderComponent {
  @Input() public statusMessages: string[] = [];
  @Input() public size: number = 50;

  constructor() {
  }
}

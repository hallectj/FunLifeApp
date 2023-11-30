import { Component, Input } from '@angular/core';

@Component({
  selector: 'ribbon',
  templateUrl: './ribbon.component.html',
  styleUrls: ['./ribbon.component.scss']
})
export class RibbonComponent {
  @Input() public ribbonTitle: string = "";
  @Input() public ribbonWidth: string = "70%";
}

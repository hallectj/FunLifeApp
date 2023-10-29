import { Component, Input } from '@angular/core';
import { IPostExcerpt } from 'src/app/models/shared-models';

@Component({
  selector: 'history-main',
  templateUrl: './history-main.component.html',
  styleUrls: ['./history-main.component.scss']
})
export class HistoryMainComponent {
  @Input() histDescription: string = "";
  @Input() histImage: string = "";
  @Input() histYear: string = "";
  @Input() histTitle: string = "";

  ngOnInit(){

  }
}

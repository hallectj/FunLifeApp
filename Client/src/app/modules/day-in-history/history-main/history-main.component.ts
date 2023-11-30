import { Component, Input } from '@angular/core';
import { IMAGE_NOT_FOUND } from '../../../../app/common/base64Assests';
import { IPostExcerpt } from '../../../../app/models/shared-models';

@Component({
  selector: 'history-main',
  templateUrl: './history-main.component.html',
  styleUrls: ['./history-main.component.scss']
})
export class HistoryMainComponent {
  public noImageFound: string = IMAGE_NOT_FOUND;

  @Input() histDescription: string = "";
  @Input() histImage: string = "";
  @Input() histYear: string = "";
  @Input() histTitle: string = "";
}

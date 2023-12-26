import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeneralService } from '../../../../app/services/general.service';

@Component({
  selector: 'front-feature-card',
  templateUrl: './front-feature-card.component.html',
  styleUrls: ['./front-feature-card.component.scss']
})
export class FrontFeatureCardComponent {
  @Input() cardImg: string = "";
  @Input() cardTitle: string = "";
  @Input() cardAlt: string = "";
  @Input() cardButtonText: string = "";
  @Input() loading: boolean = false;
  @Input() routePath: string = "";
  @Input() cardImgB64: string = "";
  @Input() useB64: boolean = false;
  @Output() featureBtnClickEvent: EventEmitter<string> = new EventEmitter<string>();

  public isFlipped: boolean = false;

  constructor(public service: GeneralService){}

  flipCard() {
    this.isFlipped = !this.isFlipped;
  }

  public navigateToPath(){
    if(this.routePath === "/celebrity"){
      this.featureBtnClickEvent.emit(this.routePath);
    }else if(this.routePath === "/president"){
      this.featureBtnClickEvent.emit(this.routePath)
    }
  }
}

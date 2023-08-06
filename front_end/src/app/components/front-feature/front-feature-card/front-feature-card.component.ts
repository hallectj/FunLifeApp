import { Component, Input } from '@angular/core';

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
}

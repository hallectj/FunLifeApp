import { Component, Input } from '@angular/core';

@Component({
  selector: 'post-excerpt',
  templateUrl: './post-excerpt.component.html',
  styleUrls: ['./post-excerpt.component.scss']
})
export class PostExcerptComponent {
  @Input() excerptImg: string = "";
  @Input() excerptTitle: string = "";
  @Input() excerptDesc: string = "";

}

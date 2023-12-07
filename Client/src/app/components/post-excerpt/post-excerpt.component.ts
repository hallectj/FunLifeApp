import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMAGE_NOT_FOUND } from '../../../app/common/base64Assests';
import { IHistEvent, IPostExcerpt } from '../../../app/models/shared-models';
import { PostService } from '../../../app/services/post.service';

@Component({
  selector: 'post-excerpt',
  templateUrl: './post-excerpt.component.html',
  styleUrls: ['./post-excerpt.component.scss']
})
export class PostExcerptComponent {
  @Input() postExcerpt: IPostExcerpt;
  @Input() useRibbonYear: boolean = false;
  @Input() ribbonYear: number = 0;
  @Input() cursor: string = "pointer";
  @Output() postExcerptEvent: EventEmitter<IPostExcerpt> = new EventEmitter<IPostExcerpt>();

  public noImageFound: string = IMAGE_NOT_FOUND;

  constructor(public service: PostService, public router: Router ){}
}

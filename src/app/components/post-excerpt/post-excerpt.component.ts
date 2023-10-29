import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { slugify } from 'src/app/common/Toolbox/util';
import { IHistEvent, IPostExcerpt } from 'src/app/models/shared-models';
import { PostService } from 'src/app/services/post.service';

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

  constructor(public service: PostService, public router: Router ){}
}

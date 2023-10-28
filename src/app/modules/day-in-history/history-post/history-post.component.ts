import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-history-post',
  templateUrl: './history-post.component.html',
  styleUrls: ['./history-post.component.scss']
})
export class HistoryPostComponent {
  constructor(private route: ActivatedRoute){}

  ngOnInit(){
    this.route.paramMap.subscribe(async (params) => {
      const histEvtTitle = params.get("historyTitle");
      console.log(histEvtTitle);
    });
  }
}

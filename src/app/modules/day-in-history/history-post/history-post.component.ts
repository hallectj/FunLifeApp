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
      const histDay = params.get("day");
      const histMonth = params.get("month");
      const histTitle = params.get("historyTitle");
      console.log(histDay, histMonth, histTitle);
    });
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-other',
  templateUrl: './other.component.html',
  styleUrls: ['./other.component.scss']
})
export class OtherComponent {
  public websiteURL = "www.backthennow.com";
  public websiteName = "BackThenNow";
  public affiliates: string[] = ["Amazon", "NordVPN"];
  public contactEmail: string = "hallectj@gmail.com"

  constructor(public route: ActivatedRoute){}

  ngOnInit(){
    this.route.fragment.subscribe(fragment => {
      if(!fragment) return;

      if(fragment === 'terms' || fragment === 'affiliate' || fragment === 'contact'){
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }
}

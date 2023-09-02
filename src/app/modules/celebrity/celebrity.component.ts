import { Component } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-celebrity',
  templateUrl: './celebrity.component.html',
  styleUrls: ['./celebrity.component.scss']
})
export class CelebrityComponent {
  constructor(public service: GeneralService){}

  public ngOnInit(){
    this.service.subscribeToCelebInfo().subscribe((celebBirths: any) => {
      console.log("celeb births", celebBirths);
    })
  }
}

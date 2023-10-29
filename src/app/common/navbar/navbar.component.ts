import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  public today = new Date();
  public monthName: string = "";
  public strDateNum: string = "";

  public ngOnInit(){
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    this.monthName = months[this.today.getMonth()];
    this.strDateNum = this.today.getDate().toString();
  }
}

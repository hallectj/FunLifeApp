import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-sitemap',
  template: '',
})
export class SitemapComponent {
  public server_url = 'https://funlifeapp-011573cdfdc6.herokuapp.com';
  //public server_url = 'http://localhost:5000';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get(this.server_url + '/sitemap.xml', { responseType: 'text' })
      .subscribe((data) => console.log(data));
  }
}

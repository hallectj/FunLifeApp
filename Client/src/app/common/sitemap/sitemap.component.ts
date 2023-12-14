import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    const headers = new HttpHeaders({ 'Content-Type': 'text/xml' }).set('Accept', 'text/xml')
    this.http.get(this.server_url + '/sitemap.xml', { headers: headers, responseType: 'text' }).subscribe((data) => {
      document.write(data)
    })
  }
}

import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-sitemap',
  template: '',
})
export class SitemapComponent {
  public server_url = "https://fun-life-backend.onrender.com/api"
  //public server_url = "localhost:5000/api"

  constructor(private http: HttpClient, @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    const headers = new HttpHeaders({ 'Content-Type': 'text/xml' }).set('Accept', 'text/xml')
    this.http.get(this.server_url + '/sitemap.xml', { headers: headers, responseType: 'text' }).subscribe((data) => {
      this.document.write(data)
    })
  }
}

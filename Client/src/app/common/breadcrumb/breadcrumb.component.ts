import { Component } from '@angular/core';
import { BreadcrumbService } from '../../services/breadcrumb.service';
import { Router } from '@angular/router';
import { IBreadcrumb } from '../../models/breadcrumb-model';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  public breadcrumbs: IBreadcrumb[] = [];

  constructor(private breadcrumbService: BreadcrumbService, public router: Router) {}

  ngOnInit(): void {
    this.breadcrumbService.getBreadcrumb().subscribe( (breadcrumb: {valid_urls: string;
      long_urls: string}[] ) => {
      this.breadcrumbs = [];
      let bCrumbs = breadcrumb.map(v => v.valid_urls).join("").split(">");
      let bLongs = breadcrumb.map(v => v.long_urls).join("").split(">");
      for(let i = 0; i<bCrumbs.length; i++){
        const lastIdx = bCrumbs[i].lastIndexOf("/");
        let route = ['/' + bLongs[i].trim()]
        const obj: IBreadcrumb = {
          label: bCrumbs[i].substring(lastIdx+1, bCrumbs[i].length),
          url: route
        }
        this.breadcrumbs.push(obj);    
      }
    });
  }
}
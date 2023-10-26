import { Inject, Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { GeneralService } from '../../services/general.service'; // Replace with your actual service
import { deslugify } from '../Toolbox/util';

@Injectable()
export class CelebrityExistsResolver {
  constructor(private service: GeneralService, private router: Router) {}
  resolve: ResolveFn<boolean> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const parm = route.data['paramName'] || "";
    const name = deslugify(route.paramMap.get(parm)); 
    const resolveFunctionName = route.data['resolveFunction'];
    return this.service[resolveFunctionName](name).pipe(
      map((exists: string[]) => {
        if (exists.length > 0) {
          return true; // Celebrity exists, resolve the route
        } else {
          this.router.navigate(['/404']); // Redirect to the 404 route if the celebrity doesn't exist
          return false; // Don't resolve the route
        }
      })
    );
  };
}
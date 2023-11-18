import { Inject, Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { of } from 'rxjs';
import { GeneralService } from '../../services/general.service'; // Replace with your actual service
import { deslugify, isValidDate } from '../Toolbox/util';

@Injectable()
export class SingleRouteResolver {
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

@Injectable()
export class ArtistRouteResolver {
  constructor(private service: GeneralService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const artist = route.paramMap.get('artist');
    const resolveFunctionName = route.data['resolveFunction'];
    return this.service[resolveFunctionName](artist).pipe(
      map((exists: string[]) => {
        if (exists.length > 0 && !!exists[0]) {
          return true; // Celebrity exists, resolve the route
        } else {
          this.router.navigate(['/404']); // Redirect to the 404 route if the celebrity doesn't exist
          return false; // Don't resolve the route
        }
      })
    );
  }
}

@Injectable()
export class DateRouteResolver {
  constructor(private service: GeneralService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const month = route.paramMap.get('month');
    const day = route.paramMap.get('day');

    if (isValidDate(month, day, false, true)) {
      return of(true);
    } else {
      this.router.navigate(['/404']);
      return of(false);
    }
  }
}
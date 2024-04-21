import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.getUserFromLocalStorage().id != undefined) {
    return true; // Allow navigation
  } else {
    // User is not authenticated, redirect to login page and store return URL
    return router.createUrlTree(['dashboard']);
  }
};

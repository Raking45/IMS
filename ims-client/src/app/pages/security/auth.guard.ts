import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);
  const sessionUser = cookieService.get('sessionUser');

  if (sessionUser) {
    try {
      const user = JSON.parse(sessionUser);
      const userRoles: string[] = Array.isArray(user.roles) ? user.roles : [user.role];

      const expectedRoles = route.data['roles'] as string[] | undefined;
      if (expectedRoles && !expectedRoles.some(role => userRoles.includes(role))) {
        router.navigate(['/unauthorized']); // Optional route
        return false;
      }

      return true;
    } catch {
      router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }

  router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
  return false;
};


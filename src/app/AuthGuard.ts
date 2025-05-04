import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
    providedIn: 'root'
  })
  export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
      console.log('AuthGuard EXECUTED for URL:', state.url);
      console.log('AccessToken exists:', !!this.authService.getAccessToken());
  
      // Si déjà sur la page login, laisser passer
      if (state.url === '/') return true;
  
      if (this.authService.isLoggedIn()) {
        return true;
      }
  
      console.log('User not authenticated, redirecting...');
      alert('Veuillez vous connecter pour accéder à cette page');
      this.router.navigate(['/'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    }
  }
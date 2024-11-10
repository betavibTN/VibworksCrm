import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../components/Login/authServices/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Check if the token is near expiration
      if (this.authService.isTokenNearExpiration()) {
        this.authService.refreshToken().subscribe({
          next: (response) => {
            // Token refreshed successfully, proceed with route activation
            this.authService.storeToken(response.token);
          },
          error: () => {
            // Refresh failed, navigate to login page
            this.router.navigate(['/login']);
            return false;
          },
        });
      }
      return true; // User is logged in and token is valid
    } else {
      // If not logged in, redirect to the login page
      this.router.navigate(['/login']);
      return false;
    }
  }
}

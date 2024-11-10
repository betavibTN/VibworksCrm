import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fromEvent, interval, Observable, of, Subject, throwError, timer } from 'rxjs';
import { catchError, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import  { jwtDecode } from 'jwt-decode';

import { AuthResponse } from '../loginModels/AuthResponse';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl: string = environment.apiUrl+'/Authenticate';
  private token: string | null = null;
  private tokenExpiration$ = new Subject<void>();
  private lastActiveTime = new Date().getTime();
  private readonly inactivityTimeout = 300000; // 5 minutes in milliseconds

  constructor(private http: HttpClient) {
    this.trackUserActivity();
    this.checkSession();
  }

  login(username: string, password: string): Observable<AuthResponse> {
    const body = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, body, { headers });
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, userData).pipe(
      catchError(this.handleError)
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/refresh`, {}).pipe(
      tap(response => this.storeToken(response.token)), // Store new token after refreshing
      catchError(this.handleError)
    );
  }

  signOut(): void {
    localStorage.removeItem('accessToken');
    this.token = null;
    this.tokenExpiration$.next();
  }

  storeToken(tokenValue: string): void {
    localStorage.setItem('accessToken', tokenValue);
    this.token = tokenValue;
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('accessToken');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    const { exp } = jwtDecode<{ exp: number }>(token);
    return exp * 1000 < Date.now(); // Multiply by 1000 because `exp` is in seconds, and `Date.now()` is in milliseconds.
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something went wrong. Please try again later.';

    if (error.status === 401) {
      errorMessage = error.error.message === 'You need to confirm your email before logging in.'
        ? 'You need to confirm your email before logging in.'
        : error.error.message === 'Invalid username or password.'
          ? 'Invalid username or password.'
          : errorMessage;
    }

    console.error('An error occurred:', error);
    return throwError(errorMessage);
  }
   isTokenNearExpiration(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const { exp } = jwtDecode<{ exp: number }>(token);
    const expirationTime = exp * 1000;
    const timeLeft = expirationTime - Date.now();

    // Check if the token will expire within the next 5 minutes
    return timeLeft < 5 * 60 * 1000;
  }
  private trackUserActivity(): void {
    const activityEvents$ = fromEvent(document, 'mousemove').pipe(
      switchMap(() => {
        // Only attempt refresh if token is close to expiration
        if (this.getToken() && this.isTokenNearExpiration()) {
          return this.refreshToken();
        }
        return of(null); // No need to refresh if not close to expiration
      }),
      catchError(() => of(null)) // Handle refresh failure
    );

    activityEvents$.subscribe();
  }

  private checkSession() {
    interval(60000) // Check every minute
      .pipe(
        takeUntil(this.tokenExpiration$),
        switchMap(() => {
          const isUserActive = Date.now() - this.lastActiveTime < this.inactivityTimeout;
          const token = this.getToken();

          if (token && isUserActive && !this.isTokenExpired(token)) {
            return this.refreshToken();
          } else if (!isUserActive || this.isTokenExpired(token!)) {
            this.signOut();
            return of(null);
          }

          return of(null);
        }),
        catchError(() => of(null)) // Handle refresh failure gracefully
      )
      .subscribe();
  }
}

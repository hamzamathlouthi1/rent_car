import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';

export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  user: UserProfile;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = '/api/auth';
  readonly currentUser = signal<UserProfile | null>(null);
  readonly avatarUrl = signal<string | null>(null);
  constructor(private readonly http: HttpClient) {}
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(tap(response => this.saveSession(response)));
  }
  register(firstName: string, lastName: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { firstName, lastName, email, password }).pipe(tap(response => this.saveSession(response)));
  }
  restoreSession(): Observable<UserProfile | null> {
    if (this.currentUser()) return of(this.currentUser());
    if (!localStorage.getItem('fm_access_token')) return of(null);
    return this.http.get<UserProfile>(`${this.apiUrl}/me`).pipe(
      tap(user => this.currentUser.set(user)),
      catchError(() => { this.logout(); return of(null); }),
    );
  }
  logout(): void {
    localStorage.removeItem('fm_access_token');
    this.currentUser.set(null);
    this.clearAvatar();
  }
  loadAvatar(): void { this.http.get(`${this.apiUrl}/me/profile-picture`, { responseType: 'blob' }).subscribe({ next: blob => { this.clearAvatar(); this.avatarUrl.set(URL.createObjectURL(blob)); }, error: () => this.clearAvatar() }); }
  uploadAvatar(data: FormData): Observable<void> { return this.http.put<void>(`${this.apiUrl}/me/profile-picture`, data).pipe(tap(() => this.loadAvatar())); }
  deleteAvatar(): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/me/profile-picture`).pipe(tap(() => this.clearAvatar())); }
  changePassword(currentPassword: string, newPassword: string): Observable<void> { return this.http.put<void>(`${this.apiUrl}/me/password`, { currentPassword, newPassword }); }
  private clearAvatar(): void { const current = this.avatarUrl(); if (current) URL.revokeObjectURL(current); this.avatarUrl.set(null); }
  private saveSession(response: AuthResponse): void {
    localStorage.setItem('fm_access_token', response.token);
    this.currentUser.set(response.user);
  }
}

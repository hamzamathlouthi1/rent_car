import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService, UserProfile } from './auth.service';

@Component({ selector: 'app-admin-users', imports: [DatePipe, RouterLink], templateUrl: './admin-users.html', styleUrl: './admin-users.scss' })
export class AdminUsers implements OnInit {
  protected readonly users = signal<UserProfile[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly success = signal('');
  protected readonly deletingId = signal<number | null>(null);
  protected readonly regularUsers = computed(() => this.users().filter(user => user.role !== 'ADMIN').length);
  protected readonly admins = computed(() => this.users().filter(user => user.role === 'ADMIN').length);

  constructor(private readonly http: HttpClient, protected readonly auth: AuthService, private readonly router: Router) {}
  ngOnInit(): void { this.load(); }

  protected load(): void {
    this.loading.set(true);
    this.http.get<UserProfile[]>('/api/admin/users').pipe(finalize(() => this.loading.set(false))).subscribe({
      next: users => this.users.set(users),
      error: () => this.error.set('Impossible de charger les utilisateurs.')
    });
  }

  protected deleteUser(user: UserProfile): void {
    if (!confirm(`Supprimer définitivement le compte de ${user.firstName} ${user.lastName} ?`)) return;
    this.deletingId.set(user.id); this.error.set(''); this.success.set('');
    this.http.delete(`/api/admin/users/${user.id}`).pipe(finalize(() => this.deletingId.set(null))).subscribe({
      next: () => { this.users.update(users => users.filter(item => item.id !== user.id)); this.success.set(`Le compte de ${user.firstName} ${user.lastName} a été supprimé.`); },
      error: error => this.error.set(error.error?.detail ?? error.error?.message ?? 'Suppression impossible.')
    });
  }

  protected logout(): void { this.auth.logout(); this.router.navigateByUrl('/login'); }
}

import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from './auth.service';

@Component({ selector: 'app-login', imports: [ReactiveFormsModule, RouterLink], templateUrl: './login.html', styleUrl: './auth-layout.scss' })
export class Login {
  protected readonly loading = signal(false); protected readonly error = signal(''); protected readonly form;
  constructor(private readonly fb: FormBuilder, private readonly auth: AuthService, private readonly router: Router, private readonly route: ActivatedRoute) {
    this.form = this.fb.nonNullable.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });
  }
  protected submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true); this.error.set(''); const value = this.form.getRawValue();
    this.auth.login(value.email, value.password).pipe(finalize(() => this.loading.set(false))).subscribe({ next: response => { const returnUrl=this.route.snapshot.queryParamMap.get('returnUrl'); this.router.navigateByUrl(response.user.role === 'ADMIN' ? '/admin/cars' : returnUrl?.startsWith('/') ? returnUrl : '/mes-reservations/reservations'); }, error: err => this.error.set(err.error?.message ?? 'Email ou mot de passe incorrect.') });
  }
}

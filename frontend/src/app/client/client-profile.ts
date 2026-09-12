import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthService } from '../user/auth.service';

@Component({ selector: 'app-client-profile', imports: [ReactiveFormsModule], templateUrl: './client-profile.html', styleUrl: './client-profile.scss' })
export class ClientProfile implements OnDestroy {
  protected readonly profileForm; protected readonly passwordForm; protected loadingPicture = false; protected loadingPassword = false; protected message = ''; protected error = '';
  constructor(private readonly fb: FormBuilder, protected readonly auth: AuthService) { const user = auth.currentUser(); this.profileForm = fb.nonNullable.group({ firstName: [user?.firstName ?? '', Validators.required], lastName: [user?.lastName ?? '', Validators.required], email: [{ value: user?.email ?? '', disabled: true }] }); this.passwordForm = fb.nonNullable.group({ currentPassword: ['', Validators.required], newPassword: ['', [Validators.required, Validators.minLength(8)]], confirmation: ['', Validators.required] }); }
  protected savePicture(event: Event) { const file = (event.target as HTMLInputElement).files?.[0]; if (!file) return; if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 2 * 1024 * 1024) { this.error = 'Choisissez une image JPG, PNG ou WebP de moins de 2 Mo.'; return; } const data = new FormData(); data.append('file', file); this.loadingPicture = true; this.error = ''; this.auth.uploadAvatar(data).pipe(finalize(() => this.loadingPicture = false)).subscribe({ next: () => this.message = 'Photo de profil mise à jour.', error: e => this.error = e.error?.message ?? 'Impossible de modifier la photo.' }); }
  protected removePicture() { this.auth.deleteAvatar().subscribe({ next: () => this.message = 'Photo supprimée.', error: () => this.error = 'Impossible de supprimer la photo.' }); }
  protected changePassword() { if (this.passwordForm.invalid) { this.passwordForm.markAllAsTouched(); return; } const value = this.passwordForm.getRawValue(); if (value.newPassword !== value.confirmation) { this.error = 'Les nouveaux mots de passe ne correspondent pas.'; return; } this.loadingPassword = true; this.error = ''; this.auth.changePassword(value.currentPassword, value.newPassword).pipe(finalize(() => this.loadingPassword = false)).subscribe({ next: () => { this.passwordForm.reset(); this.message = 'Mot de passe modifié avec succès.'; }, error: e => this.error = e.error?.message ?? 'Mot de passe actuel incorrect.' }); }
  ngOnDestroy() {}
}

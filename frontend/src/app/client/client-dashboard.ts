import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../user/auth.service';

@Component({ selector: 'app-client-dashboard', imports: [RouterLink, RouterOutlet], templateUrl: './client-dashboard.html', styleUrl: './client-dashboard.scss' })
export class ClientDashboard implements OnInit {
  constructor(protected readonly auth: AuthService, private readonly router: Router) {}
  ngOnInit() { this.auth.loadAvatar(); }
  protected logout() { this.auth.logout(); this.router.navigateByUrl('/login'); }
}

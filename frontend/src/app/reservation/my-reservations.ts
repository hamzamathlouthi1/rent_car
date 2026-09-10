import { Component, OnInit, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../user/auth.service';
interface Reservation{id:number;carId:number;carName:string;carImage:string;phone:string;pickupLocation:string;startDate:string;endDate:string;totalPrice:number;status:'PENDING'|'APPROVED'|'REJECTED';createdAt:string;}
@Component({selector:'app-my-reservations',imports:[RouterLink],templateUrl:'./my-reservations.html',styleUrl:'./my-reservations.scss'})
export class MyReservations implements OnInit{
 protected readonly reservations=signal<Reservation[]>([]);protected readonly loading=signal(true);protected readonly error=signal('');protected readonly pending=computed(()=>this.reservations().filter(r=>r.status==='PENDING').length);protected readonly approved=computed(()=>this.reservations().filter(r=>r.status==='APPROVED').length);
 constructor(private readonly http:HttpClient,protected readonly auth:AuthService,private readonly router:Router){}
 ngOnInit(){this.auth.restoreSession().subscribe(user=>{if(!user){this.router.navigate(['/login'],{queryParams:{returnUrl:'/mes-reservations'}});return;}this.load();});}
 protected logout(){this.auth.logout();this.router.navigateByUrl('/login');}
 private load(){this.http.get<Reservation[]>('/api/reservations/mine').pipe(finalize(()=>this.loading.set(false))).subscribe({next:items=>this.reservations.set(items),error:()=>this.error.set('Impossible de charger vos réservations pour le moment.')});}
}

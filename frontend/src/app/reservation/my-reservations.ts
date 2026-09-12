import { Component, OnInit, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../user/auth.service';
interface Reservation{id:number;carId:number;carName:string;carImage:string;phone:string;pickupLocation:string;pickupMode?:string;startDate:string;endDate:string;totalPrice:number;status:'PENDING'|'APPROVED'|'REJECTED';createdAt:string;}
@Component({selector:'app-my-reservations',imports:[RouterLink],templateUrl:'./my-reservations.html',styleUrl:'./my-reservations.scss'})
export class MyReservations implements OnInit{
 protected readonly reservations=signal<Reservation[]>([]);protected readonly loading=signal(true);protected readonly error=signal('');protected readonly pending=computed(()=>this.reservations().filter(r=>r.status==='PENDING').length);protected readonly approved=computed(()=>this.reservations().filter(r=>r.status==='APPROVED').length);
 constructor(private readonly http:HttpClient,protected readonly auth:AuthService,private readonly router:Router){}
 ngOnInit(){this.load();}
 protected logout(){this.auth.logout();this.router.navigateByUrl('/login');}
 protected retry(){this.error.set('');this.loading.set(true);this.load();}
 protected formatDate(value:string){return new Intl.DateTimeFormat('fr-FR',{weekday:'short',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(value));}
 protected pickupLabel(reservation:Reservation){return reservation.pickupMode==='DOMICILE'?'À domicile':reservation.pickupMode==='AEROPORT'?'À l’aéroport':reservation.pickupLocation;}
 private load(){this.http.get<Reservation[]>('/api/reservations/mine').pipe(finalize(()=>this.loading.set(false))).subscribe({next:items=>this.reservations.set(items),error:()=>this.error.set('Impossible de charger vos réservations pour le moment.')});}
}

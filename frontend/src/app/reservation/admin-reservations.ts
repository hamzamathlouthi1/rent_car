import { Component, OnInit, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../user/auth.service';
interface Reservation{id:number;carName:string;carImage:string;userEmail:string;phone:string;pickupLocation:string;startDate:string;endDate:string;totalPrice:number;status:'PENDING'|'APPROVED'|'REJECTED';createdAt:string;}
@Component({selector:'app-admin-reservations',imports:[RouterLink],templateUrl:'./admin-reservations.html',styleUrl:'./admin-reservations.scss'})
export class AdminReservations implements OnInit{
 protected readonly reservations=signal<Reservation[]>([]);protected readonly loading=signal(true);protected readonly approvingId=signal<number|null>(null);protected readonly deletingId=signal<number|null>(null);protected readonly error=signal('');protected readonly success=signal('');protected readonly pending=computed(()=>this.reservations().filter(r=>r.status==='PENDING').length);protected readonly approved=computed(()=>this.reservations().filter(r=>r.status==='APPROVED').length);
 constructor(private readonly http:HttpClient,protected readonly auth:AuthService,private readonly router:Router){}ngOnInit(){this.http.get<Reservation[]>('/api/admin/reservations').pipe(finalize(()=>this.loading.set(false))).subscribe({next:r=>this.reservations.set(r),error:()=>this.error.set('Impossible de charger les réservations.')});}
 protected approve(r:Reservation){if(!confirm(`Confirmer la réservation de ${r.userEmail} après votre appel ?`))return;this.approvingId.set(r.id);this.error.set('');this.http.patch<Reservation>(`/api/admin/reservations/${r.id}/approve`,{}).pipe(finalize(()=>this.approvingId.set(null))).subscribe({next:updated=>{this.reservations.update(all=>all.map(item=>item.id===updated.id?updated:item));this.success.set('Réservation confirmée.');},error:()=>this.error.set('Confirmation impossible.')});}
 protected remove(r:Reservation){if(!confirm(`Supprimer définitivement la réservation de ${r.userEmail} pour ${r.carName} ? Les justificatifs associés seront aussi supprimés.`))return;this.deletingId.set(r.id);this.error.set('');this.success.set('');this.http.delete(`/api/admin/reservations/${r.id}`).pipe(finalize(()=>this.deletingId.set(null))).subscribe({next:()=>{this.reservations.update(all=>all.filter(item=>item.id!==r.id));this.success.set('Réservation et justificatifs supprimés.');},error:()=>this.error.set('La suppression de la réservation a échoué.')});}
 protected logout(){this.auth.logout();this.router.navigateByUrl('/login');}
}

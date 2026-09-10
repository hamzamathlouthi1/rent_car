import { Injectable, signal } from '@angular/core';
export interface ReservableCar{id:number;name:string;category:string;price:number;image:string;seats:number;transmission:string;fuel:string;badge?:string;}
@Injectable({providedIn:'root'})export class ReservationModalService{readonly car=signal<ReservableCar|null>(null);open(car:ReservableCar){this.car.set(car);document.body.style.overflow='hidden';}close(){this.car.set(null);document.body.style.overflow='';}}

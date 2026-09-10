import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from './auth.service';

interface Car { id:number; name:string; category:string; price:number; seats:number; transmission:string; fuel:string; badge?:string; image:string; images:string[]; }
@Component({selector:'app-admin-cars',imports:[FormsModule,RouterLink],templateUrl:'./admin-cars.html',styleUrl:'./admin-cars.scss'})
export class AdminCars implements OnInit {
 protected readonly cars=signal<Car[]>([]);protected readonly loading=signal(false);protected readonly loadingCars=signal(true);protected readonly deletingId=signal<number|null>(null);protected readonly error=signal('');protected readonly success=signal('');protected imageFiles:File[]=[];protected imagePreviews:string[]=[];protected model=this.emptyModel();
 constructor(private readonly http:HttpClient,protected readonly auth:AuthService,private readonly router:Router){} ngOnInit(){this.load();}
 protected load(){this.loadingCars.set(true);this.http.get<Car[]>('/api/cars').pipe(finalize(()=>this.loadingCars.set(false))).subscribe({next:cars=>this.cars.set(cars),error:()=>this.error.set('Le catalogue est momentanément indisponible.')});}
 protected chooseImages(event:Event){const files=Array.from((event.target as HTMLInputElement).files??[]);if(!files.length)return;if(files.some(file=>!file.type.startsWith('image/'))){this.error.set('Sélectionnez uniquement des images.');return;}this.clearPreviews();this.imageFiles=files.slice(0,8);this.imagePreviews=this.imageFiles.map(file=>URL.createObjectURL(file));this.error.set('');}
 protected removePreview(index:number){URL.revokeObjectURL(this.imagePreviews[index]);this.imageFiles.splice(index,1);this.imagePreviews.splice(index,1);}
 protected submit(){if(!this.imageFiles.length){this.error.set('Ajoutez au moins une photo du véhicule.');return;}const data=new FormData();Object.entries(this.model).forEach(([key,value])=>data.append(key,String(value)));this.imageFiles.forEach(file=>data.append('images',file));this.loading.set(true);this.error.set('');this.success.set('');this.http.post<Car>('/api/admin/cars',data).pipe(finalize(()=>this.loading.set(false))).subscribe({next:car=>{this.cars.update(cars=>[car,...cars]);this.model=this.emptyModel();this.imageFiles=[];this.clearPreviews();this.success.set(`${car.name} a été ajouté à la flotte.`);},error:error=>this.error.set(error.error?.detail??error.error?.message??"Échec de l'ajout du véhicule.")});}
 protected remove(car:Car){if(!confirm(`Supprimer définitivement ${car.name} et toutes ses images ?`))return;this.deletingId.set(car.id);this.http.delete(`/api/admin/cars/${car.id}`).pipe(finalize(()=>this.deletingId.set(null))).subscribe({next:()=>{this.cars.update(cars=>cars.filter(item=>item.id!==car.id));this.success.set(`${car.name} a été supprimé.`);},error:()=>this.error.set('La suppression du véhicule a échoué.')});}
 protected logout(){this.auth.logout();this.router.navigateByUrl('/login');} private clearPreviews(){this.imagePreviews.forEach(url=>URL.revokeObjectURL(url));this.imagePreviews=[];} private emptyModel(){return{name:'',category:'Citadine',price:90,seats:5,transmission:'Manuelle',fuel:'Essence',badge:''};}
}

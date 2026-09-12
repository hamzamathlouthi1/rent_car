import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './user/login';
import { Register } from './user/register';
import { AdminUsers } from './user/admin-users';
import { adminGuard } from './user/admin.guard';
import { AdminCars } from './user/admin-cars';
import { AdminReservations } from './reservation/admin-reservations';
import { ReservationModal } from './reservation/reservation-modal';
import { MyReservations } from './reservation/my-reservations';
import { clientGuard } from './user/client.guard';
import { ClientDashboard } from './client/client-dashboard';
import { ClientProfile } from './client/client-profile';

export const routes: Routes = [
  { path: '', component: Home, title: 'FM Rent A Car' },
  { path: 'login', component: Login, title: 'Connexion | FM Rent A Car' },
  { path: 'register', component: Register, title: 'Inscription | FM Rent A Car' },
  { path: 'reservation/:id', component: ReservationModal, title: 'Réserver votre voiture | FM Rent A Car' },
  { path: 'mes-reservations', component: ClientDashboard, canActivate: [clientGuard], children: [
    { path: '', pathMatch: 'full', redirectTo: 'reservations' },
    { path: 'reservations', component: MyReservations, title: 'Mes réservations | FM Rent A Car' },
    { path: 'profil', component: ClientProfile, title: 'Mon profil | FM Rent A Car' },
  ] },
  { path: 'admin/users', component: AdminUsers, canActivate: [adminGuard], title: 'Utilisateurs | Administration FM' },
  { path: 'admin/cars', component: AdminCars, canActivate: [adminGuard], title: 'Voitures | Administration FM' },
  { path: 'admin/reservations', component: AdminReservations, canActivate: [adminGuard], title: 'Réservations | Administration FM' },
  { path: '**', redirectTo: '' },
];

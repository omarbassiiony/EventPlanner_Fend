import { Routes } from '@angular/router';
import { Login } from './UserManagement/login/login';
import { SignUp } from './UserManagement/sign-up/sign-up';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: Login},
    { path: 'signup', component: SignUp}
];

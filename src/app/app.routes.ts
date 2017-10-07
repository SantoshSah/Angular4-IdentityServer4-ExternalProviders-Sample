import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { UnauthorizeComponent } from './unauthorize';
import { NoContentComponent } from './no-content';
import { DataResolver } from './app.resolver';
import { AuthGuard } from './shared/guard/auth.guard';

export const ROUTES: Routes = [

    { path: '',      component: HomeComponent },
    { path: 'home',  component: HomeComponent },
    { path: 'unauthorize', component: UnauthorizeComponent },
    { path: 'user-account', loadChildren: './+user-account#UserAccountModule'},
    { path: '**',    component: NoContentComponent },
];
